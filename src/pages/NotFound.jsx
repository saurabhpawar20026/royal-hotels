import { Link } from "react-router-dom";
import { heroes, u } from "../data/images.js";

export default function NotFound() {
  return (
    <section
      className="page-hero"
      style={{ backgroundImage: `url(${u(heroes[0], 1600)})`, minHeight: "100vh", alignItems: "center", textAlign: "center" }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
        <span className="eyebrow">Error 404</span>
        <h1 className="display" style={{ fontSize: "clamp(4rem, 14vw, 9rem)" }}>404</h1>
        <p className="lead" style={{ maxWidth: 520 }}>
          The page you are seeking has checked out. Allow us to escort you back to comfort.
        </p>
        <div className="flex gap-2 wrap" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn-gold btn-lg">Return Home</Link>
          <Link to="/rooms" className="btn btn-outline btn-lg">Explore Rooms</Link>
        </div>
      </div>
    </section>
  );
}
