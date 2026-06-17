// ============================================================
//  UPI PAYMENT CONFIG  —  EDIT THESE TWO LINES
//  Replace PAYEE_VPA with YOUR UPI ID (VPA), e.g. "ritik@oksbi",
//  and PAYEE_NAME with the name that should show in the UPI app.
//  No API keys or secrets are needed for UPI deep-link / QR payments.
// ============================================================
// Your UPI ID is read from a git-ignored .env (VITE_PAYEE_VPA) so it is never
// committed. Set it in the root `.env` file (see .env.example).
export const PAYEE_VPA = import.meta.env.VITE_PAYEE_VPA || "your-upi-id@bank";
export const PAYEE_NAME = import.meta.env.VITE_PAYEE_NAME || "Royal Hotels";

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
