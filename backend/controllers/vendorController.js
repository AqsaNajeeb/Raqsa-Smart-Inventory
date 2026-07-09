import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * @desc    Vendor dashboard overview
 * @route   GET /api/vendor/dashboard
 * @access  Vendor
 */
export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const totalProducts = await Product.countDocuments({ vendorId });

    const lowStockProducts = await Product.find({
      vendorId,
      $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
    });

    const orders = await Order.find({ vendorId });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const totalItemsSold = orders.reduce((sum, order) => {
      return sum + order.products.reduce(
        (inner, p) => inner + p.quantity,
        0
      );
    }, 0);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders: orders.length,
        totalRevenue,
        totalItemsSold,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Top selling products
 * @route   GET /api/vendor/top-products
 */
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id })
      .sort({ soldCount: -1 })
      .limit(5);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
