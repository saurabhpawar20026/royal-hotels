import { useMemo, useState } from "react";
import { FaClock, FaUtensils } from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { restaurants, menuCategories, menuItems } from "../data/menu.js";
import { formatINR } from "../data/rooms.js";
import { heroes, u } from "../data/images.js";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Restaurant.css";

const EMPTY_RES = { name: "", phone: "", email: "", date: "", time: "", party: "2", requests: "" };

export default function Restaurant() {
  const { notify } = useNotify();
  const [activeCat, setActiveCat] = useState(menuCategories[0]);
  const [res, setRes] = useState(EMPTY_RES);

  const items = useMemo(() => menuItems.filter((m) => m.category === activeCat), [activeCat]);

  useReveal(activeCat);

  const set = (k) => (e) => setRes((r) => ({ ...r, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    notify("Reservation requested", "success", "We'll confirm shortly");
    setRes(EMPTY_RES);
  };

  return (
    <div>
      <PageHero
        image={u(heroes[3], 1600)}
        eyebrow="Culinary Artistry"
        title="Fine Dining"
        subtitle="Seven kitchens, one obsession — turning every meal into a memory worth savouring."
        crumbs={[{ label: "Home", to: "/" }, { label: "Dining" }]}
      />

      {/* Our Restaurants */}
      <section className="section container">
        <div className="section-head">
          <span className="eyebrow">Where to Dine</span>
          <h2 className="display">Our Restaurants</h2>
          <p className="lead">From sunlit coastal seafood to candle-lit French haute cuisine.</p>
        </div>
        <div className="grid grid-3">
          {restaurants.map((r) => (
            <article className="dine-card reveal" key={r.name}>
              <div className="dine-card__media">
                <img src={r.img} alt={r.name} loading="lazy" />
              </div>
              <div className="dine-card__body">
                <h3 className="serif">{r.name}</h3>
                <p className="dine-card__cuisine">{r.cuisine}</p>
                <p className="dine-card__hours"><FaClock /> {r.hours}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="section container dine-menu">
        <div className="section-head">
          <span className="eyebrow">The Menu</span>
          <h2 className="display">A Taste of Royalty</h2>
        </div>

        <div className="dine-tabs" role="tablist" aria-label="Menu categories">
          {menuCategories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={activeCat === c}
              className={`dine-tab ${activeCat === c ? "on" : ""}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-3 dine-menu__grid">
          {items.map((m) => (
            <article className="menu-card reveal" key={m.id}>
              <div className="menu-card__media">
                <img src={m.img} alt={m.name} loading="lazy" />
                {m.tag && <span className="menu-card__tag">{m.tag}</span>}
              </div>
              <div className="menu-card__body">
                <div className="menu-card__top">
                  <span
                    className={`veg-dot ${m.veg ? "veg" : "nonveg"}`}
                    aria-label={m.veg ? "Vegetarian" : "Non-vegetarian"}
                  />
                  <h3 className="serif">{m.name}</h3>
                  <span className="menu-card__price gold-text">{formatINR(m.price)}</span>
                </div>
                <p className="menu-card__desc text-dim">{m.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reservation */}
      <section className="section container">
        <div className="dine-reserve glass reveal">
          <div className="dine-reserve__intro">
            <span className="eyebrow">Reserve a Table</span>
            <h2 className="serif">Book Your Experience</h2>
            <p className="text-dim">
              <FaUtensils /> Let our team craft an unforgettable evening tailored to you.
            </p>
          </div>
          <form className="dine-reserve__form" onSubmit={submit}>
            <div className="field">
              <label>Full Name</label>
              <input type="text" required value={res.name} onChange={set("name")} placeholder="Your name" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input type="tel" required value={res.phone} onChange={set("phone")} placeholder="+91 …" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={res.email} onChange={set("email")} placeholder="you@email.com" />
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" required value={res.date} onChange={set("date")} />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" required value={res.time} onChange={set("time")} />
            </div>
            <div className="field">
              <label>Party Size</label>
              <select value={res.party} onChange={set("party")}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                ))}
              </select>
            </div>
            <div className="field dine-reserve__full">
              <label>Special Requests</label>
              <textarea rows={3} value={res.requests} onChange={set("requests")} placeholder="Allergies, celebrations, seating preferences…" />
            </div>
            <button type="submit" className="btn btn-gold btn-block dine-reserve__full">Request Reservation</button>
          </form>
        </div>
      </section>
    </div>
  );
}
