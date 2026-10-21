import { useEffect, useRef } from "react";
import { sizeOf } from "@/lib/imageSizes.ts";
import { createHeroCloud, type HeroCloud } from "@/lib/heroCloud.ts";

export function HeroPortrait(props: { alt: string; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current, photo = photoRef.current;
    if (!stage || !canvas || !photo) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cloud: HeroCloud | null = null, generation = 0, disposed = false;
    let pending: AbortController | null = null;
    let seen = false;
    try { seen = sessionStorage.getItem("hero-seen") === "1"; } catch { /* Storage may be disabled. */ }
    function sync() {
      if (!stage || !canvas || !photo) return;
      const current = ++generation;
      pending?.abort(); pending = new AbortController();
      cloud?.destroy(); cloud = null;
      if (motion.matches || !window.WebGLRenderingContext) {
        photo.style.opacity = "1"; return;
      }
      const intro = !seen;
      if (intro) photo.style.opacity = "0";
      createHeroCloud(stage, canvas, photo, intro, pending.signal).then(c => {
        if (disposed || current !== generation) { c.destroy(); if (motion.matches) photo.style.opacity = "1"; }
        else { cloud = c; seen = true; try { sessionStorage.setItem("hero-seen", "1"); } catch { /* Optional enhancement. */ } }
      }).catch(() => { if (current === generation) photo.style.opacity = "1"; });
    }
    sync(); motion.addEventListener("change", sync);
    return () => { disposed = true; generation++; pending?.abort(); motion.removeEventListener("change", sync); cloud?.destroy(); };
  }, []);

  return (
    <div ref={stageRef} className={`hero-fx relative overflow-hidden bg-black ${props.className ?? ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <img
        ref={photoRef}
        src="/me_square.webp"
        {...sizeOf("/me_square.webp")}
        alt={props.alt}
        fetchPriority="high"
        className="hero-fx-photo absolute inset-0 size-full object-cover object-top"
      />
    </div>
  );
}
