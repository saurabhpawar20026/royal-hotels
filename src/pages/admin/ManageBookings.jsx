import { useMemo, useState } from "react";
import { FaSearch, FaCalendarCheck, FaSignInAlt, FaClock, FaSignOutAlt, FaBan } from "react-icons/fa";
import { bookings as seedBookings, BOOKING_STATUSES } from "../../data/admin.js";
import { formatINR } from "../../data/rooms.js";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./admin.css";

function badgeClass(status) {
  switch (status) {
    case "Confirmed":
    case "Checked In":
      return "badge badge-success";
    case "Pending":
      return "badge badge-warning";
    case "Cancelled":
      return "badge badge-danger";
    default:
      return "badge";
  }
}

const STAT_ICONS = {
  Confirmed: FaCalendarCheck,
  "Checked In": FaSignInAlt,
  Pending: FaClock,
  "Checked Out": FaSignOutAlt,
  Cancelled: FaBan,
};

export default function ManageBookings() {
  const { notify } = useNotify();
  const [list, setList] = useState(seedBookings);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");

  const counts = useMemo(() => {
    const c = { All: list.length };
    BOOKING_STATUSES.forEach((s) => (c[s] = 0));
    list.forEach((b) => (c[b.status] = (c[b.status] || 0) + 1));
    return c;
  }, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((b) => {
      const okTab = tab === "All" || b.status === tab;
      const okQ =
        !q ||
        b.guest.toLowerCase().includes(q) ||
        b.room.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      return okTab && okQ;
    });
  }, [list, query, tab]);

  const changeStatus = (id, status) => {
    setList((l) => l.map((b) => (b.id === id ? { ...b, status } : b)));
    notify(`${id} → ${status}`, "info");
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Manage Bookings</h1>
        <p>Track and update every reservation across the property in one place.</p>
      </div>

      {/* Stat cards */}
      <div className="kpi-grid">
        <div className="kpi">
          <span className="adm-kpi-ico"><FaCalendarCheck /></span>
          <div className="kpi__label">Total Bookings</div>
          <div className="kpi__value">{counts.All}</div>
        </div>
        {BOOKING_STATUSES.slice(0, 3).map((s) => {
          const Ico = STAT_ICONS[s] || FaCalendarCheck;
          return (
            <div className="kpi" key={s}>
              <span className="adm-kpi-ico"><Ico /></span>
              <div className="kpi__label">{s}</div>
              <div className="kpi__value">{counts[s] || 0}</div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <FaSearch />
          <input
            placeholder="Search by guest, room or booking ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="adm-chips">
        <button className={`adm-chip ${tab === "All" ? "active" : ""}`} onClick={() => setTab("All")}>
          All <span className="adm-chip__count">{counts.All}</span>
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button key={s} className={`adm-chip ${tab === s ? "active" : ""}`} onClick={() => setTab(s)}>
            {s} <span className="adm-chip__count">{counts[s] || 0}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="panel" style={{ marginTop: "1.4rem" }}>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th><th>Guest</th><th>Room</th>
                <th>Stay</th><th>Nights</th><th>Amount</th>
                <th>Status</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.guest}</td>
                  <td>{b.room}</td>
                  <td>{b.checkIn} → {b.checkOut}</td>
                  <td>{b.nights}</td>
                  <td>{formatINR(b.amount)}</td>
                  <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                  <td>
                    <select
                      className="adm-status-select"
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                    >
                      {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="adm-empty">No bookings match your filters.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
