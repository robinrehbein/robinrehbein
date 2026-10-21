import { useEffect } from "react";
import { useLocation } from "react-router";

/** Content stays visible without JS; each block animates once when it enters view. */
export function ScrollReveals() {
  const { pathname } = useLocation();
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !window.IntersectionObserver) return;
    // Blocks already in view on the first callback stay as they are; only later arrivals animate.
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const first = !seen.has(entry.target);
      seen.add(entry.target);
      if (entry.isIntersecting) {
        if (!first) entry.target.classList.add("scroll-arrive");
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    document.querySelectorAll("[data-scroll-reveal]").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
