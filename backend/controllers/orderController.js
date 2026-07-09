import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

/**
 * @desc    Create order from cart (COD or Stripe)
 * @route   POST /api/orders
 * @access  Customer
 */
export const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,        // "COD" | "STRIPE"
      paymentConfirmed,     // true after Stripe success
      paymentIntentId,
      shippingAddress,
    } = req.body;

    /* ---------- VALIDATIONS ---------- */

    if (!["COD", "STRIPE"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    if (paymentMethod === "STRIPE" && !paymentConfirmed) {
      return res.status(400).json({
        message: "Stripe payment not confirmed",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ---------- GROUP ITEMS BY VENDOR ---------- */

    const vendorOrders = {};

    for (const item of cart.items) {
      const product = item.productId;

      if (!product || !product.isActive) {
        return res.status(404).json({
          message: "One or more products are unavailable",
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const vendorId = product.vendorId.toString();
      if (!vendorId) {
        return res.status(400).json({ success: false, message: `Vendor not found for ${product.name}` });
      }

      if (!vendorOrders[vendorId]) {
        vendorOrders[vendorId] = [];
      }

      vendorOrders[vendorId].push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    /* ---------- CREATE ORDERS ---------- */

    const createdOrders = [];

    for (const vendorId in vendorOrders) {
      const products = vendorOrders[vendorId];

      const subtotal = products.reduce(
        (sum, p) => Number(sum + p.price * p.quantity),
        0
      );

      const tax = subtotal * 0.08;
      const shipping = subtotal > 500 ? 0 : 20;
      const totalPrice = subtotal + tax + shipping;

      const order = await Order.create({
        customer: req.user._id,
        vendorId,
        products,

        subtotal,
        tax,
        shipping,
        totalPrice,

        paymentMethod,
        paymentStatus: paymentMethod === "STRIPE" ? "PAID" : "PENDING",
        stripePaymentIntentId:
          paymentMethod === "STRIPE" ? paymentIntentId : null,
        status: "confirmed",
        shippingAddress,
        stockUpdated: paymentMethod === "STRIPE",
      });

      // ✅ Deduct stock immediately for Stripe payments
      if (paymentMethod === "STRIPE") {
        for (const item of products) {
          const product = await Product.findById(item.productId);
          if (!product) continue;

          product.stockQuantity -= item.quantity;
          product.soldCount += item.quantity;
          await product.save();
        }
      }

      createdOrders.push(order);
    }

    /* ---------- SEND EMAIL (ONCE) ---------- */

    const emailSubtotal = createdOrders.reduce((sum, o) => Number(sum + o.subtotal), 0);
    const emailTax = createdOrders.reduce((sum, o) => Number(sum + o.tax), 0);
    const emailShipping = createdOrders.reduce((sum, o) => Number(sum + o.shipping), 0);
    const emailTotal = createdOrders.reduce((sum, o) => Number(sum + o.totalPrice), 0);

    await sendOrderConfirmationEmail({
      to: req.user.email,
      orderIds: createdOrders.map(o => o._id),
      products: createdOrders.flatMap(o => o.products),
      subtotal: emailSubtotal,
      tax: emailTax,
      shipping: emailShipping,
      totalPrice: emailTotal,
      paymentMethod,
    });


    /* ---------- CLEAR CART ---------- */

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orders: createdOrders,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in customer orders
 * @route   GET /api/orders/my-orders
 * @access  Customer
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get vendor orders
 * @route   GET /api/orders/vendor
 * @access  Vendor
 */

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('customer', 'name email') // keeps customer info
      .populate('products.productId', 'name price') // <-- populate product details
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update order status + auto stock deduction (COD)
 * @route   PUT /api/orders/:id/status
 * @access  Vendor
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    const validStatuses = ["confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }
    
    const order = await Order.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    // ✅ Deduct stock ONLY ONCE (mainly for COD)
    if (
      ["confirmed", "shipped", "delivered"].includes(status) &&
      !order.stockUpdated
    ) {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        if (product.stockQuantity < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
        }

        product.stockQuantity -= item.quantity;
        product.soldCount += item.quantity;
        await product.save();
      }

      order.stockUpdated = true;
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};