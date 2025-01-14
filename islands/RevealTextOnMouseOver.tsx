import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

const RevealTextOnMouseOver = () => {
  const mousePosition = useSignal<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialText = "Hover over this text";
  const revealedText = "to see the hidden message";

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    mousePosition.value = x;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        padding: "1rem",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ position: "relative" }}>
        <span>{initialText}</span>

        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            top: 0,
            left: 0,
            width: "100%",
            clipPath:
              `polygon(${mousePosition.value}px 0, 100% 0, 100% 100%, ${mousePosition.value}px 100%)`,
          }}
        >
          <span>{revealedText}</span>
        </div>
      </div>
    </div>
  );
};

export default RevealTextOnMouseOver;
