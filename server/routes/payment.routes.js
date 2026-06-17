// Payment routes — mounted at /api/payment in index.js
import { Router } from "express";
import {
  health, createOrder, verifyPayment, listPayments, getOrder,
} from "../controllers/payment.controller.js";

const router = Router();

router.get("/health", health);
router.post("/create-order", createOrder);     // POST /api/payment/create-order
router.post("/verify-payment", verifyPayment); // POST /api/payment/verify-payment
router.get("/payments", listPayments);         // GET  /api/payment/payments
router.get("/order/:orderId", getOrder);       // GET  /api/payment/order/:orderId

export default router;
