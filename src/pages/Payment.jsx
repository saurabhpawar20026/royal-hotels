import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight, FaLock, FaShieldAlt, FaConciergeBell,
  FaMobileAlt, FaHotel, FaQrcode, FaCheckCircle, FaRegCopy, FaUpload,
} from "react-icons/fa";
import { SiPhonepe } from "react-icons/si";
import PageHero from "../components/layout/PageHero.jsx";
import { formatINR } from "../data/rooms.js";
import { useBooking } from "../context/BookingContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { Stepper } from "./Booking.jsx";
import { PAYEE_VPA, PAYEE_NAME, isUpiConfigured, buildUpiLink, upiQrUrl, PHONEPE_LINK } from "../data/paymentConfig.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Payment.css";

// Online methods collect payment to our UPI ID and are verified manually from
// the guest's UTR / payment screenshot. "Pay at Hotel" charges nothing today.
const PROOF_METHODS = ["upi", "phonepe", "scanpay"];

const METHODS = [
  { id: "upi", label: "UPI", icon: FaMobileAlt },
  { id: "phonepe", label: "PhonePe", icon: SiPhonepe },
  { id: "scanpay", label: "Scan & Pay", icon: FaQrcode },
  { id: "hotel", label: "Pay at Hotel", icon: FaHotel },
];

const METHOD_LABEL = {
  upi: "UPI", phonepe: "PhonePe", scanpay: "UPI QR (Scan & Pay)", hotel: "Pay at Hotel",
};

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];

export default function Payment() {
  const { draft, priceBreakdown, confirmBooking } = useBooking();
  const { notify } = useNotify();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bd = priceBreakdown(draft);

  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(null);   // booking record once proof is submitted

  // Payment-confirmation (proof) fields
  const [utr, setUtr] = useState("");
  const [proofName, setProofName] = useState("");
  const fileRef = useRef(null);

  const [txnRef] = useState(() => "RH" + Math.floor(100000 + Math.random() * 900000));

  useReveal("payment-" + method);

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

  // A REAL scannable UPI QR / deep link straight to our UPI ID, pre-filled with the amount.
  const upiLink = buildUpiLink({ amount: bd.total, note: `Royal Hotels · ${bd.room.name}`, txnRef });
  const phonepeLink = PHONEPE_LINK || upiLink; // fall back to UPI link (opens PhonePe if installed)
  const upiReady = isUpiConfigured();

  const copyVpa = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(PAYEE_VPA);
    notify("UPI ID copied", "success", PAYEE_VPA);
  };

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (f) { setProofName(f.name); notify("Screenshot attached", "success", f.name); }
  };

  // Record the booking and show the "payment received / will be verified" message.
  const submitProof = () => {
    if (processing || done) return;
    if (!utr.trim()) {
      notify("Enter UTR / Transaction ID", "warning", "After paying, enter the UTR or transaction reference from your UPI app.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      try {
        const record = confirmBooking(`${METHOD_LABEL[method]} · UTR ${utr.trim()}`);
        if (record) setDone(record);
        else notify("Submission failed", "warning", "Your reservation could not be recorded. Please try again.");
      } catch (err) {
        console.error("Payment proof error:", err);
        notify("Something went wrong", "warning", "Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 1200);
  };

  // "Pay at Hotel" — no charge today; goes straight to the confirmation page.
  const payAtHotel = () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      try {
        const record = confirmBooking("Pay at Hotel");
        if (record) {
          notify("Reservation Confirmed", "success", `Booking ${record.ref} confirmed.`);
          navigate("/confirmation", { state: { record } });
        } else {
          notify("Booking failed", "warning", "Your reservation could not be completed.");
        }
      } catch (err) {
        console.error("Payment error:", err);
        notify("Something went wrong", "warning", "Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 1200);
  };

  const primaryAction = () => (method === "hotel" ? payAtHotel() : submitProof());

  // Shared payment-confirmation (proof) block for UPI / PhonePe / QR methods.
  const ProofBlock = (
    <div className="pay-proof">
      <h4 className="pay-proof__head"><FaCheckCircle /> Confirm your payment</h4>
      <p className="text-dim pay-proof__hint">
        After paying the exact amount, enter your <strong>UTR / Transaction ID</strong> and
        (optionally) attach a screenshot, then submit for verification.
      </p>
      <div className="field">
        <label htmlFor="utr">UTR / Transaction ID</label>
        <input
          id="utr"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 4012 3456 7890"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
        />
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
      <button type="button" className="btn btn-outline btn-block" onClick={() => fileRef.current?.click()}>
        <FaUpload /> {proofName ? `Attached: ${proofName}` : "Upload Screenshot"}
      </button>
      <button type="button" className="btn btn-gold btn-block" onClick={submitProof} disabled={processing}>
        <FaCheckCircle /> Submit Payment Proof
      </button>
    </div>
  );

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

              {PROOF_METHODS.includes(method) && (
                <div className="pay-status ok">
                  🔒 Pay to our UPI ID · settles instantly to {PAYEE_NAME}
                </div>
              )}

              {/* Forms */}
              <div className="pay-form">
                {/* A) UPI */}
                {method === "upi" && (
                  <div className="pay-fields">
                    <div className="pay-upi-rzp">
                      <FaMobileAlt className="pay-upi-rzp__icon" />
                      <div>
                        <strong>Pay by UPI</strong>
                        <p className="text-dim">
                          Send <strong>{formatINR(bd.total)}</strong> to our UPI ID using any UPI app,
                          or tap <strong>Pay via UPI App</strong> to open your app pre-filled.
                        </p>
                      </div>
                    </div>
                    <div className="pay-upi__vpa">
                      <div>
                        <small>Paying to</small>
                        <strong>{PAYEE_NAME}</strong>
                        <span>{PAYEE_VPA}</span>
                      </div>
                      <button type="button" className="btn btn-outline btn-sm" onClick={copyVpa}>
                        <FaRegCopy /> Copy UPI ID
                      </button>
                    </div>
                    <a className="btn btn-gold btn-block pay-upi__open" href={upiLink}>
                      <FaMobileAlt /> Pay via UPI App
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
                    {ProofBlock}
                  </div>
                )}

                {/* B) PhonePe */}
                {method === "phonepe" && (
                  <div className="pay-fields">
                    <div className="pay-upi-rzp">
                      <SiPhonepe className="pay-upi-rzp__icon" style={{ color: "#5f259f" }} />
                      <div>
                        <strong>Pay via PhonePe</strong>
                        <p className="text-dim">
                          Tap below to open PhonePe and pay <strong>{formatINR(bd.total)}</strong> to {PAYEE_NAME}.
                          On desktop, scan the QR in the Scan &amp; Pay tab with PhonePe.
                        </p>
                      </div>
                    </div>
                    <div className="pay-upi__vpa">
                      <div>
                        <small>Paying to</small>
                        <strong>{PAYEE_NAME}</strong>
                        <span>{PAYEE_VPA}</span>
                      </div>
                      <button type="button" className="btn btn-outline btn-sm" onClick={copyVpa}>
                        <FaRegCopy /> Copy UPI ID
                      </button>
                    </div>
                    <a className="btn btn-gold btn-block pay-upi__open" href={phonepeLink}>
                      <SiPhonepe /> {PHONEPE_LINK ? "Pay with PhonePe" : "Pay via PhonePe / UPI"}
                    </a>
                    {ProofBlock}
                  </div>
                )}

                {/* C) QR Code */}
                {method === "scanpay" && (
                  <div className="pay-fields">
                    <div className="pay-upi">
                      <div className="pay-upi__qr">
                        <img src={upiQrUrl(upiLink, 260)} alt="Scan to pay via UPI" width="230" height="230" />
                        <span className="pay-upi__amt">{formatINR(bd.total)}</span>
                      </div>
                      <div className="pay-upi__info">
                        <p className="pay-upi__lead">Scan &amp; pay in 3 steps</p>
                        <ol className="pay-steps">
                          <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                          <li>Scan this QR code</li>
                          <li>Complete the payment of {formatINR(bd.total)}</li>
                        </ol>
                        <div className="pay-upi__vpa">
                          <div>
                            <small>Paying to</small>
                            <strong>{PAYEE_NAME}</strong>
                            <span>{PAYEE_VPA}</span>
                          </div>
                          <button type="button" className="btn btn-outline btn-sm" onClick={copyVpa}>
                            <FaRegCopy /> Copy UPI ID
                          </button>
                        </div>
                      </div>
                    </div>
                    {ProofBlock}
                  </div>
                )}

                {/* Pay at Hotel */}
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
                <FaShieldAlt /> Your booking is verified by our team before confirmation
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
              <button className="btn btn-gold btn-block btn-lg" onClick={primaryAction} disabled={processing}>
                {method === "hotel"
                  ? <><FaLock /> Confirm Reservation</>
                  : <><FaCheckCircle /> Submit Payment Proof</>}
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
            <h3>Submitting…</h3>
            <p className="text-dim">Please don't close or refresh this page.</p>
          </div>
        </div>
      )}

      {done && (
        <div className="pay-overlay" role="alertdialog" aria-live="assertive">
          <div className="pay-overlay__box pay-done glass">
            <FaCheckCircle className="pay-done__icon" />
            <h3>Payment received</h3>
            <p className="text-dim">Booking will be verified shortly.</p>
            <p className="pay-done__ref">Reference <strong>{done.ref}</strong></p>
            <div className="pay-fail__actions">
              <Link to="/bookings" className="btn btn-gold" onClick={() => setDone(null)}>
                View My Bookings
              </Link>
              <Link to="/" className="btn btn-outline" onClick={() => setDone(null)}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
