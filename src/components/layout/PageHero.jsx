import { Link } from "react-router-dom";

// Reusable sub-page hero banner with a background image + eyebrow + title.
export default function PageHero({ image, eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="page-hero__crumbs">
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                {i < crumbs.length - 1 && <span className="sep">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p className="lead" style={{ maxWidth: 640, marginTop: "0.6rem" }}>{subtitle}</p>}
      </div>
    </section>
  );
}
