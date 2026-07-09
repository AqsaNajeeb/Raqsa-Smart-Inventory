import Product from '../models/Product.js';
import { Resend } from "resend";

/**
 * @desc    Get all products (Public)
 * @route   GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('vendorId', 'name')
      .populate('category', 'name subcategories');

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Add new product (Vendor only)
 * @route   POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      price,
      stockQuantity,
      reorderLevel,
      description
    } = req.body;

    // 🖼️ Build image array from multer
    const images = req.files
    ? req.files.map(file => `/uploads/${file.filename}`)
    : [];


    const product = new Product({
      name,
      category,
      subcategory,
      price: Number(price),
      images,
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
      description: description || "",
      vendorId: req.user._id
    });

    const savedProduct = await product.save();

    // 🚨 Low stock email
    if (savedProduct.stockQuantity <= savedProduct.reorderLevel) {
      try {
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Raqsa Store <onboarding@resend.dev>",
            to: process.env.ADMIN_EMAIL,
            subject: `⚠️ Low Stock Alert: ${savedProduct.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #e11d48;">Low Stock Alert</h2>
                <p>The product <strong>${savedProduct.name}</strong> has low stock.</p>
                <p>
                  Current stock: ${savedProduct.stockQuantity}<br/>
                  Reorder level: ${savedProduct.reorderLevel}
                </p>
                <p>Please restock this item as soon as possible.</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Low stock email failed:", emailErr);
      }
    }

    res.status(201).json({
      success: true,
      product: savedProduct
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



/**
 * @desc    Get logged-in vendor products
 * @route   GET /api/products/my-products
 */
export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendorId: req.user._id
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalProducts: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update product (Vendor only)
 * @route   PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ✅ Update fields
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.subcategory !== undefined) product.subcategory = req.body.subcategory;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.stockQuantity !== undefined) product.stockQuantity = Number(req.body.stockQuantity);
    if (req.body.reorderLevel !== undefined) product.reorderLevel = Number(req.body.reorderLevel);
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.images !== undefined) product.images = req.body.images;

    const updatedProduct = await product.save({ validateBeforeSave: true });

    // 🚨 Low stock email to ADMIN_EMAIL
    if (updatedProduct.stockQuantity <= updatedProduct.reorderLevel) {
      try {
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Raqsa Store <onboarding@resend.dev>",
            to: process.env.ADMIN_EMAIL, // use fixed admin email
            subject: `⚠️ Low Stock Alert: ${updatedProduct.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #e11d48;">Low Stock Alert</h2>
                <p>The product <strong>${updatedProduct.name}</strong> has low stock.</p>
                <p>
                  Current stock: ${updatedProduct.stockQuantity}<br/>
                  Reorder level: ${updatedProduct.reorderLevel}
                </p>
                <p>Please restock this item as soon as possible.</p>
                <hr />
                <p style="font-size:12px;color:#888;">Automated message. Do not reply.</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Low stock email failed:", emailErr);
      }
    }

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete product (Vendor only)
 * @route   DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get low stock products (Smart Inventory)
 * @route   GET /api/products/low-stock
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendorId: req.user._id,
      $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
    });

    res.json({
      success: true,
      lowStockCount: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
