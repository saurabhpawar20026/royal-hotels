import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaExpand, FaUserFriends, FaBed, FaEye, FaHeart, FaRegHeart, FaCheck,
  FaArrowRight, FaClock, FaBan, FaPaw, FaSmokingBan, FaChild, FaConciergeBell,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import RoomCard from "../components/ui/RoomCard.jsx";
import Stars from "../components/ui/Stars.jsx";
import AmenityIcon from "../components/ui/AmenityIcon.jsx";
import { getRoomBySlug, similarRooms, formatINR, isAvailable, CATEGORIES } from "../data/rooms.js";
import { reviews } from "../data/reviews.js";
import { nightsBetween } from "../context/BookingContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./RoomDetails.css";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d, n) => { const x = new Date(d || today()); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

const POLICIES = [
  { icon: FaClock, title: "Check-in / Check-out", text: "Check-in from 2:00 PM · Check-out by 12:00 noon. Early check-in on request." },
  { icon: FaBan, title: "Cancellation", text: "Complimentary cancellation up to 48 hours before arrival. One night charged thereafter." },
  { icon: FaChild, title: "Children & Extra Beds", text: "Children of all ages welcome. Extra bed available at ₹3,500 per night." },
  { icon: FaSmokingBan, title: "Smoking", text: "All rooms are strictly non-smoking. Designated lounges available on property." },
  { icon: FaPaw, title: "Pets", text: "Pet-friendly on request (under 10kg). A grooming kit and bed are provided." },
  { icon: FaConciergeBell, title: "Services", text: "24-hour room service, daily housekeeping and dedicated concierge included." },
];

export default function RoomDetails() {
  const { slug } = useParams();
  const room = getRoomBySlug(slug);
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const { updateDraft } = useBooking();
  const { notify } = useNotify();
  const [active, setActive] = useState(0);
  const [checkIn, setCheckIn] = useState(today());
  const [checkOut, setCheckOut] = useState(plusDays(today(), 2));
  const [guests, setGuests] = useState(2);

  useReveal(slug);

  if (!room) {
    return (
      <div className="page-narrow text-center" style={{ padding: "8rem 1rem", minHeight: "60vh" }}>
        <h1>Room not found</h1>
        <p className="text-dim mt-2">The room you're looking for may have been renamed or removed.</p>
        <Link to="/rooms" className="btn btn-gold mt-3">Browse All Rooms</Link>
      </div>
    );
  }

  const available = isAvailable(room);
  const wished = has(room.id);
  const nights = nightsBetween(checkIn, checkOut);
  const roomTotal = room.price * nights;
  const discount = nights >= 3 ? Math.round(roomTotal * 0.1) : 0;
  const taxedBase = roomTotal - discount;
  const taxes = Math.round(taxedBase * 0.17);
  const total = taxedBase + taxes;
  const catLabel = CATEGORIES.find((c) => c.key === room.category)?.label;
  const roomReviews = reviews.filter((r) => r.room === room.name);
  const shownReviews = (roomReviews.length ? roomReviews : reviews).slice(0, 3);

  const reserve = () => {
    if (!available) return;
    updateDraft({ roomId: room.id, checkIn, checkOut, guests });
    navigate("/booking");
  };

  const onWish = () => {
    toggle(room.id);
    notify(wished ? "Removed from wishlist" : "Saved to wishlist", wished ? "info" : "success", room.name);
  };

  return (
    <div>
      <PageHero
        image={room.images[0]}
        eyebrow={catLabel}
        title={room.name}
        crumbs={[{ label: "Home", to: "/" }, { label: "Rooms", to: "/rooms" }, { label: room.name }]}
      />

      <section className="section container rd-layout">
        <div className="rd-main">
          {/* Gallery */}
          <div className="rd-gallery reveal">
            <div className="rd-gallery__main">
              <img src={room.images[active]} alt={room.name} />
              <span className={`badge ${available ? "badge-success" : "badge-danger"} rd-gallery__status`}>
                {available ? `${room.availableCount} rooms available` : "Currently Sold Out"}
              </span>
            </div>
            <div className="rd-gallery__thumbs">
              {room.images.map((img, i) => (
                <button key={i} className={`rd-thumb ${i === active ? "on" : ""}`} onClick={() => setActive(i)}>
                  <img src={img} alt={`${room.name} view ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Heading row */}
          <div className="rd-head reveal">
            <div>
              <div className="flex items-center gap-2 wrap">
                <Stars value={room.rating} />
                <span className="text-dim">{room.rating} · {room.reviewsCount} reviews</span>
                <span className="badge badge-gold">{room.view}</span>
              </div>
              <h2 className="mt-2">{room.name}</h2>
            </div>
            <button className={`rd-wish ${wished ? "on" : ""}`} onClick={onWish}>
              {wished ? <FaHeart /> : <FaRegHeart />} <span>{wished ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* Quick facts */}
          <div className="rd-facts reveal">
            <div className="rd-fact"><FaExpand /><div><strong>{room.size} sq.ft</strong><span>Room Size</span></div></div>
            <div className="rd-fact"><FaUserFriends /><div><strong>{room.capacity} Guests</strong><span>Max Capacity</span></div></div>
            <div className="rd-fact"><FaBed /><div><strong>{room.beds}</strong><span>Bedding</span></div></div>
            <div className="rd-fact"><FaEye /><div><strong>{room.view}</strong><span>Outlook</span></div></div>
          </div>

          {/* Description */}
          <div className="rd-block reveal">
            <h3>About this room</h3>
            <p className="lead">{room.shortDesc}</p>
            <p className="text-dim">{room.description}</p>
          </div>

          {/* Amenities */}
          <div className="rd-block reveal">
            <h3>Amenities & Comforts</h3>
            <div className="rd-amenities">
              {room.amenities.map((a) => (
                <div className="rd-amenity" key={a}><AmenityIcon name={a} /><span>{a}</span></div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="rd-block reveal">
            <h3>Room Policies</h3>
            <div className="rd-policies">
              {POLICIES.map((p) => (
                <div className="rd-policy" key={p.title}>
                  <p.icon className="rd-policy__icon" />
                  <div><strong>{p.title}</strong><p>{p.text}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="rd-block reveal">
            <h3>Guest Reviews</h3>
            <div className="rd-reviews">
              {shownReviews.map((r) => (
                <figure className="rd-review card" key={r.id}>
                  <div className="rd-review__top">
                    <img src={r.avatar} alt={r.name} loading="lazy" />
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.location} · {r.date}</span>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <blockquote>"{r.text}"</blockquote>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* Booking widget */}
        <aside className="rd-aside">
          <div className="rd-widget glass">
            <div className="rd-widget__price">
              {room.oldPrice && <span className="old">{formatINR(room.oldPrice)}</span>}
              <span className="now">{formatINR(room.price)}</span>
              <span className="per">/ night</span>
            </div>
            <div className="rd-widget__dates">
              <div className="field">
                <label>Check In</label>
                <input type="date" min={today()} value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(plusDays(e.target.value, 1)); }} />
              </div>
              <div className="field">
                <label>Check Out</label>
                <input type="date" min={plusDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(+e.target.value)}>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {nights > 0 && (
              <div className="rd-widget__calc">
                <div className="row"><span>{formatINR(room.price)} × {nights} night{nights > 1 ? "s" : ""}</span><span>{formatINR(roomTotal)}</span></div>
                {discount > 0 && <div className="row discount"><span><FaCheck /> Long-stay discount</span><span>−{formatINR(discount)}</span></div>}
                <div className="row"><span>Taxes & service (17%)</span><span>{formatINR(taxes)}</span></div>
                <div className="row total"><span>Total</span><span>{formatINR(total)}</span></div>
              </div>
            )}

            <button className="btn btn-gold btn-block btn-lg" onClick={reserve} disabled={!available}>
              {available ? <>Reserve Now <FaArrowRight /></> : "Sold Out"}
            </button>
            <p className="rd-widget__note">You won't be charged yet · Free cancellation within 48h</p>
          </div>
        </aside>
      </section>

      {/* Similar rooms */}
      <section className="section container">
        <div className="section-head left reveal">
          <span className="eyebrow">You may also adore</span>
          <h2>Similar {catLabel}</h2>
        </div>
        <div className="grid grid-3">
          {similarRooms(room, 3).map((r) => <div className="reveal" key={r.id}><RoomCard room={r} /></div>)}
        </div>
      </section>
    </div>
  );
}
