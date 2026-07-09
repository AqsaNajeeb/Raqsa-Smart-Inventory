import mongoose from 'mongoose';
import validator from 'validator';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ['pending', 'read', 'replied', 'resolved'],
      default: 'pending',
    },

    // Customer / logged-in user (optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ✅ Vendor-specific contact (optional)
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    replyMessage: {
      type: String,
      trim: true,
      default: null,
    },
    readAt: {
  type: Date,
  default: null,
}

  },
  {
    timestamps: true,
  }
);

// ✅ Indexes for faster queries
contactSchema.index({ vendorId: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
