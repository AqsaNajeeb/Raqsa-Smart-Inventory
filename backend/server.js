import dotenv from "dotenv";
dotenv.config();

console.log("ENV STRIPE KEY AT BOOT:", process.env.STRIPE_SECRET_KEY);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import profileRoutes from './routes/profile.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import vendorRoutes from './routes/vendor.js';
import cartRoutes from './routes/cart.js';
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middleware: works for every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Route hit: ${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vendor', vendorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('Trying to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
