import { useState } from "react";
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { hotel } from "../data/hotel.js";
import { heroes, u } from "../data/images.js";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Contact.css";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  twitter: FaTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { notify } = useNotify();
  const [form, setForm] = useState(EMPTY);

  useReveal("contact");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    notify("Message sent", "success", "Our team will get back to you shortly");
    setForm(EMPTY);
  };

  return (
    <div>
      <PageHero
        image={u(heroes[2], 1600)}
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Our concierge is available around the clock to craft your perfect stay."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      {/* Info cards */}
      <section className="section container">
        <div className="grid grid-3">
          <article className="contact-info reveal">
            <span className="contact-info__icon"><FaPhoneAlt /></span>
            <h3 className="serif">Call Us</h3>
            <a href={`tel:${hotel.phone.replace(/\s/g, "")}`}>{hotel.phone}</a>
            <a href={`tel:${hotel.phoneAlt.replace(/\s/g, "")}`}>{hotel.phoneAlt}</a>
          </article>
          <article className="contact-info reveal">
            <span className="contact-info__icon"><FaEnvelope /></span>
            <h3 className="serif">Email Us</h3>
            <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
          </article>
          <article className="contact-info reveal">
            <span className="contact-info__icon"><FaMapMarkerAlt /></span>
            <h3 className="serif">Visit Us</h3>
            <p className="text-dim">{hotel.address}</p>
          </article>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section container">
        <div className="contact-split">
          <div className="contact-form-wrap glass reveal">
            <span className="eyebrow">Send a Message</span>
            <h2 className="serif">We'd Love to Hear From You</h2>
            <form className="contact-form" onSubmit={submit}>
              <div className="field">
                <label>Full Name</label>
                <input type="text" required value={form.name} onChange={set("name")} placeholder="Your name" />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label>Subject</label>
                <input type="text" required value={form.subject} onChange={set("subject")} placeholder="How can we help?" />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={5} required value={form.message} onChange={set("message")} placeholder="Your message…" />
              </div>
              <button type="submit" className="btn btn-gold btn-block">Send Message</button>
            </form>
          </div>

          <div className="contact-map glass reveal">
            <iframe
              title="Royal Hotels location"
              src={hotel.mapEmbed}
              style={{ width: "100%", height: "100%", border: 0, borderRadius: "var(--radius)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Socials */}
        <div className="contact-socials reveal">
          <span className="eyebrow">Follow Our Journey</span>
          <div className="contact-socials__row">
            {hotel.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon];
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social"
                  aria-label={s.name}
                >
                  {Icon && <Icon />}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
