import { useEffect, useId, useRef, useState } from "react";
import { galleryScrollTarget } from "@/lib/galleryNavigation.ts";
import { sizeOf } from "@/lib/imageSizes.ts";

/** Scroll remains available without JS; controls enhance it after hydration. */
export function Gallery({ images, title, compact = false }: { images: string[]; title: string; compact?: boolean }) {
  const strip = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const id = useId();
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    const node = strip.current;
    if (!node) return;
    function update() {
      if (!node) return;
      setOverflow(node.scrollWidth > node.clientWidth + 2);
      // Last image may not reach the left edge. Treat the scroll end as the final image.
      if (node.scrollLeft > 1 && node.scrollLeft + node.clientWidth >= node.scrollWidth - 2) {
        setActive(images.length - 1); return;
      }
      const left = node.getBoundingClientRect().left;
      let nearest = 0, distance = Infinity;
      Array.from(node.children).forEach((child, i) => {
        const d = Math.abs(child.getBoundingClientRect().left - left);
        if (d < distance) { distance = d; nearest = i; }
      });
      setActive(nearest);
    }
    node.addEventListener("scroll", update, { passive: true });
    node.addEventListener("load", update, true);
    const observer = new ResizeObserver(update);
    observer.observe(node); update();
    return () => { node.removeEventListener("scroll", update); node.removeEventListener("load", update, true); observer.disconnect(); };
  }, [images.length]);
  useEffect(() => {
    const node = dialog.current;
    if (zoom !== null && node && !node.open) node.showModal();
  }, [zoom]);

  function move(direction: -1 | 1) {
    const node = strip.current;
    if (!node) return;
    const left = node.getBoundingClientRect().left;
    const positions = Array.from(node.children).map(child => child.getBoundingClientRect().left - left + node.scrollLeft);
    node.scrollTo({ left: galleryScrollTarget(positions, node.scrollLeft, node.scrollWidth - node.clientWidth, direction),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function closed() { setZoom(null); opener.current?.focus(); }
  return (
    <div className={`gallery ${compact ? "gallery-compact" : ""}`} role="group" aria-label={`${title} images`}>
      <div className="gallery-heading">
        <span className="eyebrow">{compact ? "Screenshots" : "A closer look"}</span>
        {ready && overflow ? <div className="gallery-controls">
          <button type="button" className="icon-button" aria-label={`Previous ${title} image`} aria-controls={id} aria-disabled={active === 0} onClick={() => { if (active > 0) move(-1); }}>←</button>
          <span className="gallery-count" aria-live="polite" aria-atomic="true">{active + 1} / {images.length}</span>
          <button type="button" className="icon-button" aria-label={`Next ${title} image`} aria-controls={id} aria-disabled={active === images.length - 1} onClick={() => { if (active < images.length - 1) move(1); }}>→</button>
        </div> : <span className="gallery-count">{images.length} images</span>}
      </div>
      <div ref={strip} id={id} className="strip" tabIndex={0} aria-label={`${title} screenshot strip`}>
        {images.map((image, i) => <a key={image} href={image} className="gallery-image" aria-label={`Open ${title} image ${i + 1}`} onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !dialog.current?.showModal) return;
          e.preventDefault(); opener.current = e.currentTarget; setZoom(i);
        }}><img src={image} {...sizeOf(image)} alt={`${title} — screenshot ${i + 1}`} loading="lazy" className="photo print-shadow" /><span className="gallery-zoom" aria-hidden="true">↗</span></a>)}
      </div>
      <dialog ref={dialog} className="image-dialog" aria-label={`${title} image viewer`} onClose={closed} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => {
        if (zoom === null) return;
        if (e.key === "ArrowRight") { e.preventDefault(); setZoom(Math.min(images.length - 1, zoom + 1)); }
        if (e.key === "ArrowLeft") { e.preventDefault(); setZoom(Math.max(0, zoom - 1)); }
      }}>
        <div className="dialog-toolbar">
          <span>{title} · {(zoom ?? 0) + 1} / {images.length}</span>
          <button type="button" className="text-button" onClick={() => dialog.current?.close()} autoFocus>Close ×</button>
        </div>
        {zoom !== null && <img src={images[zoom]} alt={`${title} — screenshot ${zoom + 1}`} />}
        <div className="dialog-pagination">
          <button type="button" className="text-button" aria-disabled={zoom === 0} onClick={() => setZoom(Math.max(0, (zoom ?? 0) - 1))}>← Previous</button>
          <button type="button" className="text-button" aria-disabled={zoom === images.length - 1} onClick={() => setZoom(Math.min(images.length - 1, (zoom ?? 0) + 1))}>Next →</button>
        </div>
      </dialog>
    </div>
  );
}
