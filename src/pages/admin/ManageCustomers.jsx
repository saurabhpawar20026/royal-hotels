import { useMemo, useState } from "react";
import {
  FaSearch, FaUsers, FaRupeeSign, FaBed, FaTimes,
  FaMapMarkerAlt, FaEnvelope, FaCrown, FaGem,
} from "react-icons/fa";
import { customers as seedCustomers } from "../../data/admin.js";
import { formatINR } from "../../data/rooms.js";
import "./admin.css";

const TIERS = ["Silver", "Gold", "Platinum", "Diamond"];

const tierClass = (tier) => `adm-tier ${tier.toLowerCase()}`;

export default function ManageCustomers() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seedCustomers;
    return seedCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.tier.toLowerCase().includes(q)
    );
  }, [query]);

  const stats = useMemo(() => {
    const total = seedCustomers.length;
    const spend = seedCustomers.reduce((s, c) => s + c.spend, 0);
    const stays = seedCustomers.reduce((s, c) => s + c.stays, 0);
    return { total, spend, avgStays: total ? Math.round(stays / total) : 0 };
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <h1>Customers</h1>
        <p>Your most valued guests and their loyalty across every Royal stay.</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi">
          <span className="adm-kpi-ico"><FaUsers /></span>
          <div className="kpi__label">Total Customers</div>
          <div className="kpi__value">{stats.total}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaRupeeSign /></span>
          <div className="kpi__label">Lifetime Spend</div>
          <div className="kpi__value">{formatINR(stats.spend)}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaBed /></span>
          <div className="kpi__label">Avg. Stays</div>
          <div className="kpi__value">{stats.avgStays}</div>
        </div>
        <div className="kpi">
          <span className="adm-kpi-ico"><FaGem /></span>
          <div className="kpi__label">Elite Members</div>
          <div className="kpi__value">
            {seedCustomers.filter((c) => c.tier === "Diamond" || c.tier === "Platinum").length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <FaSearch />
          <input
            placeholder="Search by name, email, location or tier…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Card grid */}
      <div className="adm-cust-grid">
        {filtered.map((c) => (
          <button className="adm-cust" key={c.id} onClick={() => setSelected(c)}>
            <div className="adm-cust__top">
              <img className="adm-cust__avatar" src={c.avatar} alt="" />
              <div style={{ minWidth: 0 }}>
                <div className="adm-cust__name">{c.name}</div>
                <div className="adm-cust__email">{c.email}</div>
                <div style={{ marginTop: "0.5rem" }}>
                  <span className={tierClass(c.tier)}><FaCrown /> {c.tier}</span>
                </div>
              </div>
            </div>
            <div className="adm-cust__stats">
              <div>
                <div className="adm-cust__stat-v">{c.stays}</div>
                <div className="adm-cust__stat-l">Stays</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="adm-cust__stat-v">{formatINR(c.spend)}</div>
                <div className="adm-cust__stat-l">Lifetime</div>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="adm-empty">No customers found.</div>}
      </div>

      {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CustomerModal({ customer, onClose }) {
  const tierIndex = Math.max(0, TIERS.indexOf(customer.tier));
  const progress = ((tierIndex + 1) / TIERS.length) * 100;

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal adm-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__head">
          <h3>Customer Profile</h3>
          <button className="adm-modal__close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="adm-detail__hero">
          <img className="adm-detail__avatar" src={customer.avatar} alt="" />
          <div>
            <div className="adm-cust__name" style={{ fontSize: "1.2rem" }}>{customer.name}</div>
            <div style={{ marginTop: "0.4rem" }}>
              <span className={tierClass(customer.tier)}><FaCrown /> {customer.tier} Member</span>
            </div>
          </div>
        </div>

        <div className="adm-detail__rows">
          <div className="adm-detail__row">
            <span><FaEnvelope /> Email</span><span>{customer.email}</span>
          </div>
          <div className="adm-detail__row">
            <span><FaMapMarkerAlt /> Location</span><span>{customer.location}</span>
          </div>
          <div className="adm-detail__row">
            <span><FaBed /> Total Stays</span><span>{customer.stays}</span>
          </div>
          <div className="adm-detail__row">
            <span><FaRupeeSign /> Lifetime Spend</span><span>{formatINR(customer.spend)}</span>
          </div>
          <div className="adm-detail__row">
            <span>Customer ID</span><span>{customer.id}</span>
          </div>
        </div>

        <div className="adm-loyalty">
          <div className="adm-cust__stat-l">Loyalty Tier</div>
          <div className="adm-loyalty__track">
            <div className="adm-loyalty__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="adm-loyalty__steps">
            {TIERS.map((t, i) => (
              i <= tierIndex ? <b key={t}>{t}</b> : <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
