import express from 'express';
import { protect, vendorOnly } from '../middleware/auth.js';
import { getVendorDashboard, getTopProducts } from '../controllers/vendorController.js';

const router = express.Router();

router.get('/dashboard', protect, vendorOnly, getVendorDashboard);
router.get('/top-products', protect, vendorOnly, getTopProducts);

export default router;
