import { useEffect } from "react";

// Adds an `.in` class to every `.reveal` element as it scrolls into view.
// Re-scans on each route change via the `dep` argument.
export function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!els.length) return;

    // Fallback: if IntersectionObserver is unavailable, reveal everything.
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    // Immediately reveal anything already within (or near) the viewport on mount,
    // so above-the-fold content (e.g. payment options) is never left invisible.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.92) el.classList.add("in");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => { if (!el.classList.contains("in")) io.observe(el); });

    // Safety net: never leave content hidden — reveal any stragglers after 1.6s.
    const safety = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    }, 1600);

    return () => { io.disconnect(); clearTimeout(safety); };
  }, [dep]);
}
