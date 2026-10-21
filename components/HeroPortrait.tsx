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
    if (!document.documentElement.classList.contains("fx-on")) return;
    let cloud: HeroCloud | null = null, cancelled = false;
    createHeroCloud(stage, canvas, photo)
      .then((c) => { if (cancelled) c.destroy(); else cloud = c; })
      .catch(() => {
        // No WebGL or the data failed to load: keep the plain photo.
        document.documentElement.classList.remove("fx-on");
      });
    return () => { cancelled = true; cloud?.destroy(); };
  }, []);

  return (
    <div ref={stageRef} className={`hero-fx relative overflow-hidden ${props.className ?? ""}`}>
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
