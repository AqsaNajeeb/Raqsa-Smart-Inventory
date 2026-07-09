import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getProfile,
  updateProfile,
  getMyOrders,
  getMyWishlist
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET profile
router.get('/', protect, getProfile);

// GET wishlist
router.get('/wishlist', protect, getMyWishlist);

// UPDATE profile
router.put(
  '/',
  protect,
  [
    body('firstname')
      .optional()
      .notEmpty()
      .withMessage('First name cannot be empty'),

    body('lastname')
      .optional()
      .notEmpty()
      .withMessage('Last name cannot be empty'),

    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid phone number'),

    body('language')
      .optional()
      .isString()
      .withMessage('Language must be a string'),

    body('currency')
      .optional()
      .isString()
      .withMessage('Currency must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  updateProfile
);

// GET my orders
router.get('/orders', protect, getMyOrders);

export default router;
