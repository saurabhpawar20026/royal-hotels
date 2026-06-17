import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaCrown, FaHeart, FaBell, FaSun, FaMoon, FaBars, FaTimes, FaUserCircle,
  FaSignOutAlt, FaChartLine, FaSuitcaseRolling, FaUser, FaCheckCircle, FaInfoCircle,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/restaurant", label: "Dining" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { count } = useWishlist();
  const { user, isAuthed, isAdmin, logout } = useAuth();
  const { list, unread, markAllRead } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setBellOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  const doLogout = () => {
    logout();
    setUserOpen(false);
    navigate("/");
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand">
          <FaCrown className="nav__crown" />
          <span className="nav__name">ROYAL<span className="gold-text"> HOTELS</span></span>
        </Link>

        <nav className="nav__links hide-mobile">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav__link ${isActive ? "active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__icon" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <Link to="/wishlist" className="nav__icon" aria-label="Wishlist" title="Wishlist">
            <FaHeart />
            {count > 0 && <span className="nav__dot">{count}</span>}
          </Link>

          <div className="nav__pop-wrap">
            <button className="nav__icon" onClick={() => { setBellOpen((v) => !v); setUserOpen(false); if (!bellOpen) markAllRead(); }} aria-label="Notifications">
              <FaBell />
              {unread > 0 && <span className="nav__dot">{unread}</span>}
            </button>
            {bellOpen && (
              <div className="nav__pop glass">
                <div className="nav__pop-head">Notifications</div>
                <ul className="nav__notes">
                  {list.slice(0, 6).map((n) => (
                    <li key={n.id} className={n.read ? "" : "fresh"}>
                      <span className={`note-ic ${n.type}`}>{n.type === "success" ? <FaCheckCircle /> : <FaInfoCircle />}</span>
                      <div>
                        <strong>{n.title}</strong>
                        {n.body && <p>{n.body}</p>}
                        <time>{n.time}</time>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {isAuthed ? (
            <div className="nav__pop-wrap">
              <button className="nav__avatar" onClick={() => { setUserOpen((v) => !v); setBellOpen(false); }} aria-label="Account">
                <img src={user.avatar} alt={user.name} />
              </button>
              {userOpen && (
                <div className="nav__pop glass nav__pop--user">
                  <div className="nav__user-head">
                    <img src={user.avatar} alt="" />
                    <div>
                      <strong>{user.name}</strong>
                      <span className="badge badge-gold">{user.tier}</span>
                    </div>
                  </div>
                  <Link to="/profile" className="nav__menu-item"><FaUser /> My Profile</Link>
                  <Link to="/bookings" className="nav__menu-item"><FaSuitcaseRolling /> My Bookings</Link>
                  <Link to="/wishlist" className="nav__menu-item"><FaHeart /> Wishlist</Link>
                  {isAdmin && <Link to="/admin" className="nav__menu-item"><FaChartLine /> Admin Dashboard</Link>}
                  <button className="nav__menu-item danger" onClick={doLogout}><FaSignOutAlt /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav__icon nav__icon--login" aria-label="Sign in" title="Sign in">
              <FaUserCircle />
            </Link>
          )}

          <Link to="/rooms" className="btn btn-gold btn-sm nav__cta hide-mobile">Book Now</Link>

          <button className="nav__burger" onClick={() => setDrawer(true)} aria-label="Open menu">
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav__drawer ${drawer ? "open" : ""}`}>
        <div className="nav__drawer-top">
          <span className="nav__name">ROYAL<span className="gold-text"> HOTELS</span></span>
          <button className="nav__icon" onClick={() => setDrawer(false)} aria-label="Close menu"><FaTimes /></button>
        </div>
        <nav className="nav__drawer-links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav__drawer-link ${isActive ? "active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
          {isAuthed && <NavLink to="/profile" className="nav__drawer-link">My Profile</NavLink>}
          {isAuthed && <NavLink to="/bookings" className="nav__drawer-link">My Bookings</NavLink>}
          {isAdmin && <NavLink to="/admin" className="nav__drawer-link">Admin Dashboard</NavLink>}
          {!isAuthed && <NavLink to="/login" className="nav__drawer-link">Sign In</NavLink>}
        </nav>
        <Link to="/rooms" className="btn btn-gold btn-block">Book Your Stay</Link>
      </div>
      {drawer && <div className="nav__overlay" onClick={() => setDrawer(false)} />}
    </header>
  );
}
