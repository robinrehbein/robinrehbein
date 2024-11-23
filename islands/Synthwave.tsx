import { useEffect, useRef } from "preact/hooks";

const Synthwave = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const drawSun = () => {
      const sunX = canvas.width / 2;
      const sunY = canvas.height / 3;
      const sunRadius = 100;

      const gradient = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        sunRadius,
      );
      gradient.addColorStop(0, "#ffcc00");
      gradient.addColorStop(1, "rgba(255, 204, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    let offset = 0;
    const speed = 2;

    const drawGrid = () => {
      const horizonY = canvas.height / 2;
      const gridSize = 40;
      const numLines = 20;

      ctx.strokeStyle = "#5a776d";
      ctx.lineWidth = 2;

      // Zeichne vertikale Linien
      for (let i = -numLines; i <= numLines; i++) {
        const x = (canvas.width / 2) + i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(x * 0.5 + canvas.width / 2 * 0.5, canvas.height);
        ctx.stroke();
      }

      // Zeichne horizontale Linien
      for (let i = 0; i <= numLines; i++) {
        const y = horizonY +
          (i * gridSize + offset) % (canvas.height - horizonY);
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
    animate();

    return () => {
      globalThis.removeEventListener("resize", handleResize);
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
