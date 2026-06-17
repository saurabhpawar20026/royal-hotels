import {
  FaCrown,
  FaGem,
  FaConciergeBell,
  FaSpa,
  FaUtensils,
  FaCar,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHero from "../components/layout/PageHero.jsx";
import { stats, story, team, awards } from "../data/hotel.js";
import { heroes, u } from "../data/images.js";
import { useReveal } from "../hooks/useReveal.js";
import "./About.css";

const experiences = [
  {
    icon: <FaSpa />,
    title: "Royal Spa & Wellness",
    text: "A 12,000 sq.ft sanctuary of Ayurvedic rituals, hydrotherapy pools and master therapists devoted to your renewal.",
  },
  {
    icon: <FaUtensils />,
    title: "Michelin-Starred Dining",
    text: "Seven restaurants and bars led by world-renowned chefs, from coastal seafood to refined French gastronomy.",
  },
  {
    icon: <FaConciergeBell />,
    title: "24-Hour Butler Service",
    text: "Anticipatory, discreet and deeply personal — your dedicated butler orchestrates every detail of your stay.",
  },
  {
    icon: <FaCar />,
    title: "Chauffeured Fleet",
    text: "A fleet of Rolls-Royce and Mercedes-Maybach awaits, for seamless airport transfers and city excursions.",
  },
];

const values = [
  {
    icon: <FaCrown />,
    title: "Heritage",
    text: "Nearly a century of grace, tradition and storied hospitality woven into every corridor and courtyard.",
  },
  {
    icon: <FaGem />,
    title: "Craftsmanship",
    text: "From hand-finished interiors to plated artistry, every detail is the work of devoted master artisans.",
  },
  {
    icon: <FaConciergeBell />,
    title: "Personal Service",
    text: "Intuitive, unhurried and genuinely warm — service that anticipates desires before they are spoken.",
  },
];

export default function About() {
  useReveal("about");

  return (
    <div>
      <PageHero
        image={u(heroes[1], 1600)}
        eyebrow="Our Heritage"
        title="The Royal Story"
        subtitle="Nearly a century of timeless luxury, refined for every generation that walks through our doors."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section container">
        <div className="about-story reveal">
          <div className="about-story__media">
            <img src={story.image} alt={story.heading} loading="lazy" />
            <span className="about-story__badge glass">
              <FaCrown />
              <strong>Since 1928</strong>
            </span>
          </div>
          <div className="about-story__body">
            <span className="eyebrow">Our Journey</span>
            <h2 className="serif">{story.heading}</h2>
            <span className="divider-gold" />
            {story.paragraphs.map((p, i) => (
              <p key={i} className="text-dim">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="about-stats reveal">
        <div className="container">
          <div className="about-stats__grid">
            {stats.map((s, i) => (
              <div className="about-stat" key={i}>
                <span className="about-stat__value gold-text">
                  {s.value}
                  <em>{s.suffix}</em>
                </span>
                <span className="about-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury experience */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="eyebrow">Signature Indulgence</span>
          <h2 className="serif">The Luxury Experience</h2>
          <p className="lead">
            Every stay is composed of small perfections — a constellation of services crafted to surprise and delight.
          </p>
        </div>
        <div className="grid grid-4 about-exp">
          {experiences.map((e, i) => (
            <article className="about-exp__card glass reveal" key={i}>
              <span className="about-exp__icon">{e.icon}</span>
              <h3 className="serif">{e.title}</h3>
              <p className="text-dim">{e.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values reveal">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Stand For</span>
            <h2 className="serif">Our Values</h2>
          </div>
          <div className="grid grid-3 about-values__grid">
            {values.map((v, i) => (
              <article className="about-value reveal" key={i}>
                <span className="about-value__icon">{v.icon}</span>
                <h3 className="serif">{v.title}</h3>
                <p className="text-dim">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section container">
        <div className="section-head reveal">
          <span className="eyebrow">The People</span>
          <h2 className="serif">Meet Our Team</h2>
          <p className="lead">
            Behind every flawless moment stands a team of devoted custodians of the Royal experience.
          </p>
        </div>
        <div className="grid grid-4 about-team">
          {team.map((m, i) => (
            <article className="about-team__card reveal" key={i}>
              <div className="about-team__media">
                <img src={m.img} alt={m.name} loading="lazy" />
              </div>
              <div className="about-team__info">
                <h3 className="serif">{m.name}</h3>
                <span className="about-team__role">{m.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="about-awards reveal">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Recognition</span>
            <h2 className="serif">Awards & Accolades</h2>
          </div>
          <div className="grid grid-3 about-awards__grid">
            {awards.map((a, i) => (
              <article className="about-award glass reveal" key={i}>
                <span className="about-award__icon">
                  <FaTrophy />
                </span>
                <span className="about-award__year">{a.year}</span>
                <h3 className="serif">{a.title}</h3>
                <p className="text-dim">{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section container">
        <div className="about-cta reveal">
          <div className="about-cta__inner">
            <span className="eyebrow">Begin Your Story</span>
            <h2 className="serif">Your Royal Escape Awaits</h2>
            <p className="lead">
              Discover our collection of distinctive suites and sanctuaries, each a masterpiece of comfort and craft.
            </p>
            <Link to="/rooms" className="btn btn-gold btn-lg">
              Explore Rooms &amp; Suites <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
