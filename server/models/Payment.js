// Payment store ("database").
// Default implementation persists to a JSON file so it runs with zero setup.
// To move to MongoDB/Postgres, replace the read/write helpers below with your
// driver calls — the exported functions are the stable interface the rest of
// the app depends on.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "payments.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");
}
function readAll() {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) || [];
  } catch {
    return [];
  }
}
function writeAll(list) {
  ensure();
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}

// Create a record when an order is generated. status: "created"
export function createPaymentRecord({ orderId, amount, currency, receipt, customer }) {
  const list = readAll();
  const record = {
    orderId,
    paymentId: null,
    signature: null,
    amount,
    currency,
    receipt: receipt || null,
    customer: customer || null,
    status: "created", // created -> paid | failed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(record);
  writeAll(list);
  return record;
}

function update(orderId, patch) {
  const list = readAll();
  const idx = list.findIndex((p) => p.orderId === orderId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(list);
  return list[idx];
}

export const markPaid = (orderId, { paymentId, signature, method }) =>
  update(orderId, { status: "paid", paymentId, signature, method: method || null });

export const markFailed = (orderId, reason) =>
  update(orderId, { status: "failed", failureReason: reason || "unknown" });

export const getByOrderId = (orderId) => readAll().find((p) => p.orderId === orderId) || null;
export const getAllPayments = () => readAll();
