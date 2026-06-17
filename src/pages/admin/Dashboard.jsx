import {
  ResponsiveContainer, ComposedChart, Area, Line,
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  FaRupeeSign, FaBed, FaCalendarCheck, FaChartLine,
  FaArrowUp, FaArrowDown,
} from "react-icons/fa";
import {
  kpis, monthlyData, revenueByCategory, bookingSources,
  PIE_COLORS, bookings, occupancyByType,
} from "../../data/admin.js";
import { formatINR } from "../../data/rooms.js";
import "./admin.css";

const TOOLTIP = {
  background: "#14141d",
  border: "1px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  color: "#ece9e2",
};
const AXIS = { fill: "#a7a39b", fontSize: 12 };
const GRID = "rgba(255,255,255,0.08)";

const KPI_ICONS = [FaRupeeSign, FaBed, FaCalendarCheck, FaChartLine];

export function statusBadgeClass(status) {
  switch (status) {
    case "Confirmed":
    case "Checked In":
      return "badge badge-success";
    case "Pending":
      return "badge badge-warning";
    case "Cancelled":
      return "badge badge-danger";
    default: // Checked Out
      return "badge";
  }
}

export default function Dashboard() {
  return (
    <div>
      <div className="admin-page-head">
        <h1>Dashboard Overview</h1>
        <p>A real-time pulse of revenue, occupancy and guest activity across Royal Hotels.</p>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        {kpis.map((k, i) => {
          const Ico = KPI_ICONS[i % KPI_ICONS.length];
          return (
            <div className="kpi" key={k.label}>
              <span className="adm-kpi-ico"><Ico /></span>
              <div className="kpi__label">{k.label}</div>
              <div className="kpi__value">{k.value}</div>
              <span className={`kpi__delta ${k.up ? "up" : "down"}`}>
                {k.up ? <FaArrowUp /> : <FaArrowDown />} {k.delta}
              </span>
              <span className="kpi__sub">{k.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Revenue & Occupancy combined */}
      <div className="adm-grid adm-grid-wide">
        <div className="panel">
          <div className="panel__head">
            <div>
              <h3 className="adm-panel-title">Revenue &amp; Occupancy</h3>
              <span className="adm-panel-sub">Last 12 months · revenue in ₹ Cr</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#a7a39b" }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹Cr)"
                stroke="#d4af37" strokeWidth={2} fill="url(#revGrad)" />
              <Line yAxisId="right" type="monotone" dataKey="occupancy" name="Occupancy (%)"
                stroke="#60a5fa" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy by room type */}
        <div className="panel">
          <div className="panel__head">
            <h3 className="adm-panel-title">Occupancy by Room Type</h3>
          </div>
          <div className="adm-occ">
            {occupancyByType.map((o) => {
              const pct = Math.round((o.occupied / o.total) * 100);
              return (
                <div className="adm-occ__row" key={o.type}>
                  <div className="adm-occ__top">
                    <span>{o.type}</span>
                    <span>{o.occupied}/{o.total} · {pct}%</span>
                  </div>
                  <div className="adm-occ__track">
                    <div className="adm-occ__fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Donuts */}
      <div className="adm-grid adm-grid-2">
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Revenue by Category</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={revenueByCategory} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={3}>
                {revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="adm-legend">
            {revenueByCategory.map((d, i) => (
              <span className="adm-legend__item" key={d.name}>
                <span className="adm-legend__dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name} · {d.value}%
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Booking Sources</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bookingSources} layout="vertical" margin={{ left: 28, right: 16 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={96} />
              <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "rgba(212,175,55,0.08)" }} formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {bookingSources.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="adm-grid">
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Recent Bookings</h3></div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th><th>Guest</th><th>Room</th>
                  <th>Check-in</th><th>Nights</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.guest}</td>
                    <td>{b.room}</td>
                    <td>{b.checkIn}</td>
                    <td>{b.nights}</td>
                    <td>{formatINR(b.amount)}</td>
                    <td><span className={statusBadgeClass(b.status)}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
