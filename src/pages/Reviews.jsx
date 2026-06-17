import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaRegStar } from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import Stars from "../components/ui/Stars.jsx";
import { reviews, ratingBreakdown } from "../data/reviews.js";
import { heroes, u } from "../data/images.js";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Reviews.css";

const EMPTY = { name: "", text: "" };

export default function Reviews() {
  const { notify } = useNotify();
  const [form, setForm] = useState(EMPTY);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  useReveal("reviews");

  const submit = (e) => {
    e.preventDefault();
    notify("Thank you for your review", "success", "Your feedback has been submitted");
    setForm(EMPTY);
    setRating(5);
  };

  return (
    <div>
      <PageHero
        image={u(heroes[1], 1600)}
        eyebrow="Guest Voices"
        title="Reviews & Testimonials"
        subtitle="Nearly a century of stories from the guests who call Royal Hotels home."
        crumbs={[{ label: "Home", to: "/" }, { label: "Reviews" }]}
      />

      {/* Rating overview */}
      <section className="section container">
        <div className="rv-overview glass reveal">
          <div className="rv-overview__score">
            <span className="rv-overview__big gold-text">{ratingBreakdown.overall}</span>
            <Stars value={ratingBreakdown.overall} size="1.2rem" />
            <p className="text-dim">{ratingBreakdown.total.toLocaleString()} verified reviews</p>
          </div>

          <div className="rv-overview__dist">
            {ratingBreakdown.distribution.map((d) => (
              <div className="rv-bar" key={d.stars}>
                <span className="rv-bar__label">{d.stars} <FaStar /></span>
                <span className="rv-bar__track">
                  <span className="rv-bar__fill" style={{ width: `${d.percent}%` }} />
                </span>
                <span className="rv-bar__pct">{d.percent}%</span>
              </div>
            ))}
          </div>

          <div className="rv-overview__cats">
            {ratingBreakdown.categories.map((c) => (
              <div className="rv-cat" key={c.label}>
                <div className="rv-cat__head">
                  <span>{c.label}</span>
                  <span className="gold-text">{c.score.toFixed(1)}</span>
                </div>
                <span className="rv-cat__track">
                  <span className="rv-cat__fill" style={{ width: `${(c.score / 5) * 100}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="section container">
        <div className="section-head">
          <span className="eyebrow">What Guests Say</span>
          <h2 className="display">Stories Worth Sharing</h2>
        </div>
        <div className="grid grid-3">
          {reviews.map((r) => (
            <article className="rv-card reveal" key={r.id}>
              <div className="rv-card__photo">
                <img src={r.photo} alt={`Stay of ${r.name}`} loading="lazy" />
                <span className="rv-card__room">{r.room}</span>
              </div>
              <div className="rv-card__body">
                <div className="rv-card__head">
                  <img className="rv-card__avatar" src={r.avatar} alt={r.name} loading="lazy" />
                  <div>
                    <h3 className="serif">{r.name}</h3>
                    <p className="rv-card__loc"><FaMapMarkerAlt /> {r.location}</p>
                  </div>
                </div>
                <div className="rv-card__meta">
                  <Stars value={r.rating} />
                  <span className="rv-card__date">{r.date}</span>
                </div>
                <p className="rv-card__text">{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Share form */}
      <section className="section container">
        <div className="rv-share glass reveal">
          <span className="eyebrow">Share Your Experience</span>
          <h2 className="serif">Tell Us About Your Stay</h2>
          <form className="rv-share__form" onSubmit={submit}>
            <div className="field">
              <label>Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label>Your Rating</label>
              <div className="rv-rating-picker" role="radiogroup" aria-label="Select a rating">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = (hover || rating) >= n;
                  return (
                    <button
                      type="button"
                      key={n}
                      className={`rv-rating-star ${filled ? "on" : ""}`}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={rating === n}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                    >
                      {filled ? <FaStar /> : <FaRegStar />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="field">
              <label>Your Review</label>
              <textarea
                rows={4}
                required
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Share the details of your stay…"
              />
            </div>
            <button type="submit" className="btn btn-gold btn-block">Submit Review</button>
          </form>
        </div>
      </section>
    </div>
  );
}
