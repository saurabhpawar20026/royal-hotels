import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { FaArrowTrendUp, FaLightbulb, FaBullhorn } from "react-icons/fa6";
import {
  monthlyData, revenueByCategory, bookingSources,
  PIE_COLORS, occupancyByType,
} from "../../data/admin.js";
import "./admin.css";

const TOOLTIP = {
  background: "#14141d",
  border: "1px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  color: "#ece9e2",
};
const AXIS = { fill: "#a7a39b", fontSize: 12 };
const GRID = "rgba(255,255,255,0.08)";

const occData = occupancyByType.map((o) => ({
  type: o.type,
  pct: Math.round((o.occupied / o.total) * 100),
}));

export default function Analytics() {
  return (
    <div>
      <div className="admin-page-head">
        <h1>Analytics &amp; Insights</h1>
        <p>Deep-dive metrics on revenue, occupancy and booking behaviour.</p>
      </div>

      <div className="adm-grid adm-grid-2" style={{ marginTop: 0 }}>
        {/* Revenue trend */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Revenue Trend (₹ Cr)</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="anRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#d4af37" strokeWidth={2} fill="url(#anRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy rate */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Occupancy Rate (%)</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="occupancy" name="Occupancy" stroke="#d4af37" strokeWidth={2}
                dot={{ r: 3, fill: "#d4af37" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings volume */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Bookings Volume</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "rgba(212,175,55,0.08)" }} />
              <Bar dataKey="bookings" name="Bookings" fill="#d4af37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy by room type */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Occupancy by Room Type (%)</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={occData} layout="vertical" margin={{ left: 24, right: 16 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="type" tick={AXIS} axisLine={false} tickLine={false} width={88} />
              <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "rgba(212,175,55,0.08)" }} formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" name="Occupancy" radius={[0, 6, 6, 0]} barSize={18}>
                {occData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by category donut */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Revenue by Category</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={revenueByCategory} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#a7a39b" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Booking sources donut */}
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Booking Sources</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bookingSources} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {bookingSources.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#a7a39b" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="adm-grid">
        <div className="panel">
          <div className="panel__head"><h3 className="adm-panel-title">Key Insights</h3></div>
          <div className="adm-insights">
            <div className="adm-insight">
              <span className="adm-insight__icon"><FaArrowTrendUp /></span>
              <div>
                <div className="adm-insight__t">December is the revenue peak</div>
                <div className="adm-insight__b">Festive-season demand drove ₹5.6 Cr and 94% occupancy — the strongest month of the year. Consider dynamic premium pricing earlier in November.</div>
              </div>
            </div>
            <div className="adm-insight">
              <span className="adm-insight__icon"><FaBullhorn /></span>
              <div>
                <div className="adm-insight__t">Direct bookings lead the channel mix</div>
                <div className="adm-insight__b">42% of bookings come through the direct website, reducing OTA commission costs. Doubling down on loyalty perks can grow this share further.</div>
              </div>
            </div>
            <div className="adm-insight">
              <span className="adm-insight__icon"><FaLightbulb /></span>
              <div>
                <div className="adm-insight__t">Presidential suites run near-full</div>
                <div className="adm-insight__b">Presidential and Premium room types post the highest occupancy ratios — a clear signal to expand high-tier inventory and bundle exclusive experiences.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
