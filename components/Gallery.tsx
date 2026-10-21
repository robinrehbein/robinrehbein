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
  const [announce, setAnnounce] = useState(false);
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
  const controls = ready && overflow;
  return (
    <div className={`gallery ${compact ? "gallery-compact" : ""}`} role="group" aria-label={`${title} gallery`}>
      {(!compact || controls) && <div className="gallery-heading">
        {!compact && <span className="eyebrow">A closer look</span>}
        {controls && <div className="gallery-controls">
          <button type="button" className="icon-button" aria-label={`Previous ${title} image`} aria-controls={id} aria-disabled={active === 0} onClick={() => { if (active > 0) { setAnnounce(true); move(-1); } }}>←</button>
          <span className="gallery-count" aria-hidden="true">{active + 1} / {images.length}</span>
          <button type="button" className="icon-button" aria-label={`Next ${title} image`} aria-controls={id} aria-disabled={active === images.length - 1} onClick={() => { if (active < images.length - 1) { setAnnounce(true); move(1); } }}>→</button>
          {/* Only button presses are announced, not every scroll or tab through the strip. */}
          <span className="sr-only" aria-live="polite">{announce ? `Image ${active + 1} of ${images.length}` : ""}</span>
        </div>}
      </div>}
      <div ref={strip} id={id} className="strip" {...(controls ? { role: "region", tabIndex: 0, "aria-label": `${title} images` } : {})}>
        {images.map((image, i) => <a key={image} href={image} className="gallery-image" aria-label={`Open ${title} image ${i + 1}`} onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !dialog.current?.showModal) return;
          e.preventDefault(); opener.current = e.currentTarget; setZoom(i);
        }}><img src={image} {...sizeOf(image)} alt={`${title} — image ${i + 1}`} loading="lazy" className="photo print-shadow" /><span className="gallery-zoom" aria-hidden="true">↗</span></a>)}
      </div>
      {/* The body fills the dialog, so only a click on the backdrop itself closes it. */}
      <dialog ref={dialog} className="image-dialog" aria-label={`${title} image viewer`} onClose={closed} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => {
        if (zoom === null) return;
        if (e.key === "ArrowRight") { e.preventDefault(); setZoom(Math.min(images.length - 1, zoom + 1)); }
        if (e.key === "ArrowLeft") { e.preventDefault(); setZoom(Math.max(0, zoom - 1)); }
      }}>
        <div className="image-dialog-body">
          <div className="dialog-toolbar">
            <span aria-live="polite">{title} · {(zoom ?? 0) + 1} / {images.length}</span>
            <button type="button" className="text-button" onClick={() => dialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button>
          </div>
          {zoom !== null && <img src={images[zoom]} alt={`${title} — image ${zoom + 1} of ${images.length}`} />}
          <div className="dialog-pagination">
            <button type="button" className="text-button" aria-disabled={zoom === 0} onClick={() => setZoom(Math.max(0, (zoom ?? 0) - 1))}><span aria-hidden="true">←</span> Previous</button>
            <button type="button" className="text-button" aria-disabled={zoom === images.length - 1} onClick={() => setZoom(Math.min(images.length - 1, (zoom ?? 0) + 1))}>Next <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
