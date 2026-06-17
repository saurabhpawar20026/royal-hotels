import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck, FaArrowRight, FaExpand, FaUserFriends, FaEye, FaBed,
  FaDoorOpen, FaCalendarAlt, FaPlusCircle, FaRegCircle, FaCheckCircle,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { rooms, getRoomById, formatINR } from "../data/rooms.js";
import { useBooking, ADDONS } from "../context/BookingContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Booking.css";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d, n) => {
  const x = new Date(d || today());
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

const STEPS = [
  { n: 1, label: "Details" },
  { n: 2, label: "Payment" },
  { n: 3, label: "Confirmation" },
];

export function Stepper({ active }) {
  return (
    <div className="bk-stepper glass reveal">
      {STEPS.map((s, i) => (
        <div key={s.n} className="bk-stepper__item">
          <div
            className={`bk-step ${active === s.n ? "on" : ""} ${active > s.n ? "done" : ""}`}
          >
            <span className="bk-step__dot">
              {active > s.n ? <FaCheck /> : s.n}
            </span>
            <span className="bk-step__label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <span className="bk-step__line" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

export default function Booking() {
  const { draft, updateDraft, toggleAddon, priceBreakdown } = useBooking();
  const navigate = useNavigate();
  useReveal("booking-" + draft.roomId);

  // Default empty dates so the flow always works.
  useEffect(() => {
    const patch = {};
    if (!draft.checkIn) patch.checkIn = today();
    if (!draft.checkOut) patch.checkOut = plusDays(draft.checkIn || today(), 2);
    if (Object.keys(patch).length) updateDraft(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const room = draft.roomId ? getRoomById(draft.roomId) : null;
  const bd = priceBreakdown(draft);
  const canProceed = !!room && bd.nights > 0;

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
        eyebrow="Reservation"
        title="Build Your Stay"
        crumbs={[{ label: "Home", to: "/" }, { label: "Rooms", to: "/rooms" }, { label: "Booking" }]}
      />

      <section className="section container">
        <Stepper active={1} />

        {!room ? (
          <div className="bk-empty glass reveal">
            <FaDoorOpen className="bk-empty__icon" />
            <h2>Select a room to begin</h2>
            <p className="text-dim">
              Choose one of our signature rooms or suites and we'll craft the perfect stay.
            </p>
            <div className="field bk-empty__select">
              <label>Choose a room</label>
              <select
                value=""
                onChange={(e) => e.target.value && updateDraft({ roomId: e.target.value })}
              >
                <option value="" disabled>Select a room…</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatINR(r.price)}/night
                  </option>
                ))}
              </select>
            </div>
            <Link to="/rooms" className="btn btn-outline mt-2">
              Browse All Rooms <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="bk-layout">
            {/* LEFT */}
            <div className="bk-main">
              {/* Room summary */}
              <div className="bk-room card reveal">
                <div className="bk-room__img">
                  <img src={room.images[0]} alt={room.name} />
                </div>
                <div className="bk-room__body">
                  <span className="badge badge-gold">{room.view}</span>
                  <h3>{room.name}</h3>
                  <p className="text-dim">{room.shortDesc}</p>
                  <div className="bk-room__facts">
                    <span><FaExpand /> {room.size} sq.ft</span>
                    <span><FaUserFriends /> Up to {room.capacity}</span>
                    <span><FaBed /> {room.beds}</span>
                    <span><FaEye /> {room.view}</span>
                  </div>
                  <div className="bk-room__price">
                    <strong>{formatINR(room.price)}</strong> <span>/ night</span>
                    <Link to="/rooms" className="bk-room__change">Change room</Link>
                  </div>
                </div>
              </div>

              {/* Stay details */}
              <div className="bk-block glass reveal">
                <h3 className="bk-block__head"><FaCalendarAlt /> Stay Details</h3>
                <div className="bk-grid">
                  <div className="field">
                    <label>Check In</label>
                    <input
                      type="date"
                      min={today()}
                      value={draft.checkIn || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        const patch = { checkIn: v };
                        if (v && draft.checkOut && v >= draft.checkOut) patch.checkOut = plusDays(v, 1);
                        updateDraft(patch);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Check Out</label>
                    <input
                      type="date"
                      min={plusDays(draft.checkIn || today(), 1)}
                      value={draft.checkOut || ""}
                      onChange={(e) => updateDraft({ checkOut: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Guests</label>
                    <select
                      value={draft.guests}
                      onChange={(e) => updateDraft({ guests: +e.target.value })}
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Rooms</label>
                    <select
                      value={draft.rooms}
                      onChange={(e) => updateDraft({ rooms: +e.target.value })}
                    >
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="bk-block glass reveal">
                <h3 className="bk-block__head"><FaPlusCircle /> Enhance Your Stay</h3>
                <div className="bk-addons">
                  {ADDONS.map((a) => {
                    const on = (draft.addons || []).includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className={`bk-addon ${on ? "on" : ""}`}
                        onClick={() => toggleAddon(a.id)}
                        aria-pressed={on}
                        aria-label={`Toggle ${a.label}`}
                      >
                        <span className="bk-addon__check">
                          {on ? <FaCheckCircle /> : <FaRegCircle />}
                        </span>
                        <span className="bk-addon__info">
                          <strong>{a.label}</strong>
                          <span className="bk-addon__price">
                            {formatINR(a.price)}{a.perNight ? " /night" : ""}
                          </span>
                        </span>
                        <span className={`bk-switch ${on ? "on" : ""}`} aria-hidden="true">
                          <span className="bk-switch__knob" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="bk-aside">
              <div className="bk-summary glass reveal">
                <h3>Booking Summary</h3>
                <div className="bk-summary__recap">
                  <div><span>Check In</span><strong>{draft.checkIn || "—"}</strong></div>
                  <div><span>Check Out</span><strong>{draft.checkOut || "—"}</strong></div>
                  <div><span>Guests</span><strong>{draft.guests}</strong></div>
                  <div><span>Rooms</span><strong>{draft.rooms}</strong></div>
                </div>

                {bd.nights > 0 ? (
                  <div className="bk-summary__calc">
                    <div className="row">
                      <span>{formatINR(room.price)} × {bd.nights} night{bd.nights > 1 ? "s" : ""}</span>
                      <span>{formatINR(bd.roomTotal)}</span>
                    </div>
                    {bd.addonLines.map((a) => (
                      <div className="row" key={a.id}>
                        <span>{a.label}</span>
                        <span>{formatINR(a.amount)}</span>
                      </div>
                    ))}
                    {bd.discount > 0 && (
                      <div className="row discount">
                        <span><FaCheck /> Long-stay discount (10%)</span>
                        <span>−{formatINR(bd.discount)}</span>
                      </div>
                    )}
                    <div className="row"><span>Taxes (GST 12%)</span><span>{formatINR(bd.taxes)}</span></div>
                    <div className="row"><span>Service (5%)</span><span>{formatINR(bd.service)}</span></div>
                    <div className="row total"><span>Grand Total</span><span>{formatINR(bd.total)}</span></div>
                  </div>
                ) : (
                  <p className="bk-summary__hint text-dim">
                    Select valid check-in and check-out dates to see your total.
                  </p>
                )}

                <button
                  className="btn btn-gold btn-block btn-lg"
                  disabled={!canProceed}
                  onClick={() => navigate("/payment")}
                >
                  Proceed to Payment <FaArrowRight />
                </button>
                <p className="bk-summary__note">
                  You won't be charged yet · Free cancellation within 48h
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
