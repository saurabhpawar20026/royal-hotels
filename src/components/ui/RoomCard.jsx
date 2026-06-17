import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaExpand, FaUserFriends, FaBed } from "react-icons/fa";
import Stars from "./Stars.jsx";
import { formatINR, isAvailable } from "../../data/rooms.js";
import { CATEGORIES } from "../../data/rooms.js";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./RoomCard.css";

const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label?.replace(" Rooms", "").replace(" Suites", " Suite") || key;

export default function RoomCard({ room }) {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const { updateDraft } = useBooking();
  const { notify } = useNotify();
  const available = isAvailable(room);
  const wished = has(room.id);

  const book = () => {
    if (!available) return;
    updateDraft({ roomId: room.id });
    navigate("/booking");
  };

  const onWish = (e) => {
    e.preventDefault();
    toggle(room.id);
    notify(wished ? "Removed from wishlist" : "Saved to wishlist", wished ? "info" : "success", room.name);
  };

  return (
    <article className="room-card card">
      <div className="room-card__media">
        <Link to={`/rooms/${room.slug}`}>
          <img src={room.images[0]} alt={room.name} loading="lazy" />
        </Link>
        <span className="room-card__cat badge badge-gold">{catLabel(room.category)}</span>
        <button className={`room-card__wish ${wished ? "on" : ""}`} onClick={onWish} aria-label="Toggle wishlist">
          {wished ? <FaHeart /> : <FaRegHeart />}
        </button>
        <span className={`room-card__avail badge ${available ? "badge-success" : "badge-danger"}`}>
          {available ? `${room.availableCount} left` : "Sold Out"}
        </span>
      </div>

      <div className="room-card__body">
        <div className="room-card__top">
          <div className="stars-row">
            <Stars value={room.rating} />
            <span className="text-dim">{room.rating} · {room.reviewsCount}</span>
          </div>
          <span className="room-card__view">{room.view}</span>
        </div>

        <h3><Link to={`/rooms/${room.slug}`}>{room.name}</Link></h3>
        <p className="room-card__desc">{room.shortDesc}</p>

        <ul className="room-card__meta">
          <li><FaExpand /> {room.size} sq.ft</li>
          <li><FaUserFriends /> {room.capacity} Guests</li>
          <li><FaBed /> {room.beds}</li>
        </ul>

        <div className="room-card__foot">
          <div className="room-card__price">
            {room.oldPrice && <span className="old">{formatINR(room.oldPrice)}</span>}
            <span className="now">{formatINR(room.price)}</span>
            <span className="per">/ night</span>
          </div>
          <div className="room-card__actions">
            <Link to={`/rooms/${room.slug}`} className="btn btn-outline btn-sm">Details</Link>
            <button className="btn btn-gold btn-sm" onClick={book} disabled={!available}>Book Now</button>
          </div>
        </div>
      </div>
    </article>
  );
}
