import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, vendorOnly } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// VENDOR
router.post('/', protect, vendorOnly, createCategory);
router.put('/:id', protect, vendorOnly, updateCategory);
router.delete('/:id', protect, vendorOnly, deleteCategory);

export default router;
