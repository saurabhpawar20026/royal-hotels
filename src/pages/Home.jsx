import { Link } from "react-router-dom";
import {
  FaSpa, FaUtensils, FaSwimmingPool, FaConciergeBell, FaCar, FaGlassCheers,
  FaArrowRight, FaQuoteLeft, FaTrophy, FaChevronRight,
} from "react-icons/fa";
import SearchBar from "../components/home/SearchBar.jsx";
import RoomCard from "../components/ui/RoomCard.jsx";
import Stars from "../components/ui/Stars.jsx";
import { featuredRooms } from "../data/rooms.js";
import { highlights, stats, awards, story, hotel } from "../data/hotel.js";
import { reviews } from "../data/reviews.js";
import { heroes, u } from "../data/images.js";
import { useReveal } from "../hooks/useReveal.js";
import "./Home.css";

const HL_ICON = { spa: FaSpa, dining: FaUtensils, pool: FaSwimmingPool, concierge: FaConciergeBell, car: FaCar, events: FaGlassCheers };

export default function Home() {
  useReveal("home");
  const topReviews = reviews.slice(0, 3);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${u(heroes[0], 1920)})` }} />
        <div className="hero__overlay" />
        <div className="container hero__inner">
          <span className="eyebrow hero__eyebrow">Est. {hotel.established} · {hotel.address.split(",").slice(-2, -1)[0].trim()}</span>
          <h1 className="display hero__title">
            Where Every Stay<br /> Becomes a <span className="gold-text">Royal Legacy</span>
          </h1>
          <p className="lead hero__sub">
            A world-class collection of five-star resorts. Indulge in timeless elegance,
            Michelin dining and service crafted around your every desire.
          </p>
          <div className="hero__cta">
            <Link to="/rooms" className="btn btn-gold btn-lg">Discover Rooms <FaArrowRight /></Link>
            <Link to="/about" className="btn btn-outline btn-lg">Our Story</Link>
          </div>
        </div>

        <div className="container hero__search">
          <SearchBar />
        </div>
        <div className="hero__scroll">Scroll to explore</div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="stats-strip">
        <div className="container stats-strip__grid">
          {stats.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="stat__value gold-text">{s.value}{s.suffix}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- HIGHLIGHTS ---------- */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="eyebrow">The Royal Difference</span>
          <h2>Curated Experiences, <span className="gold-text">Effortlessly Yours</span></h2>
          <p className="lead">Every detail is orchestrated so you may simply arrive, exhale, and indulge.</p>
        </div>
        <div className="grid grid-3">
          {highlights.map((h, i) => {
            const Icon = HL_ICON[h.icon] || FaConciergeBell;
            return (
              <div className="highlight card reveal" key={h.title} style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="highlight__icon"><Icon /></span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- FEATURED ROOMS ---------- */}
      <section className="section container">
        <div className="section-head left reveal" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "100%", flexWrap: "wrap", gap: "1rem" }}>
          <div className="flex-col gap-1">
            <span className="eyebrow">Handpicked For You</span>
            <h2>Featured Rooms &amp; Suites</h2>
          </div>
          <Link to="/rooms" className="btn btn-outline">View All Rooms <FaChevronRight /></Link>
        </div>
        <div className="grid grid-3">
          {featuredRooms.slice(0, 6).map((r) => (
            <div className="reveal" key={r.id}><RoomCard room={r} /></div>
          ))}
        </div>
      </section>

      {/* ---------- EXPERIENCE / STORY ---------- */}
      <section className="section">
        <div className="container experience">
          <div className="experience__media reveal">
            <img src={story.image} alt="Royal Hotels heritage" loading="lazy" />
            <div className="experience__badge glass">
              <span className="gold-text">{2026 - hotel.established}</span>
              <small>Years of<br />Excellence</small>
            </div>
          </div>
          <div className="experience__text reveal">
            <span className="eyebrow">The Luxury Experience</span>
            <h2>{story.heading}</h2>
            {story.paragraphs.slice(0, 2).map((p, i) => <p key={i} className="text-dim">{p}</p>)}
            <ul className="experience__list">
              <li><FaConciergeBell /> Personal butler &amp; 24-hour in-room dining</li>
              <li><FaSpa /> Award-winning spa &amp; wellness sanctuary</li>
              <li><FaUtensils /> Seven restaurants led by celebrated chefs</li>
            </ul>
            <Link to="/about" className="btn btn-gold">Explore Our Legacy <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="section reviews-sec">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Cherished Memories</span>
            <h2>What Our Guests Say</h2>
            <div className="flex items-center gap-2" style={{ justifyContent: "center" }}>
              <Stars value={4.9} size="1.3rem" />
              <span className="text-dim">4.9 / 5 · from 3,284 verified guests</span>
            </div>
          </div>
          <div className="grid grid-3">
            {topReviews.map((r) => (
              <figure className="review-card glass reveal" key={r.id}>
                <FaQuoteLeft className="review-card__quote" />
                <Stars value={r.rating} />
                <blockquote>"{r.text}"</blockquote>
                <figcaption>
                  <img src={r.avatar} alt={r.name} loading="lazy" />
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.location} · {r.room}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/reviews" className="btn btn-outline">Read All Reviews <FaChevronRight /></Link>
          </div>
        </div>
      </section>

      {/* ---------- AWARDS ---------- */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="eyebrow">Globally Celebrated</span>
          <h2>Awards &amp; Achievements</h2>
          <p className="lead">Recognised by the world's most discerning travel authorities.</p>
        </div>
        <div className="grid grid-3">
          {awards.map((a, i) => (
            <div className="award card reveal" key={i} style={{ transitionDelay: `${i * 50}ms` }}>
              <FaTrophy className="award__icon" />
              <div className="award__year">{a.year}</div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta-banner">
        <div className="cta-banner__bg" style={{ backgroundImage: `url(${u(heroes[3], 1600)})` }} />
        <div className="container cta-banner__inner reveal">
          <span className="eyebrow">Your Escape Awaits</span>
          <h2>Reserve Your Royal Retreat Today</h2>
          <p className="lead">Enjoy exclusive rates, complimentary upgrades and unforgettable moments.</p>
          <div className="flex gap-2 wrap" style={{ justifyContent: "center" }}>
            <Link to="/rooms" className="btn btn-gold btn-lg">Book Your Stay</Link>
            <a href={`tel:${hotel.phone.replace(/\s/g, "")}`} className="btn btn-outline btn-lg">Call {hotel.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
