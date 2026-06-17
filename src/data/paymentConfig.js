// ============================================================
//  PAYMENT CONFIG  —  EDIT THESE LINES
//  Replace PAYEE_VPA with YOUR UPI ID (VPA), e.g. "6260222827@ibl",
//  and PAYEE_NAME with the name that should show in the UPI app.
//  No API keys, secrets, SDKs or payment server are needed —
//  payments are collected via UPI / PhonePe / QR and verified manually.
// ============================================================
// Your UPI ID is read from a git-ignored .env (VITE_PAYEE_VPA) so it is never
// committed. Set it in the root `.env` file (see .env.example).
export const PAYEE_VPA = import.meta.env.VITE_PAYEE_VPA || "6260222827@ibl";
export const PAYEE_NAME = import.meta.env.VITE_PAYEE_NAME || "Royal Hotels";

// Direct PhonePe payment link / deep link (e.g. a PhonePe.me link or business
// QR deep link). Leave blank to fall back to the standard UPI deep link, which
// also opens PhonePe if it is installed. Override with VITE_PHONEPE_LINK.
export const PHONEPE_LINK = import.meta.env.VITE_PHONEPE_LINK || "";

// True once a real VPA has been configured (hides the demo warning).
export const isUpiConfigured = () =>
  PAYEE_VPA && !PAYEE_VPA.startsWith("your-upi-id");

// Build a standard UPI deep link (works with GPay/PhonePe/Paytm/BHIM, etc.).
// On a phone this opens the user's UPI app pre-filled to pay PAYEE_VPA.
export function buildUpiLink({ amount, note = "Royal Hotels Booking", txnRef = "" }) {
  const params = new URLSearchParams({
    pa: PAYEE_VPA,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  if (txnRef) params.set("tr", txnRef);
  return `upi://pay?${params.toString()}`;
}

// Render a scannable QR image for a UPI link (client-side, no keys).
export function upiQrUrl(upiLink, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&qzone=1&data=${encodeURIComponent(
    upiLink
  )}`;
}
