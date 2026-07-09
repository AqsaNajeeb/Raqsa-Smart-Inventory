import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * GET CART (on login / refresh)
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.productId"
    );
    res.json({ cart: cart || { items: [] } });
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADD TO CART
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    res.status(200).json({
    success: true,
    cart: populatedCart
  });
  } catch (err) {
    console.error("Failed to add to cart:", err);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

/**
 * UPDATE QUANTITY
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );
    res.json({ cart: populatedCart });
  } catch (err) {
    console.error("Failed to update cart item:", err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

/**
 * REMOVE ITEM
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    res.json({ cart: populatedCart });
  } catch (err) {
    console.error("Failed to remove cart item:", err);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};

/**
 * CLEAR CART (after order)
 */
export const clearCart = async (userId) => {
  try {
    await Cart.findOneAndDelete({ user: userId });
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
};
