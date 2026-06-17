# 👑 Royal Hotels — Luxury Hotel Booking Platform

A world-class, production-ready luxury 5-star hotel booking website built with **React + Vite**.
Dark premium theme · gold accents · glassmorphism · smooth animations · fully responsive.

> Timeless Luxury, Redefined.

---

## ✨ Features

### Guest experience
- **Home** — full-screen ken-burns hero, live availability search bar, featured rooms, highlights, guest reviews, awards, CTA.
- **Rooms & Suites** — 20 rooms across 6 categories (Deluxe, Executive, Premium, Family, Honeymoon, Presidential) with **search, category filters, price slider, availability toggle, and sorting**.
- **Room Details** — image gallery, quick facts, amenities, room policies, reviews, similar rooms, and a **sticky live-pricing booking widget**.
- **Booking → Payment → Confirmation** flow — date/guest selection, add-ons, tax & service calculation, 6 payment methods (**UPI, Credit Card, Debit Card, Net Banking, Wallet, Pay at Hotel**) with a realistic live card preview, and an animated confirmation voucher.
- **Dining** — restaurants, filterable menu, reservation form.
- **Gallery** — filterable masonry grid with a lightbox.
- **About**, **Contact** (map + form + socials), **Reviews & Testimonials** (rating breakdown + write-a-review).
- **Account** — authentication (sign in / sign up), user profile + loyalty card, booking history (with cancellation), and wishlist.

### Advanced features
- 🔍 Room filtering & search · ❤️ Wishlist/Favorites · 🌗 Dark / Light mode
- 🔔 Notifications · 🤖 AI concierge chatbot ("Aria") · 🟢 Live room availability
- 🔐 Auth system + user profile · 🧾 Booking history (persisted)
- 📊 **Admin Dashboard** — manage rooms, bookings & customers; revenue / occupancy / booking analytics with **Recharts**; responsive sidebar navigation.

---

## 🛠 Tech Stack
- **React 19** + **Vite 8**
- **React Router v7** (incl. lazy-loaded admin routes / code-splitting)
- **Recharts** (analytics) · **React Icons**
- Context API + `localStorage` for state (theme, auth, bookings, wishlist, notifications)
- Pure CSS design system (CSS variables, glassmorphism, scroll-reveal animations) — no UI framework

---

## 🚀 Getting Started

```bash
npm install
npm run dev        # start dev server → http://localhost:5173
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # lint
```

### 🔑 Demo logins
- **Guest:** sign in with *any* email + password.
- **Admin dashboard:** sign in with an email starting with **`admin@`** (e.g. `admin@royalhotels.com`) → you'll be routed to `/admin`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/      Navbar, Footer, PublicLayout, AdminLayout, PageHero
│   ├── ui/          RoomCard, Stars, AmenityIcon
│   ├── home/        SearchBar
│   └── common/      Chatbot, Toasts, ScrollToTop
├── context/         Theme, Auth, Booking, Wishlist, Notification providers
├── data/            rooms, hotel, reviews, gallery, menu, admin, images (dummy backend)
├── hooks/           useLocalStorage, useReveal
├── pages/           Home, Rooms, RoomDetails, Booking, Payment, Confirmation,
│   │                About, Gallery, Restaurant, Contact, Reviews,
│   │                Login, Profile, BookingHistory, Wishlist, NotFound
│   └── admin/       Dashboard, ManageRooms, ManageBookings, ManageCustomers, Analytics
├── App.jsx          routes
├── main.jsx         providers + router
└── index.css        global design system
```

---

## 🔌 Backend-ready
All content lives in `src/data/*` as plain modules and is consumed through context hooks, so swapping the dummy data for a real API only requires changing the data layer — components stay untouched.

## 📝 Notes
- Imagery is served from Unsplash (`u(id, w)` in `src/data/images.js`) and requires network access to display.
- Bookings, wishlist, theme and auth persist in `localStorage`.
