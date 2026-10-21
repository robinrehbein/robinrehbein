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
    if (!document.documentElement.classList.contains("fx-on")) return;
    let cloud: PointCloud | null = null, cancelled = false;
    createPointCloud(stage, canvas, photo, { src, cols, rows, color })
      .then((c) => { if (cancelled) c.destroy(); else cloud = c; })
      .catch(() => {
        // No WebGL or the data failed to load: keep the plain photo.
        document.documentElement.classList.remove("fx-on");
      });
    return () => { cancelled = true; cloud?.destroy(); };
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
