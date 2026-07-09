import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    subcategory: {
      type: String,
      trim: true
    },

    description: {
    type: String,
    default: ""
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },

    images: [
      {
        type: String
      }
    ],

    stockQuantity: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative']
    },

    reorderLevel: {
      type: Number,
      default: 10
    },

    soldCount: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔹 Index for fast vendor queries
productSchema.index({ vendorId: 1 });

// 🔹 SMART INVENTORY: Low stock checker
productSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.reorderLevel;
});

export default mongoose.model('Product', productSchema);
