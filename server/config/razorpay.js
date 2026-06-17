// Razorpay SDK instance + key config. The SECRET stays here on the server only.
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const KEY_ID = process.env.RAZORPAY_KEY_ID || null;
export const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || null;
export const keysConfigured = Boolean(KEY_ID && KEY_SECRET);
export const mode = KEY_ID?.startsWith("rzp_live") ? "live" : "test";

export const razorpay = keysConfigured
  ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
  : null;
