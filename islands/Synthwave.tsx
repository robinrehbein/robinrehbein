import { useEffect, useRef } from "preact/hooks";
import { Point } from "../lib/types.ts";

const Synthwave = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mousePositionRef = useRef({
    x: globalThis.innerWidth / 2,
    y: globalThis.innerHeight / 4,
  });
  const sunPositionRef = useRef({
    x: globalThis.innerWidth / 2,
    y: globalThis.innerHeight / 4,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = globalThis.innerWidth;
        canvas.height = globalThis.innerHeight;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const bezier = (
      t: number,
      p0: Point,
      p1: Point,
      p2: Point,
      p3: Point,
    ): Point => {
      const cX = 3 * (p1.x - p0.x);
      const bX = 3 * (p2.x - p1.x) - cX;
      const aX = p3.x - p0.x - cX - bX;

      const cY = 3 * (p1.y - p0.y);
      const bY = 3 * (p2.y - p1.y) - cY;
      const aY = p3.y - p0.y - cY - bY;

      const x = ((aX * t + bX) * t + cX) * t + p0.x;
      const y = ((aY * t + bY) * t + cY) * t + p0.y;

      return { x, y };
    };

    const drawSun = () => {
      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const { x: sunX, y: sunY } = sunPositionRef.current;

      // Limit the mouse's Y-coordinate to the 60-80% range of the screen
      const minY = canvas.height * 0.05;
      const maxY = canvas.height * 0.35;
      const constrainedMouseY = Math.max(minY, Math.min(mouseY, maxY));

      const minX = canvas.width * 0.3;
      const maxX = canvas.width * 0.7;
      const constrainedMouseX = Math.max(minX, Math.min(mouseX, maxX));

      // Control points for Bezier curve
      const start = { x: sunX, y: sunY };
      const control1 = {
        x: sunX + (constrainedMouseX - sunX) * 0.0001,
        y: sunY,
      };
      const control2 = {
        x: constrainedMouseX - (constrainedMouseX - sunX) * 0.0001,
        y: constrainedMouseY,
      };

      const end = { x: constrainedMouseX, y: constrainedMouseY };

      // Interpolate along the Bezier curve
      const newSunPosition = bezier(0.05, start, control1, control2, end);
      sunPositionRef.current = newSunPosition;

      const sunRadius = 200;
      const gradient = ctx.createRadialGradient(
        newSunPosition.x,
        newSunPosition.y,
        0,
        newSunPosition.x,
        newSunPosition.y,
        sunRadius,
      );
      gradient.addColorStop(
        0,
        getComputedStyle(document.documentElement).getPropertyValue(
          "--mustard-yellow-300",
        ) || "#f0c775",
      );
      gradient.addColorStop(
        .3,
        getComputedStyle(document.documentElement).getPropertyValue(
          "--mustard-yellow-200",
        ) || "#fefcf1",
      );
      gradient.addColorStop(
        .6,
        getComputedStyle(document.documentElement).getPropertyValue(
          "--mustard-yellow-100",
        ) || "#fefcf1",
      );
      gradient.addColorStop(
        1,
        getComputedStyle(document.documentElement).getPropertyValue(
          "--foreground",
        ) || "#fefcf1",
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      //   ctx.filter = "blur(50px)";
      ctx.arc(newSunPosition.x, newSunPosition.y, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      //   ctx.filter = "none";
    };

    let offset = 0;
    const speed = .1;

    const drawGrid = () => {
      const horizonY = canvas.height / 2;
      const horizonX = canvas.width;
      const gridSize = horizonY / 10;
      const numLines = horizonX / gridSize;

      ctx.strokeStyle =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--racing-green-500",
        ) || "#5a776d";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.stroke();

      // Draw vertical lines
      for (let i = -numLines; i <= numLines; i++) {
        const x = (canvas.width / 2) + i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x * 0.5 + canvas.width / 2 * 0.5, horizonY);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      // ToDo: Add perspective
      for (let i = 0; i <= numLines; i++) {
        const y = horizonY +
          (i * gridSize - offset) % (canvas.height - horizonY);
        if (y < horizonY) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSun();
      drawGrid();
      offset += speed;
      requestAnimationFrame(animate);
    };

    handleResize();
    globalThis.addEventListener("resize", handleResize);
    globalThis.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      globalThis.removeEventListener("resize", handleResize);
      globalThis.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};

export default Synthwave;
