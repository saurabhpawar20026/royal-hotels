import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaTrashAlt } from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import RoomCard from "../components/ui/RoomCard.jsx";
import { heroes, u } from "../data/images.js";
import { getRoomById } from "../data/rooms.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Wishlist.css";

export default function Wishlist() {
  const { ids, count, clear } = useWishlist();
  const { notify } = useNotify();

  const savedRooms = useMemo(
    () => ids.map((id) => getRoomById(id)).filter(Boolean),
    [ids]
  );

  useReveal(`wishlist-${count}`);

  const clearAll = () => {
    clear();
    notify("Wishlist cleared", "info", "All saved stays were removed.");
  };

  return (
    <div>
      <PageHero
        image={u(heroes[1], 1600)}
        eyebrow="Saved For Later"
        title="My Wishlist"
        subtitle="The suites that caught your eye — ready whenever you are."
        crumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      <section className="section container">
        {savedRooms.length === 0 ? (
          <div className="wish-empty glass reveal">
            <span className="wish-empty__icon"><FaRegHeart /></span>
            <h3 className="serif">Your wishlist is empty</h3>
            <p className="text-dim">Tap the heart on any room to save it here for later.</p>
            <Link to="/rooms" className="btn btn-gold btn-lg">Browse Rooms</Link>
          </div>
        ) : (
          <>
            <div className="wish-head">
              <p className="wish-head__count">
                <FaHeart /> <strong>{savedRooms.length}</strong> saved stay{savedRooms.length !== 1 ? "s" : ""}
              </p>
              <button className="btn btn-ghost btn-sm wish-head__clear" onClick={clearAll} aria-label="Clear all saved stays">
                <FaTrashAlt /> Clear All
              </button>
            </div>

            <div className="grid grid-3">
              {savedRooms.map((room) => (
                <div className="reveal" key={room.id}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
