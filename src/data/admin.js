import { u } from "./images.js";

// ---------- KPI cards ----------
export const kpis = [
  { label: "Total Revenue", value: "₹4.82 Cr", delta: "+12.4%", up: true, sub: "vs last quarter" },
  { label: "Occupancy Rate", value: "87.3%", delta: "+4.1%", up: true, sub: "this month" },
  { label: "Total Bookings", value: "1,946", delta: "+8.7%", up: true, sub: "this month" },
  { label: "Avg. Daily Rate", value: "₹24,780", delta: "-1.2%", up: false, sub: "vs last month" },
];

// ---------- Revenue & occupancy (12 months) ----------
export const monthlyData = [
  { month: "Jul", revenue: 3.1, occupancy: 72, bookings: 1420 },
  { month: "Aug", revenue: 3.4, occupancy: 76, bookings: 1530 },
  { month: "Sep", revenue: 3.0, occupancy: 70, bookings: 1380 },
  { month: "Oct", revenue: 3.8, occupancy: 81, bookings: 1640 },
  { month: "Nov", revenue: 4.2, occupancy: 85, bookings: 1780 },
  { month: "Dec", revenue: 5.6, occupancy: 94, bookings: 2210 },
  { month: "Jan", revenue: 4.9, occupancy: 89, bookings: 1980 },
  { month: "Feb", revenue: 4.3, occupancy: 84, bookings: 1810 },
  { month: "Mar", revenue: 4.0, occupancy: 80, bookings: 1700 },
  { month: "Apr", revenue: 4.4, occupancy: 83, bookings: 1760 },
  { month: "May", revenue: 4.7, occupancy: 86, bookings: 1890 },
  { month: "Jun", revenue: 4.82, occupancy: 87, bookings: 1946 },
];

// ---------- Revenue by room category ----------
export const revenueByCategory = [
  { name: "Deluxe", value: 28 },
  { name: "Executive", value: 22 },
  { name: "Premium", value: 24 },
  { name: "Family", value: 12 },
  { name: "Honeymoon", value: 8 },
  { name: "Presidential", value: 6 },
];

// ---------- Booking sources ----------
export const bookingSources = [
  { name: "Direct Website", value: 42 },
  { name: "OTA Partners", value: 31 },
  { name: "Travel Agents", value: 17 },
  { name: "Corporate", value: 10 },
];

export const PIE_COLORS = ["#d4af37", "#e8c874", "#b8860b", "#8a6d1f", "#c9a14a", "#f0d98a"];

// ---------- Recent bookings ----------
const STATUS = ["Confirmed", "Checked In", "Pending", "Checked Out", "Cancelled"];
export const bookings = [
  { id: "RH-90412", guest: "Priya Nair", room: "Honeymoon Pool Villa", checkIn: "2026-06-18", checkOut: "2026-06-22", nights: 4, amount: 186000, status: "Confirmed" },
  { id: "RH-90411", guest: "James Whitfield", room: "Royal Presidential Suite", checkIn: "2026-06-16", checkOut: "2026-06-19", nights: 3, amount: 285000, status: "Checked In" },
  { id: "RH-90410", guest: "Aisha Khan", room: "Premium Ocean Suite", checkIn: "2026-06-20", checkOut: "2026-06-24", nights: 4, amount: 118000, status: "Confirmed" },
  { id: "RH-90409", guest: "Rajesh Iyer", room: "Royal Family Suite", checkIn: "2026-06-15", checkOut: "2026-06-18", nights: 3, amount: 115500, status: "Checked Out" },
  { id: "RH-90408", guest: "Sophie Laurent", room: "Executive Skyline Room", checkIn: "2026-06-19", checkOut: "2026-06-21", nights: 2, amount: 43000, status: "Pending" },
  { id: "RH-90407", guest: "Daniel Okafor", room: "Premium Spa Suite", checkIn: "2026-06-22", checkOut: "2026-06-26", nights: 4, amount: 124000, status: "Confirmed" },
  { id: "RH-90406", guest: "Mei Lin", room: "Deluxe Garden Room", checkIn: "2026-06-14", checkOut: "2026-06-16", nights: 2, amount: 29000, status: "Cancelled" },
  { id: "RH-90405", guest: "Carlos Mendez", room: "Imperial Presidential Suite", checkIn: "2026-06-25", checkOut: "2026-06-28", nights: 3, amount: 264000, status: "Confirmed" },
  { id: "RH-90404", guest: "Fatima Al-Sayed", room: "Romance Sky Suite", checkIn: "2026-06-17", checkOut: "2026-06-20", nights: 3, amount: 123000, status: "Checked In" },
  { id: "RH-90403", guest: "Arjun Kapoor", room: "Executive Corner Room", checkIn: "2026-06-21", checkOut: "2026-06-23", nights: 2, amount: 45600, status: "Pending" },
];
export const BOOKING_STATUSES = STATUS;

// ---------- Customers ----------
export const customers = [
  { id: "C-1042", name: "Priya Nair", email: "priya.nair@email.com", tier: "Platinum", stays: 14, spend: 1820000, location: "Bengaluru", avatar: u("1494790108377-be9c29b29330", 200) },
  { id: "C-1041", name: "James Whitfield", email: "j.whitfield@email.com", tier: "Diamond", stays: 31, spend: 4950000, location: "London", avatar: u("1500648767791-00dcc994a43e", 200) },
  { id: "C-1040", name: "Aisha Khan", email: "aisha.k@email.com", tier: "Gold", stays: 8, spend: 740000, location: "Dubai", avatar: u("1438761681033-6461ffad8d80", 200) },
  { id: "C-1039", name: "Rajesh Iyer", email: "rajesh.iyer@email.com", tier: "Gold", stays: 6, spend: 612000, location: "Chennai", avatar: u("1507003211169-0a1dd7228f2d", 200) },
  { id: "C-1038", name: "Sophie Laurent", email: "sophie.l@email.com", tier: "Silver", stays: 4, spend: 286000, location: "Paris", avatar: u("1534528741775-53994a69daeb", 200) },
  { id: "C-1037", name: "Daniel Okafor", email: "d.okafor@email.com", tier: "Platinum", stays: 12, spend: 1540000, location: "Lagos", avatar: u("1506794778202-cad84cf45f1d", 200) },
  { id: "C-1036", name: "Carlos Mendez", email: "carlos.m@email.com", tier: "Diamond", stays: 22, spend: 3870000, location: "Madrid", avatar: u("1539571696357-5a69c17a67c6", 200) },
  { id: "C-1035", name: "Fatima Al-Sayed", email: "fatima.s@email.com", tier: "Gold", stays: 9, spend: 905000, location: "Doha", avatar: u("1517841905240-472988babdf9", 200) },
];

export const occupancyByType = [
  { type: "Deluxe", occupied: 14, total: 18 },
  { type: "Executive", occupied: 13, total: 16 },
  { type: "Premium", occupied: 12, total: 14 },
  { type: "Family", occupied: 6, total: 8 },
  { type: "Honeymoon", occupied: 5, total: 6 },
  { type: "Presidential", occupied: 2, total: 2 },
];
