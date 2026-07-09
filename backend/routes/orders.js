import express from "express";
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, vendorOnly } from "../middleware/auth.js";

const router = express.Router();

// Customer
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Vendor
router.get("/vendor", protect, vendorOnly, getVendorOrders);
router.put("/:id/status", protect, vendorOnly, updateOrderStatus);

export default router;
