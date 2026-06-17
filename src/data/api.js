// Frontend → payment backend (Axios).
// Override the base URL with VITE_API_BASE in a root .env if the backend is hosted elsewhere.
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const client = axios.create({
  baseURL: `${API_BASE}/api/payment`,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Normalise axios errors into a readable Error message.
function toError(err) {
  if (err.response?.data?.error) return new Error(err.response.data.error);
  if (err.code === "ECONNABORTED") return new Error("Request timed out. Please try again.");
  if (err.request) return new Error("Cannot reach the payment server. Is it running? (cd server && npm start)");
  return new Error(err.message || "Unexpected error");
}

// POST /api/payment/create-order  -> { success, orderId, amount, currency, keyId }
export async function createOrder(amount, receipt, customer) {
  try {
    const { data } = await client.post("/create-order", { amount, receipt, customer });
    return data;
  } catch (err) {
    throw toError(err);
  }
}

// POST /api/payment/verify-payment -> { success, paymentId, ... }
export async function verifyPayment(payload) {
  try {
    const { data } = await client.post("/verify-payment", payload);
    return data;
  } catch (err) {
    throw toError(err);
  }
}

// GET /api/payment/health
export async function getServerHealth() {
  try {
    const { data } = await client.get("/health");
    return data;
  } catch {
    return { ok: false, offline: true };
  }
}

// Lazy-load the Razorpay Checkout script once.
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}
