import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight, FaLock, FaShieldAlt, FaConciergeBell,
  FaMobileAlt, FaRegCreditCard, FaMoneyCheckAlt, FaUniversity, FaWallet, FaHotel,
  FaTimesCircle, FaRedo, FaQrcode, FaCheckCircle,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { formatINR } from "../data/rooms.js";
import { useBooking } from "../context/BookingContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { Stepper } from "./Booking.jsx";
import { PAYEE_VPA, PAYEE_NAME, isUpiConfigured, buildUpiLink, upiQrUrl } from "../data/paymentConfig.js";
import { getServerHealth, createOrder, verifyPayment, loadRazorpayScript } from "../data/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Payment.css";

// Every method except "Pay at Hotel" is processed through the Razorpay gateway
// (UPI/QR, cards, net banking, wallets) — verified server-side, settled to your account.
const GATEWAY_METHODS = ["upi", "credit", "debit", "netbanking", "wallet"];

// Maps our tab to the method Razorpay Checkout should open first.
const RZP_METHOD = { upi: "upi", credit: "card", debit: "card", netbanking: "netbanking", wallet: "wallet" };

const METHODS = [
  { id: "upi", label: "UPI", icon: FaMobileAlt },
  { id: "scanpay", label: "Scan & Pay", icon: FaQrcode },
  { id: "credit", label: "Credit Card", icon: FaRegCreditCard },
  { id: "debit", label: "Debit Card", icon: FaMoneyCheckAlt },
  { id: "netbanking", label: "Net Banking", icon: FaUniversity },
  { id: "wallet", label: "Wallet", icon: FaWallet },
  { id: "hotel", label: "Pay at Hotel", icon: FaHotel },
];

const METHOD_LABEL = {
  upi: "UPI", scanpay: "UPI QR (Scan & Pay)", credit: "Credit Card", debit: "Debit Card",
  netbanking: "Net Banking", wallet: "Wallet", hotel: "Pay at Hotel",
};

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"];
const WALLETS = ["Paytm", "Amazon Pay", "Mobikwik"];

export default function Payment() {
  const { draft, priceBreakdown, confirmBooking } = useBooking();
  const { notify } = useNotify();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bd = priceBreakdown(draft);

  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [health, setHealth] = useState(null); // payment-server status
  const [failure, setFailure] = useState(null); // { title, message } when a payment fails

  // Form fields (display hints; real card entry happens in the Razorpay window)
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);
  const [txnRef] = useState(() => "RH" + Math.floor(100000 + Math.random() * 900000));

  useReveal("payment-" + method);

  // Check the payment backend on mount (test/live mode + whether keys are set).
  useEffect(() => {
    let alive = true;
    getServerHealth().then((h) => { if (alive) setHealth(h); });
    return () => { alive = false; };
  }, []);

  if (!bd.room || bd.nights <= 0) {
    return (
      <div>
        <PageHero
          image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
          eyebrow="Payment"
          title="Secure Checkout"
          crumbs={[{ label: "Home", to: "/" }, { label: "Booking", to: "/booking" }, { label: "Payment" }]}
        />
        <section className="section container">
          <Stepper active={2} />
          <div className="pay-empty glass">
            <FaShieldAlt className="pay-empty__icon" />
            <h2>No active reservation</h2>
            <p className="text-dim">Please build your stay before proceeding to payment.</p>
            <Link to="/booking" className="btn btn-gold mt-2">Go to Booking <FaArrowRight /></Link>
          </div>
        </section>
      </div>
    );
  }

  // Scan & Pay: a REAL scannable UPI QR / deep link straight to your personal UPI ID.
  const upiLink = buildUpiLink({ amount: bd.total, note: `Royal Hotels · ${bd.room.name}`, txnRef });
  const upiReady = isUpiConfigured();
  const copyVpa = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(PAYEE_VPA);
    notify("UPI ID copied", "success", PAYEE_VPA);
  };

  // Write the booking to history and go to the confirmation page.
  const finalize = (label) => {
    const record = confirmBooking(label);
    if (record) {
      notify("Payment Successful", "success", `Booking ${record.ref} confirmed.`);
      navigate("/confirmation", { state: { record } });
    } else {
      notify("Booking failed", "warning", "Your reservation could not be completed.");
    }
  };

  const fail = (title, message) => { setProcessing(false); setFailure({ title, message }); };

  // Real Razorpay gateway: create order on the backend → open checkout → verify signature.
  const payWithRazorpay = async () => {
    setFailure(null);
    setProcessing(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) return fail("Network Error", "Could not load Razorpay Checkout. Please check your internet connection and try again.");

      // 1) Backend creates the order (secret key never leaves the server)
      const order = await createOrder(bd.total, txnRef, { name: user?.name, email: user?.email });
      if (!order?.success) return fail("Order Creation Failed", order?.error || "Could not create the payment order.");
      setProcessing(false); // hand over to the Razorpay modal

      // 2) Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Royal Hotels",
        description: `${bd.room.name} · ${bd.nights} night${bd.nights > 1 ? "s" : ""}`,
        prefill: { name: user?.name || "", email: user?.email || "", method: RZP_METHOD[method] },
        theme: { color: "#d4af37" },
        // 3) On success, backend verifies the signature
        handler: async (resp) => {
          setProcessing(true);
          try {
            const v = await verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              method: METHOD_LABEL[method],
            });
            if (v.success) {
              // 4) Verified + stored as paid → success page
              finalize(`Razorpay · ${METHOD_LABEL[method]}`);
            } else {
              fail("Verification Failed", v.error || "We could not verify your payment. If money was deducted it will be auto-refunded.");
            }
          } catch (e) {
            fail("Verification Error", e.message);
          }
        },
        modal: { ondismiss: () => { setProcessing(false); notify("Payment cancelled", "info", "You closed the checkout before completing payment."); } },
      });
      rzp.on("payment.failed", (r) =>
        fail("Payment Failed", r?.error?.description || "The payment could not be completed. Please try another method.")
      );
      rzp.open();
    } catch (e) {
      fail("Payment Error", e.message);
    }
  };

  // "Pay at Hotel" — the only non-gateway option (no charge today).
  const payAtHotel = () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      try { finalize("Pay at Hotel"); }
      catch (err) { console.error("Payment error:", err); notify("Something went wrong", "warning", "Please try again."); }
      finally { setProcessing(false); }
    }, 1400);
  };

  // Scan & Pay "I Have Paid": confirm the booking after the guest pays via UPI QR.
  const payScanQr = () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      try { finalize("UPI QR (Scan & Pay)"); }
      catch (err) { console.error("Payment error:", err); notify("Something went wrong", "warning", "Please try again."); }
      finally { setProcessing(false); }
    }, 1200);
  };

  const pay = () => {
    if (processing) return;
    if (method === "hotel") return payAtHotel();
    if (method === "scanpay") return payScanQr();
    return payWithRazorpay(); // upi / card / netbanking / wallet → Razorpay
  };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
        eyebrow="Payment"
        title="Secure Checkout"
        crumbs={[{ label: "Home", to: "/" }, { label: "Booking", to: "/booking" }, { label: "Payment" }]}
      />

      <section className="section container">
        <Stepper active={2} />

        <div className="pay-layout">
          {/* LEFT */}
          <div className="pay-main">
            <div className="pay-block glass">
              <h3 className="pay-block__head"><FaLock /> Choose a Payment Method</h3>
              <div className="pay-methods">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`pay-method ${method === m.id ? "on" : ""}`}
                    onClick={() => setMethod(m.id)}
                    aria-pressed={method === m.id}
                    aria-label={m.label}
                  >
                    <m.icon />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Gateway status banner (for Razorpay methods) */}
              {GATEWAY_METHODS.includes(method) && (
                <div className={`pay-status ${health?.ok && health?.keysConfigured ? "ok" : "warn"}`}>
                  {health === null
                    ? "Checking payment server…"
                    : !health.ok
                      ? "⚠ Payment server offline. Start it: cd server && npm start"
                      : !health.keysConfigured
                        ? "⚠ Razorpay keys not set. Add them to server/.env, then restart the server."
                        : `🔒 Secure payments by Razorpay · ${health.mode === "live" ? "LIVE" : "TEST"} mode`}
                </div>
              )}

              {/* Forms */}
              <div className="pay-form">
                {method === "upi" && (
                  <div className="pay-fields">
                    <div className="pay-upi-rzp">
                      <FaMobileAlt className="pay-upi-rzp__icon" />
                      <div>
                        <strong>Pay by UPI</strong>
                        <p className="text-dim">
                          Tap <strong>Pay</strong> below and the secure Razorpay window opens a
                          <strong> UPI QR code</strong> and a <strong>“Pay using UPI ID”</strong> box —
                          scan with any app or enter your UPI ID. Payment settles to our Razorpay account.
                        </p>
                      </div>
                    </div>
                    <div className="pay-chips">
                      {UPI_APPS.map((a) => <span key={a} className="pay-chip">{a}</span>)}
                    </div>
                  </div>
                )}

                {method === "scanpay" && (
                  <div className="pay-upi">
                    <div className="pay-upi__qr">
                      <img src={upiQrUrl(upiLink, 230)} alt="Scan to pay via UPI" width="210" height="210" />
                      <span className="pay-upi__amt">{formatINR(bd.total)}</span>
                    </div>
                    <div className="pay-upi__info">
                      <p className="pay-upi__lead">Scan with GPay, PhonePe or Paytm to pay</p>
                      <div className="pay-upi__vpa">
                        <div>
                          <small>Paying to</small>
                          <strong>{PAYEE_NAME}</strong>
                          <span>{PAYEE_VPA}</span>
                        </div>
                        <button type="button" className="btn btn-outline btn-sm" onClick={copyVpa}>Copy</button>
                      </div>
                      <a className="btn btn-gold btn-block pay-upi__open" href={upiLink}>
                        <FaMobileAlt /> Open UPI App to Pay
                      </a>
                      <div className="pay-chips">
                        {UPI_APPS.map((a) => <span key={a} className="pay-chip">{a}</span>)}
                      </div>
                      {!upiReady && (
                        <p className="pay-upi__warn">
                          ⚠ Demo UPI ID in use. Set your real UPI ID in
                          <code> src/data/paymentConfig.js</code>.
                        </p>
                      )}
                      <p className="pay-upi__note text-dim">
                        Pay the exact amount, then tap <strong>“I Have Paid”</strong> below to confirm your booking.
                      </p>
                    </div>
                  </div>
                )}

                {(method === "credit" || method === "debit") && (
                  <div className="pay-card-wrap">
                    {/* Decorative card — real details are entered in the Razorpay window */}
                    <div className="pay-cc">
                      <div className="pay-cc__inner">
                        <div className="pay-cc__face pay-cc__front">
                          <div className="pay-cc__top">
                            <span className="pay-cc__chip" />
                            <span className="pay-cc__brand">{method === "credit" ? "CREDIT" : "DEBIT"}</span>
                          </div>
                          <div className="pay-cc__no">•••• •••• •••• ••••</div>
                          <div className="pay-cc__row">
                            <div><small>Card Holder</small><div>{user?.name?.toUpperCase() || "YOUR NAME"}</div></div>
                            <div><small>Secured by</small><div>RAZORPAY</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pay-gateway-note">
                      <FaShieldAlt />
                      <p>
                        You'll enter your card details in the <strong>encrypted Razorpay window</strong>.
                        We never see or store your card number.
                      </p>
                    </div>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="pay-fields">
                    <div className="field">
                      <label>Preferred Bank (you can change this in Razorpay)</label>
                      <select value={bank} onChange={(e) => setBank(e.target.value)}>
                        {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="pay-gateway-note">
                      <FaShieldAlt />
                      <p>You'll be securely redirected via <strong>Razorpay</strong> to authorise the payment with your bank.</p>
                    </div>
                  </div>
                )}

                {method === "wallet" && (
                  <div className="pay-fields">
                    <div className="pay-radio-list">
                      {WALLETS.map((w) => (
                        <label key={w} className={`pay-radio ${wallet === w ? "on" : ""}`}>
                          <input type="radio" name="wallet" checked={wallet === w} onChange={() => setWallet(w)} />
                          <span className="pay-radio__dot" />
                          <span>{w}</span>
                        </label>
                      ))}
                    </div>
                    <div className="pay-gateway-note">
                      <FaShieldAlt />
                      <p>Wallet payments are processed securely through <strong>Razorpay</strong>.</p>
                    </div>
                  </div>
                )}

                {method === "hotel" && (
                  <div className="pay-hotel">
                    <FaConciergeBell className="pay-hotel__icon" />
                    <div>
                      <strong>Reserve now, pay on arrival</strong>
                      <p className="text-dim">
                        No payment required today. Settle your bill at check-in via card, UPI or cash.
                        A valid ID and card guarantee may be requested at the front desk.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="pay-secure">
                <FaShieldAlt /> 256-bit SSL encrypted · Your details are never stored
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="pay-aside">
            <div className="pay-summary glass reveal">
              <h3>Order Summary</h3>
              <div className="pay-summary__room">
                <img src={bd.room.images[0]} alt={bd.room.name} />
                <div>
                  <strong>{bd.room.name}</strong>
                  <span>{draft.checkIn} → {draft.checkOut}</span>
                  <span>{bd.nights} night{bd.nights > 1 ? "s" : ""} · {draft.guests} guest{draft.guests > 1 ? "s" : ""} · {draft.rooms} room{draft.rooms > 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="pay-summary__calc">
                <div className="row"><span>Room ({bd.nights} night{bd.nights > 1 ? "s" : ""})</span><span>{formatINR(bd.roomTotal)}</span></div>
                {bd.addonLines.map((a) => (
                  <div className="row" key={a.id}><span>{a.label}</span><span>{formatINR(a.amount)}</span></div>
                ))}
                {bd.discount > 0 && (
                  <div className="row discount"><span>Long-stay discount</span><span>−{formatINR(bd.discount)}</span></div>
                )}
                <div className="row"><span>Taxes (GST 12%)</span><span>{formatINR(bd.taxes)}</span></div>
                <div className="row"><span>Service (5%)</span><span>{formatINR(bd.service)}</span></div>
                <div className="row total"><span>Total Payable</span><span>{formatINR(bd.total)}</span></div>
              </div>
              <button className="btn btn-gold btn-block btn-lg" onClick={pay} disabled={processing}>
                {method === "scanpay"
                  ? <><FaCheckCircle /> I Have Paid · Confirm</>
                  : <><FaLock /> {method === "hotel" ? "Confirm Reservation" : `Pay ${formatINR(bd.total)}`}</>}
              </button>
              <Link to="/booking" className="pay-summary__back">← Edit reservation</Link>
            </div>
          </aside>
        </div>
      </section>

      {processing && (
        <div className="pay-overlay" role="alert" aria-live="assertive">
          <div className="pay-overlay__box glass">
            <div className="spinner" />
            <h3>Processing Payment…</h3>
            <p className="text-dim">Please don't close or refresh this page.</p>
          </div>
        </div>
      )}

      {failure && (
        <div className="pay-overlay" role="alertdialog" aria-live="assertive">
          <div className="pay-overlay__box pay-fail glass">
            <FaTimesCircle className="pay-fail__icon" />
            <h3>{failure.title}</h3>
            <p className="text-dim">{failure.message}</p>
            <div className="pay-fail__actions">
              <button className="btn btn-gold" onClick={() => { setFailure(null); pay(); }}>
                <FaRedo /> Try Again
              </button>
              <Link to="/booking" className="btn btn-outline" onClick={() => setFailure(null)}>
                Edit Reservation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
