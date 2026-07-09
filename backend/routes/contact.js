import express from 'express';
import { body, validationResult } from 'express-validator';
import { submitContactForm, getAllContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, vendorOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: submit contact form
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  submitContactForm
);

// Vendor: get all messages
router.get('/', protect, vendorOnly, getAllContacts);

// Vendor: update message
router.put('/:id', protect, vendorOnly, updateContactStatus);

export default router;
