import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCrown, FaUserCircle, FaEnvelope, FaPhoneAlt, FaPen, FaCheck, FaTimes,
  FaSuitcaseRolling, FaMoon, FaHeart, FaArrowRight, FaRegBell, FaTag, FaGem,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Profile.css";

const TIER_POINTS = { Platinum: 12480, Gold: 7320, Silver: 3150, Staff: 0 };
const TIER_NEXT = { Platinum: 15000, Gold: 12480, Silver: 7320, Staff: 1 };

export default function Profile() {
  const { user, isAuthed, updateProfile } = useAuth();
  const { history } = useBooking();
  const { count: wishCount } = useWishlist();
  const { notify } = useNotify();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState({ newsletter: true, offers: true, sms: false });

  useReveal(`profile-${isAuthed}`);

  if (!isAuthed) {
    return (
      <section className="section container profile-gate">
        <div className="profile-gate__card glass reveal">
          <FaUserCircle />
          <h1 className="serif">You're not signed in</h1>
          <p className="text-dim">Sign in to view your profile, bookings and saved stays.</p>
          <Link to="/login" className="btn btn-gold btn-lg">Sign In</Link>
        </div>
      </section>
    );
  }

  const tier = user.tier || "Platinum";
  const points = TIER_POINTS[tier] ?? 12480;
  const nextThreshold = TIER_NEXT[tier] ?? 15000;
  const progress = Math.min(100, Math.round((points / nextThreshold) * 100));
  const nights = history.reduce((s, b) => s + (b.nights || 0), 0);

  const startEdit = () => {
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    setEditing(true);
  };
  const save = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name, email: form.email, phone: form.phone });
    setEditing(false);
    notify("Profile updated", "success", "Your details were saved.");
  };

  return (
    <section className="section container profile">
      {/* Header */}
      <header className="profile-head glass reveal">
        <div className="profile-head__avatar">
          {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FaUserCircle />}
          <span className="profile-head__tier badge badge-gold"><FaCrown /> {tier}</span>
        </div>

        {!editing ? (
          <div className="profile-head__info">
            <h1 className="serif">{user.name}</h1>
            <p className="profile-head__email"><FaEnvelope /> {user.email}</p>
            {user.phone && <p className="profile-head__email"><FaPhoneAlt /> {user.phone}</p>}
            <p className="text-dim">Member since {user.memberSince || "2021"}</p>
            <button className="btn btn-outline btn-sm profile-head__edit" onClick={startEdit}>
              <FaPen /> Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-head__form" onSubmit={save}>
            <label className="field"><span>Name</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </label>
            <label className="field"><span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </label>
            <label className="field"><span>Phone</span>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </label>
            <div className="profile-head__actions">
              <button type="submit" className="btn btn-gold btn-sm"><FaCheck /> Save</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}><FaTimes /> Cancel</button>
            </div>
          </form>
        )}
      </header>

      <div className="profile-grid">
        {/* Loyalty card */}
        <div className="profile-loyalty reveal">
          <div className="profile-loyalty__top">
            <span><FaGem /> Royal Loyalty</span>
            <span className="profile-loyalty__tier">{tier} Member</span>
          </div>
          <div className="profile-loyalty__points">
            <strong>{points.toLocaleString("en-IN")}</strong>
            <span>Royal Points</span>
          </div>
          <div className="profile-loyalty__bar">
            <div className="profile-loyalty__bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="profile-loyalty__hint">
            {progress >= 100
              ? "Top tier unlocked — enjoy every privilege."
              : `${(nextThreshold - points).toLocaleString("en-IN")} points to your next reward.`}
          </p>
          <div className="profile-loyalty__chip" aria-hidden="true">
            <FaCrown />
            <span>•••• {String(user.id || "0000").slice(-4).padStart(4, "0")}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats reveal">
          <div className="profile-stat">
            <FaSuitcaseRolling />
            <strong>{history.length}</strong>
            <span>Total Bookings</span>
          </div>
          <div className="profile-stat">
            <FaMoon />
            <strong>{nights}</strong>
            <span>Nights Stayed</span>
          </div>
          <div className="profile-stat">
            <FaHeart />
            <strong>{wishCount}</strong>
            <span>Saved Stays</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="profile-links reveal">
          <Link to="/bookings" className="profile-link glass">
            <span className="profile-link__icon"><FaSuitcaseRolling /></span>
            <span className="profile-link__text">
              <strong>My Bookings</strong>
              <small>Review past & upcoming stays</small>
            </span>
            <FaArrowRight className="profile-link__arrow" />
          </Link>
          <Link to="/wishlist" className="profile-link glass">
            <span className="profile-link__icon"><FaHeart /></span>
            <span className="profile-link__text">
              <strong>My Wishlist</strong>
              <small>Suites you've saved for later</small>
            </span>
            <FaArrowRight className="profile-link__arrow" />
          </Link>
        </div>

        {/* Preferences */}
        <div className="profile-prefs glass reveal">
          <h2 className="serif">Preferences</h2>
          <p className="text-dim">Choose how Royal Hotels keeps in touch.</p>
          <ul>
            <li>
              <span className="profile-pref__label"><FaRegBell /> Newsletter & stories</span>
              <Toggle on={prefs.newsletter} onChange={() => setPrefs((p) => ({ ...p, newsletter: !p.newsletter }))} label="newsletter" />
            </li>
            <li>
              <span className="profile-pref__label"><FaTag /> Exclusive member offers</span>
              <Toggle on={prefs.offers} onChange={() => setPrefs((p) => ({ ...p, offers: !p.offers }))} label="offers" />
            </li>
            <li>
              <span className="profile-pref__label"><FaPhoneAlt /> SMS alerts</span>
              <Toggle on={prefs.sms} onChange={() => setPrefs((p) => ({ ...p, sms: !p.sms }))} label="SMS alerts" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Toggle ${label}`}
      className={`profile-toggle ${on ? "on" : ""}`}
      onClick={onChange}
    >
      <span className="profile-toggle__dot" />
    </button>
  );
}
