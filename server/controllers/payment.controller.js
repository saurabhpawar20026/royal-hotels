// Payment controller — Razorpay Orders API + signature verification.
import crypto from "node:crypto";
import { razorpay, keysConfigured, KEY_ID, KEY_SECRET, mode } from "../config/razorpay.js";
import {
  createPaymentRecord, markPaid, markFailed, getByOrderId, getAllPayments,
} from "../models/Payment.js";

// GET /api/payment/health
export function health(_req, res) {
  res.json({ ok: true, keysConfigured, keyId: keysConfigured ? KEY_ID : null, mode });
}

// POST /api/payment/create-order   body: { amount (₹), receipt?, customer? }
export async function createOrder(req, res) {
  if (!razorpay) {
    return res.status(503).json({
      success: false,
      error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env",
    });
  }
  try {
    const amount = Number(req.body?.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "A valid amount (in ₹) is required." });
    }
    const receipt = req.body?.receipt || `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt,
      notes: { source: "royal-hotels" },
    });

    // Persist the order with status "created".
    createPaymentRecord({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
      customer: req.body?.customer || null,
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: KEY_ID, // public key for the checkout widget
    });
  } catch (err) {
    console.error("create-order error:", err?.error || err);
    const isNetwork =
      err instanceof TypeError ||
      ["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ECONNRESET"].includes(err?.code);
    if (isNetwork) {
      return res.status(502).json({
        success: false,
        error: "Cannot reach Razorpay. The server has no internet connection (or a firewall/proxy is blocking Node).",
      });
    }
    return res.status(500).json({ success: false, error: err?.error?.description || "Order creation failed." });
  }
}

// POST /api/payment/verify-payment
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, method? }
export function verifyPayment(req, res) {
  if (!KEY_SECRET) {
    return res.status(503).json({ success: false, error: "Server keys not configured." });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: "Missing payment fields." });
  }

  try {
    // Verify signature: HMAC_SHA256(order_id|payment_id, key_secret).
    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(String(razorpay_signature));
    // timingSafeEqual requires equal lengths; a mismatch is simply invalid.
    const valid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!valid) {
      markFailed(razorpay_order_id, "signature_mismatch");
      return res.status(400).json({ success: false, error: "Signature verification failed." });
    }

    // Mark the order paid in the database.
    const record = markPaid(razorpay_order_id, {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      record,
    });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ success: false, error: "Verification failed due to a server error." });
  }
}

// GET /api/payment/payments  (admin/debug — list stored payments)
export function listPayments(_req, res) {
  res.json({ success: true, payments: getAllPayments() });
}

// GET /api/payment/order/:orderId
export function getOrder(req, res) {
  const record = getByOrderId(req.params.orderId);
  if (!record) return res.status(404).json({ success: false, error: "Order not found." });
  res.json({ success: true, record });
}
