import { useMemo, useState } from "react";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import PageHero from "../components/layout/PageHero.jsx";
import RoomCard from "../components/ui/RoomCard.jsx";
import { rooms, CATEGORIES, priceRange, formatINR } from "../data/rooms.js";
import { heroes, u } from "../data/images.js";
import { useReveal } from "../hooks/useReveal.js";
import "./Rooms.css";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "size", label: "Largest First" },
];

export default function Rooms() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = useMemo(() => {
    let list = rooms.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (r.price > maxPrice) return false;
      if (onlyAvailable && r.availableCount <= 0) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = (r.name + r.view + r.shortDesc + r.amenities.join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      size: (a, b) => b.size - a.size,
      featured: (a, b) => Number(b.featured) - Number(a.featured),
    };
    return [...list].sort(by[sort]);
  }, [query, cat, sort, maxPrice, onlyAvailable]);

  useReveal(`${cat}-${sort}-${query}-${maxPrice}-${onlyAvailable}`);

  const reset = () => { setQuery(""); setCat("all"); setSort("featured"); setMaxPrice(priceRange.max); setOnlyAvailable(false); };

  return (
    <div>
      <PageHero
        image={u(heroes[2], 1600)}
        eyebrow="Accommodations"
        title="Rooms & Suites"
        subtitle="Twenty distinctive sanctuaries, each a masterpiece of comfort and craft."
        crumbs={[{ label: "Home", to: "/" }, { label: "Rooms & Suites" }]}
      />

      <section className="section container">
        {/* Filter toolbar */}
        <div className="rooms-toolbar glass">
          <div className="rooms-search">
            <FaSearch />
            <input placeholder="Search rooms, views, amenities…" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button onClick={() => setQuery("")} aria-label="Clear"><FaTimes /></button>}
          </div>
          <div className="rooms-sort">
            <FaSlidersH />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort rooms">
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="rooms-controls">
          <div className="rooms-chips">
            <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>All Rooms</button>
            {CATEGORIES.map((c) => (
              <button key={c.key} className={`chip ${cat === c.key ? "on" : ""}`} onClick={() => setCat(c.key)}>{c.label}</button>
            ))}
          </div>
          <div className="rooms-extra">
            <label className="price-filter">
              <span>Max {formatINR(maxPrice)}</span>
              <input type="range" min={priceRange.min} max={priceRange.max} step="1000" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
            </label>
            <label className="avail-toggle">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
              <span>Available only</span>
            </label>
          </div>
        </div>

        <div className="rooms-meta">
          <p><strong>{filtered.length}</strong> room{filtered.length !== 1 ? "s" : ""} found</p>
          <button className="btn btn-ghost btn-sm" onClick={reset}>Reset Filters</button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-3">
            {filtered.map((r) => <div className="reveal" key={r.id}><RoomCard room={r} /></div>)}
          </div>
        ) : (
          <div className="rooms-empty glass">
            <h3>No rooms match your search</h3>
            <p className="text-dim">Try adjusting your filters or budget.</p>
            <button className="btn btn-gold" onClick={reset}>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
