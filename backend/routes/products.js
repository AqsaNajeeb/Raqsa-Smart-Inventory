import express from 'express';
import multer from 'multer';
import { protect, vendorOnly } from '../middleware/auth.js';
import {
  createProduct,
  getAllProducts,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController.js';

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* ================= PUBLIC ================= */
router.get('/', getAllProducts);

/* ================= VENDOR ================= */

// ➕ ADD PRODUCT (WITH IMAGE)
router.post(
  '/',
  protect,
  vendorOnly,
  upload.array('images', 5),
  createProduct
);

// 📦 MY PRODUCTS
router.get(
  '/my-products',
  protect,
  vendorOnly,
  getVendorProducts
);

// 🚨 LOW STOCK
router.get(
  '/low-stock',
  protect,
  vendorOnly,
  getLowStockProducts
);

// ✏️ UPDATE PRODUCT (IMAGE OPTIONAL)
router.put(
  '/:id',
  protect,
  vendorOnly,
  upload.array('images', 5),
  updateProduct
);

// ❌ DELETE
router.delete(
  '/:id',
  protect,
  vendorOnly,
  deleteProduct
);

export default router;
