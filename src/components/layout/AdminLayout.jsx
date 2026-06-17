import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import {
  FaCrown, FaThLarge, FaBed, FaCalendarCheck, FaUsers, FaChartPie,
  FaBars, FaTimes, FaSignOutAlt, FaArrowLeft, FaBell,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import "./AdminLayout.css";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: FaThLarge, end: true },
  { to: "/admin/rooms", label: "Manage Rooms", icon: FaBed },
  { to: "/admin/bookings", label: "Bookings", icon: FaCalendarCheck },
  { to: "/admin/customers", label: "Customers", icon: FaUsers },
  { to: "/admin/analytics", label: "Analytics", icon: FaChartPie },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Guard: only admins may enter. Demo tip shown on login page.
  if (!isAdmin) return <Navigate to="/login" replace state={{ admin: true }} />;

  const doLogout = () => { logout(); navigate("/"); };

  return (
    <div className="admin">
      <aside className={`admin__sidebar ${open ? "open" : ""}`}>
        <Link to="/admin" className="admin__brand">
          <FaCrown /> <span>ROYAL<span className="gold-text"> ADMIN</span></span>
        </Link>
        <nav className="admin__nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `admin__nav-item ${isActive ? "active" : ""}`}>
              <n.icon /> <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin__side-foot">
          <Link to="/" className="admin__nav-item"><FaArrowLeft /> <span>Back to Site</span></Link>
          <button className="admin__nav-item danger" onClick={doLogout}><FaSignOutAlt /> <span>Sign Out</span></button>
        </div>
      </aside>

      {open && <div className="admin__overlay" onClick={() => setOpen(false)} />}

      <div className="admin__main">
        <header className="admin__topbar glass">
          <button className="admin__burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle sidebar">
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <div className="admin__topbar-title">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</div>
          <div className="admin__topbar-actions">
            <button className="nav__icon" aria-label="Notifications"><FaBell /></button>
            <img className="admin__avatar" src={user?.avatar} alt="" />
          </div>
        </header>
        <div className="admin__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
