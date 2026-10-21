import { useEffect, useRef } from "react";
import { sizeOf } from "@/lib/imageSizes.ts";
import { type CloudData, createPointCloud, type PointCloud } from "@/lib/pointCloud.ts";

export function CloudPortrait(props: { src: string; data: CloudData; alt: string; priority?: boolean; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const { src, cols, rows, color } = props.data;

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current, photo = photoRef.current;
    if (!stage || !canvas || !photo) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cloud: PointCloud | null = null, generation = 0, disposed = false;
    let pending: AbortController | null = null;
    function sync() {
      if (!stage || !canvas || !photo) return;
      const current = ++generation;
      pending?.abort(); pending = new AbortController();
      cloud?.destroy(); cloud = null;
      const fx = !motion.matches && !!window.WebGLRenderingContext;
      document.documentElement.classList.toggle("fx-on", fx);
      if (!fx) { photo.style.opacity = "1"; return; }
      photo.style.opacity = "0";
      createPointCloud(stage, canvas, photo, { src, cols, rows, color }, pending.signal).then(c => {
        if (disposed || current !== generation) { c.destroy(); if (motion.matches) photo.style.opacity = "1"; }
        else cloud = c;
      }).catch(() => { if (current === generation) photo.style.opacity = "1"; });
    }
    sync(); motion.addEventListener("change", sync);
    return () => { disposed = true; generation++; pending?.abort(); motion.removeEventListener("change", sync); cloud?.destroy(); };
  }, [src, cols, rows, color]);

  return (
    <div ref={stageRef} className={`cloud-fx relative overflow-hidden ${props.className ?? ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <img
        ref={photoRef}
        src={props.src}
        {...sizeOf(props.src)}
        alt={props.alt}
        fetchPriority={props.priority ? "high" : undefined}
        className="cloud-fx-photo absolute inset-0 size-full object-cover object-top"
      />
    </div>
  );
}
