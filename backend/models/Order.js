import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    products: [orderProductSchema],

    totalPrice: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'STRIPE'],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING'
    },

    stripePaymentIntentId: {
      type: String
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },

    // prevents double stock deduction
    stockUpdated: {
      type: Boolean,
      default: false
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ vendorId: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
