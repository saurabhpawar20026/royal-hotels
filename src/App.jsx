import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import Toasts from "./components/common/Toasts.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Booking from "./pages/Booking.jsx";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Contact from "./pages/Contact.jsx";
import Reviews from "./pages/Reviews.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin pages — lazy-loaded so recharts stays out of the public bundle
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ManageRooms = lazy(() => import("./pages/admin/ManageRooms.jsx"));
const ManageBookings = lazy(() => import("./pages/admin/ManageBookings.jsx"));
const ManageCustomers = lazy(() => import("./pages/admin/ManageCustomers.jsx"));
const Analytics = lazy(() => import("./pages/admin/Analytics.jsx"));

const AdminFallback = () => (
  <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
    <div className="spinner" />
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toasts />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
          <Route path="rooms" element={<Suspense fallback={<AdminFallback />}><ManageRooms /></Suspense>} />
          <Route path="bookings" element={<Suspense fallback={<AdminFallback />}><ManageBookings /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<AdminFallback />}><ManageCustomers /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><Analytics /></Suspense>} />
        </Route>
      </Routes>
    </>
  );
}
