import Stripe from "stripe";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * @desc    Create Stripe Payment Intent (REAL cart data)
 * @route   POST /api/payments/create-intent
 * @access  Customer
 */
export const createPaymentIntent = async (req, res) => {
  try {
    /* ---------------- ENV VALIDATION ---------------- */

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        message: "Stripe secret key not configured",
      });
    }

    /* ---------------- INIT STRIPE ---------------- */

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    /* ---------------- FETCH CART ---------------- */

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ---------------- CALCULATE TOTAL ---------------- */

    let totalAmount = 0;

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

      // ✅ Use DB price (never frontend)
      totalAmount += product.price * item.quantity;
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid cart total",
      });
    }

    /* ---------------- CREATE PAYMENT INTENT ---------------- */

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },

      metadata: {
        userId: req.user._id.toString(),
        cartId: cart._id.toString(),
        purpose: "Raqsa Checkout",
      },
    });

    /* ---------------- RESPONSE ---------------- */

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("STRIPE PAYMENT ERROR:", error);
    res.status(500).json({
      message: "Payment initialization failed",
      error: error.message,
    });
  }
};
