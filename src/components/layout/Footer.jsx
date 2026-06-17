import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCrown, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane,
} from "react-icons/fa";
import { hotel } from "../../data/hotel.js";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./Footer.css";

const SOCIAL_ICON = { instagram: FaInstagram, facebook: FaFacebookF, twitter: FaTwitter, linkedin: FaLinkedinIn, youtube: FaYoutube };

export default function Footer() {
  const [email, setEmail] = useState("");
  const { notify } = useNotify();

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    notify("Subscribed!", "success", "You'll receive our finest offers.");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <FaCrown /> ROYAL<span className="gold-text"> HOTELS</span>
          </Link>
          <p className="footer__tag serif">
            A world-class collection of five-star resorts where timeless luxury meets unforgettable service.
          </p>
          <div className="footer__socials">
            {hotel.socials.map((s) => {
              const Icon = SOCIAL_ICON[s.icon];
              return (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="footer__social">
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/rooms">Rooms & Suites</Link>
          <Link to="/restaurant">Fine Dining</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/reviews">Guest Reviews</Link>
          <Link to="/about">Our Story</Link>
        </div>

        <div className="footer__col">
          <h4>Guest Services</h4>
          <Link to="/booking">Reservations</Link>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/contact">Concierge</Link>
          <Link to="/contact">Events & Weddings</Link>
          <Link to="/profile">Loyalty Programme</Link>
        </div>

        <div className="footer__col footer__contact">
          <h4>Get in Touch</h4>
          <a href={`tel:${hotel.phone.replace(/\s/g, "")}`}><FaPhoneAlt /> {hotel.phone}</a>
          <a href={`mailto:${hotel.email}`}><FaEnvelope /> {hotel.email}</a>
          <span><FaMapMarkerAlt /> {hotel.address}</span>

          <form className="footer__news" onSubmit={subscribe}>
            <input
              type="email"
              placeholder="Your email for exclusive offers"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-gold" aria-label="Subscribe"><FaPaperPlane /></button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {hotel.established}–2026 {hotel.name}. All rights reserved.</p>
          <div className="footer__legal">
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms of Service</Link>
            <Link to="/contact">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
