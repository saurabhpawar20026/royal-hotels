// ============================================================
//  Royal Hotels — Payment backend (Express + Razorpay)
//  App entry: env, middleware, routes. The Key Secret never
//  leaves this server.
//
//  Structure:
//    config/razorpay.js          -> SDK instance + key config
//    models/Payment.js           -> payment store ("database")
//    controllers/payment.*.js    -> order creation + verification
//    routes/payment.routes.js    -> /api/payment/* endpoints
// ============================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.routes.js";
import { keysConfigured, mode } from "./config/razorpay.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow the Vite dev/preview origins (dev: any origin).
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);

// Back-compat + simple health at root
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, keysConfigured, mode })
);

// 404 + error handlers
app.use((req, res) => res.status(404).json({ success: false, error: "Not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n  Royal Hotels payment server -> http://localhost:${PORT}`);
  console.log(`  Razorpay: ${keysConfigured ? `configured (${mode.toUpperCase()} mode)` : "NOT configured — add keys to server/.env"}\n`);
});
