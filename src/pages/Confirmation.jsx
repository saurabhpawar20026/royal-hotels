import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight, FaPrint, FaEnvelopeOpenText, FaDoorOpen,
  FaConciergeBell, FaCalendarCheck, FaHome, FaListUl, FaMapMarkerAlt,
} from "react-icons/fa";
import { getRoomById, formatINR } from "../data/rooms.js";
import { useBooking } from "../context/BookingContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { Stepper } from "./Booking.jsx";
import "./Confirmation.css";

const NEXT_STEPS = [
  { icon: FaEnvelopeOpenText, title: "Confirmation Email", text: "A detailed voucher is on its way to your inbox with all reservation details." },
  { icon: FaDoorOpen, title: "Check-in from 2:00 PM", text: "Present this reference and a valid photo ID at our front desk. Early check-in on request." },
  { icon: FaConciergeBell, title: "Concierge at Your Service", text: "Call +91 22 6789 0000 anytime to arrange transfers, dining or spa rituals before you arrive." },
];

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { history } = useBooking();
  const record = location.state?.record || history[0];
  useReveal("confirmation-" + (record?.ref || "none"));

  if (!record) {
    return (
      <div className="page section container">
        <div className="cf-empty glass">
          <FaCalendarCheck className="cf-empty__icon" />
          <h2>No booking found</h2>
          <p className="text-dim">Looks like you haven't completed a reservation yet.</p>
          <Link to="/rooms" className="btn btn-gold mt-2">Explore Rooms <FaArrowRight /></Link>
        </div>
      </div>
    );
  }

  const room = getRoomById(record.roomId);
  const image = record.roomImage || room?.images?.[0];

  return (
    <div className="page cf-page">
      <section className="section container">
        <Stepper active={3} />

        {/* Success hero */}
        <div className="cf-hero reveal">
          <div className="cf-check" aria-hidden="true">
            <svg viewBox="0 0 80 80" className="cf-check__svg">
              <circle className="cf-check__circle" cx="40" cy="40" r="36" />
              <path className="cf-check__mark" d="M24 41 L36 53 L57 29" />
            </svg>
          </div>
          <h1 className="cf-title">Booking Confirmed!</h1>
          <p className="lead text-dim">
            Thank you for choosing Royal Hotels. Your luxury escape awaits.
          </p>
          <span className="badge badge-success cf-ref">Ref: {record.ref}</span>
        </div>

        {/* Voucher / boarding pass */}
        <div className="cf-voucher glass reveal">
          <div className="cf-voucher__media">
            {image && <img src={image} alt={record.roomName} />}
            <span className="badge badge-success cf-voucher__status">{record.status}</span>
          </div>

          <div className="cf-voucher__body">
            <div className="cf-voucher__head">
              <div>
                <span className="eyebrow">Reservation Voucher</span>
                <h2>{record.roomName}</h2>
              </div>
              <div className="cf-voucher__ref">
                <small>Booking Reference</small>
                <strong>{record.ref}</strong>
              </div>
            </div>

            <div className="cf-voucher__grid">
              <div className="cf-cell"><small>Check In</small><strong>{record.checkIn}</strong></div>
              <div className="cf-cell"><small>Check Out</small><strong>{record.checkOut}</strong></div>
              <div className="cf-cell"><small>Nights</small><strong>{record.nights}</strong></div>
              <div className="cf-cell"><small>Guests</small><strong>{record.guests}</strong></div>
              <div className="cf-cell"><small>Rooms</small><strong>{record.rooms}</strong></div>
              <div className="cf-cell"><small>Payment</small><strong>{record.paymentMethod}</strong></div>
            </div>

            <div className="cf-voucher__total">
              <span><FaMapMarkerAlt /> Royal Hotels · Marine Drive, Mumbai</span>
              <div className="cf-voucher__amt">
                <small>Total Paid</small>
                <strong>{formatINR(record.total)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="cf-steps reveal">
          <h3 className="cf-steps__head">What happens next</h3>
          <div className="cf-steps__grid">
            {NEXT_STEPS.map((s) => (
              <div className="cf-step card" key={s.title}>
                <s.icon className="cf-step__icon" />
                <strong>{s.title}</strong>
                <p className="text-dim">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="cf-actions reveal">
          <button className="btn btn-gold btn-lg" onClick={() => navigate("/bookings")}>
            <FaListUl /> View My Bookings
          </button>
          <Link to="/" className="btn btn-outline btn-lg"><FaHome /> Back to Home</Link>
          <button className="btn btn-ghost btn-lg" onClick={() => window.print()} aria-label="Print voucher">
            <FaPrint /> Print
          </button>
        </div>
      </section>
    </div>
  );
}
