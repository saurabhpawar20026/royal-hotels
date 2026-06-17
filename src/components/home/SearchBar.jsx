import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBed, FaSearch } from "react-icons/fa";
import { useBooking } from "../../context/BookingContext.jsx";
import "./SearchBar.css";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d, n) => {
  const x = new Date(d || today());
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();
  const [checkIn, setCheckIn] = useState(draft.checkIn || today());
  const [checkOut, setCheckOut] = useState(draft.checkOut || plusDays(today(), 2));
  const [guests, setGuests] = useState(draft.guests || 2);
  const [rooms, setRooms] = useState(draft.rooms || 1);

  const submit = (e) => {
    e.preventDefault();
    updateDraft({ checkIn, checkOut, guests, rooms });
    if (onSearch) onSearch({ checkIn, checkOut, guests, rooms });
    else navigate("/rooms");
  };

  return (
    <form className="searchbar glass" onSubmit={submit}>
      <div className="searchbar__field">
        <label><FaCalendarAlt /> Check In</label>
        <input type="date" min={today()} value={checkIn}
          onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(plusDays(e.target.value, 1)); }} />
      </div>
      <div className="searchbar__divider" />
      <div className="searchbar__field">
        <label><FaCalendarAlt /> Check Out</label>
        <input type="date" min={plusDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      </div>
      <div className="searchbar__divider" />
      <div className="searchbar__field">
        <label><FaUserFriends /> Guests</label>
        <select value={guests} onChange={(e) => setGuests(+e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
        </select>
      </div>
      <div className="searchbar__divider" />
      <div className="searchbar__field">
        <label><FaBed /> Rooms</label>
        <select value={rooms} onChange={(e) => setRooms(+e.target.value)}>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn-gold searchbar__btn">
        <FaSearch /> <span>Check Availability</span>
      </button>
    </form>
  );
}
