import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/* =========================
   GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    let vendorMeta = null;
    if (user.role === 'vendor') {
      const totalProducts = await Product.countDocuments({ vendorId: user._id });
      vendorMeta = { totalProducts };
    }

    res.json({ success: true, user, vendorMeta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Protect immutable fields
    delete updates.email;
    delete updates.role;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET MY ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'vendor') {
      orders = await Order.find({ vendorId: req.user._id }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET MY WISHLIST
========================= */
export const getMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
