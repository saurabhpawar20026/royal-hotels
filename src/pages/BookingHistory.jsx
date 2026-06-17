import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt, FaUserFriends, FaMoon, FaHashtag, FaCreditCard,
  FaSuitcaseRolling, FaTimesCircle, FaRedo,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { heroes, u } from "../data/images.js";
import { formatINR } from "../data/rooms.js";
import { useBooking } from "../context/BookingContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./BookingHistory.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE = {
  Confirmed: "badge-success",
  Completed: "badge-gold",
  Cancelled: "badge-danger",
  Pending: "badge-warning",
};

const inGroup = (status, group) => {
  if (group === "all") return true;
  if (group === "upcoming") return status === "Confirmed" || status === "Pending";
  if (group === "completed") return status === "Completed";
  if (group === "cancelled") return status === "Cancelled";
  return true;
};

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function BookingHistory() {
  const { history, setHistory } = useBooking();
  const { notify } = useNotify();
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => history.filter((b) => inGroup(b.status, filter)),
    [history, filter]
  );

  useReveal(`bookings-${filter}-${history.length}`);

  const cancel = (ref) => {
    setHistory((h) => h.map((b) => (b.ref === ref ? { ...b, status: "Cancelled" } : b)));
    notify("Booking cancelled", "info", `Reference ${ref} has been cancelled.`);
  };

  return (
    <div>
      <PageHero
        image={u(heroes[2], 1600)}
        eyebrow="Your Journeys"
        title="My Bookings"
        subtitle="Every royal escape you've reserved with us, in one place."
        crumbs={[{ label: "Home", to: "/" }, { label: "My Bookings" }]}
      />

      <section className="section container">
        {history.length > 0 && (
          <div className="bh-filters">
            {FILTERS.map((f) => {
              const n = history.filter((b) => inGroup(b.status, f.key)).length;
              return (
                <button
                  key={f.key}
                  className={`chip ${filter === f.key ? "on" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label} <span className="bh-filters__count">{n}</span>
                </button>
              );
            })}
          </div>
        )}

        {history.length === 0 ? (
          <EmptyState />
        ) : visible.length === 0 ? (
          <div className="bh-empty glass">
            <h3 className="serif">Nothing here yet</h3>
            <p className="text-dim">No bookings match this filter.</p>
            <button className="btn btn-outline" onClick={() => setFilter("all")}>Show all</button>
          </div>
        ) : (
          <div className="bh-list">
            {visible.map((b) => (
              <article className="bh-card glass reveal" key={b.ref}>
                <div className="bh-card__media">
                  <img src={b.roomImage} alt={b.roomName} loading="lazy" />
                  <span className={`badge ${STATUS_BADGE[b.status] || "badge-gold"} bh-card__status`}>
                    {b.status}
                  </span>
                </div>

                <div className="bh-card__body">
                  <div className="bh-card__top">
                    <div>
                      <h3 className="serif">{b.roomName}</h3>
                      <p className="bh-card__ref"><FaHashtag /> {b.ref}</p>
                    </div>
                    <div className="bh-card__total">
                      <strong>{formatINR(b.total)}</strong>
                      <span>Total paid</span>
                    </div>
                  </div>

                  <ul className="bh-card__meta">
                    <li><FaCalendarAlt /> {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</li>
                    <li><FaMoon /> {b.nights} night{b.nights !== 1 ? "s" : ""}</li>
                    <li><FaUserFriends /> {b.guests} guest{b.guests !== 1 ? "s" : ""} · {b.rooms} room{b.rooms !== 1 ? "s" : ""}</li>
                    <li><FaCreditCard /> {b.paymentMethod}</li>
                  </ul>

                  <div className="bh-card__foot">
                    <span className="bh-card__booked text-dim">Booked on {fmtDate(b.bookedOn)}</span>
                    <div className="bh-card__actions">
                      {b.status === "Confirmed" && (
                        <button
                          className="btn btn-ghost btn-sm bh-card__cancel"
                          onClick={() => cancel(b.ref)}
                          aria-label={`Cancel booking ${b.ref}`}
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      )}
                      <Link to="/rooms" className="btn btn-outline btn-sm">
                        <FaRedo /> Book Again
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bh-empty glass reveal">
      <span className="bh-empty__icon"><FaSuitcaseRolling /></span>
      <h3 className="serif">No bookings yet</h3>
      <p className="text-dim">When you reserve a suite, your journey appears here.</p>
      <Link to="/rooms" className="btn btn-gold btn-lg">Explore Rooms</Link>
    </div>
  );
}
