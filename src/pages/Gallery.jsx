import { useState, useMemo, useEffect, useCallback } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus } from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import { galleryCategories, galleryImages } from "../data/gallery.js";
import { heroes, u } from "../data/images.js";
import { useReveal } from "../hooks/useReveal.js";
import "./Gallery.css";

export default function Gallery() {
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null); // index within filtered list

  const filtered = useMemo(
    () => (cat === "All" ? galleryImages : galleryImages.filter((g) => g.category === cat)),
    [cat]
  );

  useReveal(cat);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  const current = active !== null ? filtered[active] : null;

  return (
    <div>
      <PageHero
        image={u(heroes[0], 1600)}
        eyebrow="Moments"
        title="Gallery"
        subtitle="A glimpse into the world of Royal Hotels — light, texture and timeless escape."
        crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />

      <section className="section container">
        {/* Filter chips */}
        <div className="gal-chips reveal">
          {galleryCategories.map((c) => (
            <button
              key={c}
              className={`gal-chip ${cat === c ? "on" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="gal-grid">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              className="gal-item reveal"
              onClick={() => setActive(i)}
              aria-label={`View ${img.title}`}
            >
              <img src={img.src} alt={img.title} loading="lazy" />
              <span className="gal-item__overlay">
                <FaSearchPlus className="gal-item__zoom" />
                <span className="gal-item__title">{img.title}</span>
                <span className="gal-item__cat">{img.category}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div className="gal-lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className="gal-lb__close" onClick={close} aria-label="Close gallery viewer">
            <FaTimes />
          </button>
          <button
            className="gal-lb__nav gal-lb__prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <figure className="gal-lb__figure glass" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.title} />
            <figcaption className="gal-lb__caption">
              <span className="gal-lb__cat">{current.category}</span>
              <h3 className="serif">{current.title}</h3>
              <span className="gal-lb__count">
                {active + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>

          <button
            className="gal-lb__nav gal-lb__next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
