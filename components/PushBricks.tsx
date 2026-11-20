import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatDay, monthLabel, weekday, type ContributionDay } from "@/lib/contributions.ts";

// The bricks game behind the footer's GitHub clipping. Every day with contributions is a brick, and the
// darker its shade, the more hits it takes; empty days are gaps the ball flies through. Narrow screens
// play the last 22 weeks, wider ones the whole year. Loaded only when someone presses Play.

type Phase = "ready" | "playing" | "over" | "won";
type Brick = { x: number; y: number; size: number; hp: number; max: number; day: ContributionDay; flash: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const BEST_KEY = "push-bricks-best";
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };
const saveBest = (n: number) => { try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* storage blocked */ } };

export default function PushBricks(props: { days: ContributionDay[]; onClose: () => void }) {
  const { days, onClose } = props;
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [lastBroken, setLastBroken] = useState("");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    setBest(readBest());
    const d = dialog.current;
    d?.showModal();
    return () => { if (d?.open) d.close(); };
  }, []);

  useEffect(() => {
    const el = canvas.current, d = dialog.current;
    if (!el || !d) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Layout: the field follows the canvas width; a different width starts a new round.
    const W = Math.max(280, el.parentElement?.clientWidth ?? 600);
    const H = Math.round(Math.min(520, Math.max(360, W * 0.58)));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = W * dpr; el.height = H * dpr; el.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const weeks = W < 640 ? 22 : 53;
    const lead = weekday(days[0].date);
    const firstCol = Math.max(0, Math.ceil((lead + days.length) / 7) - weeks);
    const gap = W < 640 ? 2 : 3;
    const cell = Math.floor((W - 28 - gap * (weeks - 1)) / weeks);
    const ox = Math.round((W - (cell * weeks + gap * (weeks - 1))) / 2), oy = 34;
    const pos = (i: number) => ({ col: Math.floor((lead + i) / 7) - firstCol, row: (lead + i) % 7 });
    const slots: { x: number; y: number }[] = [];
    const bricks: Brick[] = [];
    const months: { x: number; label: string }[] = [];
    days.forEach((day, i) => {
      const { col, row } = pos(i);
      if (col < 0) return;
      const x = ox + col * (cell + gap), y = oy + row * (cell + gap);
      slots.push({ x, y });
      if (day.level > 0) bricks.push({ x, y, size: cell, hp: day.level, max: day.level, day, flash: 0 });
      if (day.date.endsWith("-01") && col < weeks - 2) months.push({ x, label: monthLabel(day.date) });
    });
    const gridBottom = oy + 7 * (cell + gap);

    const g = {
      px: W / 2, pw: Math.max(64, W * 0.15), py: H - 26, ph: 10,
      bx: 0, by: 0, vx: 0, vy: 0, r: Math.max(4.5, Math.min(7, cell * 0.42)),
      speed: Math.max(4.2, W / 150), stuck: true, keys: 0, lives: 3, score: 0, broken: 0,
      particles: [] as Particle[],
    };
    setScore(0); setLives(3); setLastBroken("");

    let colors: Record<string, string> = {};
    const readColors = () => {
      const cs = getComputedStyle(d);
      colors = Object.fromEntries(["paper-warm", "ink", "mustard", "signal", "push-0", "push-1", "push-2", "push-3", "push-4"]
        .map((k) => [k, cs.getPropertyValue(`--color-${k}`).trim()]));
    };
    readColors();
    const theme = new MutationObserver(readColors);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const serve = () => { g.stuck = true; g.vx = 0; g.vy = 0; };
    const launch = () => {
      if (!g.stuck || phaseRef.current !== "playing") return;
      g.stuck = false;
      const a = -Math.PI / 2 + (Math.random() * 0.6 - 0.3);
      g.vx = Math.cos(a) * g.speed; g.vy = Math.sin(a) * g.speed;
    };
    const finish = (won: boolean) => {
      phaseRef.current = won ? "won" : "over";
      const record = readBest();
      if (g.score > record) { saveBest(g.score); setBest(g.score); }
      setPhase(won ? "won" : "over");
    };
    const box = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
    };

    const step = (k: number) => {
      g.px = Math.max(g.pw / 2, Math.min(W - g.pw / 2, g.px + g.keys * 9 * k));
      if (g.stuck) { g.bx = g.px; g.by = g.py - g.r - 1; return; }
      const sub = Math.ceil((g.speed * k) / (g.r * 0.8));
      for (let s = 0; s < sub; s++) {
        g.bx += (g.vx * k) / sub; g.by += (g.vy * k) / sub;
        if (g.bx < g.r) { g.bx = g.r; g.vx = Math.abs(g.vx); }
        if (g.bx > W - g.r) { g.bx = W - g.r; g.vx = -Math.abs(g.vx); }
        if (g.by < g.r) { g.by = g.r; g.vy = Math.abs(g.vy); }
        // The paddle sends the ball off at an angle that depends on where it lands.
        if (g.vy > 0 && g.by + g.r >= g.py && g.by + g.r <= g.py + g.ph + 6 && Math.abs(g.bx - g.px) <= g.pw / 2 + g.r) {
          const a = -Math.PI / 2 + ((g.bx - g.px) / (g.pw / 2)) * 1.05;
          g.vx = Math.cos(a) * g.speed; g.vy = Math.sin(a) * g.speed; g.by = g.py - g.r - 0.5;
        }
        if (g.by - g.r < gridBottom) {
          for (const b of bricks) {
            if (b.hp <= 0) continue;
            const cx = Math.max(b.x, Math.min(g.bx, b.x + b.size)), cy = Math.max(b.y, Math.min(g.by, b.y + b.size));
            if ((g.bx - cx) ** 2 + (g.by - cy) ** 2 > g.r * g.r) continue;
            const overlapX = b.size / 2 + g.r - Math.abs(g.bx - (b.x + b.size / 2));
            const overlapY = b.size / 2 + g.r - Math.abs(g.by - (b.y + b.size / 2));
            if (overlapX < overlapY) g.vx = g.bx < b.x + b.size / 2 ? -Math.abs(g.vx) : Math.abs(g.vx);
            else g.vy = g.by < b.y + b.size / 2 ? -Math.abs(g.vy) : Math.abs(g.vy);
            b.hp--; b.flash = 1;
            if (b.hp === 0) {
              g.score += b.day.count; g.broken++;
              setScore(g.score);
              setLastBroken(`${formatDay(b.day.date)} · ${b.day.count} contribution${b.day.count === 1 ? "" : "s"}`);
              if (!reduced) for (let p = 0; p < 8; p++) {
                const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 2.5;
                g.particles.push({ x: b.x + b.size / 2, y: b.y + b.size / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 1, color: colors[`push-${b.max}`] });
              }
              if (g.broken % 15 === 0) { const n = Math.hypot(g.vx, g.vy); g.speed *= 1.04; g.vx *= g.speed / n; g.vy *= g.speed / n; }
            }
            break;
          }
        }
        if (g.by - g.r > H) {
          g.lives--; setLives(g.lives);
          if (g.lives <= 0) return finish(false);
          return serve();
        }
      }
      // Keep the ball from settling into a flat, endless sideways bounce.
      if (Math.abs(g.vy) < g.speed * 0.25) { g.vy = Math.sign(g.vy || -1) * g.speed * 0.25; g.vx = Math.sign(g.vx || 1) * Math.sqrt(g.speed ** 2 - g.vy ** 2); }
      if (bricks.every((b) => b.hp <= 0)) finish(true);
    };

    const draw = () => {
      ctx.fillStyle = colors["paper-warm"]; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colors["push-0"];
      for (const s of slots) ctx.fillRect(s.x, s.y, cell, cell);
      for (const b of bricks) {
        if (b.hp <= 0) continue;
        ctx.fillStyle = b.flash > 0 ? colors.mustard : colors[`push-${b.hp}`];
        box(b.x, b.y, b.size, b.size, 2); ctx.fill();
      }
      ctx.fillStyle = colors.ink; ctx.globalAlpha = 0.65; ctx.font = "600 11px Anaheim, sans-serif"; ctx.textAlign = "left";
      for (const m of months) ctx.fillText(m.label, m.x, oy - 8);
      ctx.globalAlpha = 1;
      for (const p of g.particles) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.ink; box(g.px - g.pw / 2, g.py, g.pw, g.ph, 2); ctx.fill();
      ctx.fillStyle = colors.mustard; ctx.fillRect(g.px - g.pw / 2, g.py, g.pw, 3);
      ctx.beginPath(); ctx.arc(g.bx, g.by, g.r, 0, Math.PI * 2); ctx.fillStyle = colors.signal; ctx.fill();
      if (g.stuck && phaseRef.current === "playing") {
        ctx.fillStyle = colors.ink; ctx.globalAlpha = 0.65; ctx.font = "600 12px Anaheim, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("SPACE OR TAP TO LAUNCH", W / 2, g.py - 26);
        ctx.globalAlpha = 1;
      }
    };

    let raf = 0, last = performance.now();
    const loop = (t: number) => {
      const k = Math.min(50, t - last) / 16.67; last = t;
      if (phaseRef.current === "playing") step(k); else if (g.stuck) { g.bx = g.px; g.by = g.py - g.r - 1; }
      for (const p of g.particles) { p.x += p.vx * k; p.y += p.vy * k; p.vy += 0.15 * k; p.life -= 0.03 * k; }
      g.particles = g.particles.filter((p) => p.life > 0);
      for (const b of bricks) if (b.flash > 0) b.flash -= 0.08 * k;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const toX = (e: PointerEvent) => { const r = el.getBoundingClientRect(); return ((e.clientX - r.left) * W) / r.width; };
    const onMove = (e: PointerEvent) => { if (phaseRef.current === "playing") g.px = toX(e); };
    const onDown = (e: PointerEvent) => { if (phaseRef.current === "playing") { g.px = toX(e); launch(); } };
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "playing") return;
      if (e.key === " ") { e.preventDefault(); launch(); }
      if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); g.keys = -1; }
      if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); g.keys = 1; }
    };
    const onKeyUp = (e: KeyboardEvent) => { if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) g.keys = 0; };
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (Math.abs((el.parentElement?.clientWidth ?? W) - W) > 8) { setPhase("ready"); setRound((r) => r + 1); } }, 200);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    d.addEventListener("keydown", onKey);
    d.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(resizeTimer); theme.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      d.removeEventListener("keydown", onKey);
      d.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
    };
  }, [days, round]);

  const start = () => {
    if (phase === "over" || phase === "won") setRound((r) => r + 1);
    setPhase("playing");
    canvas.current?.focus();
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="push-bricks"
      aria-labelledby="push-bricks-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <div className="push-bricks-bar">
        <h2 id="push-bricks-title" className="display">Push Bricks.</h2>
        <dl className="push-bricks-hud">
          <div><dt>Contributions</dt><dd>{score.toLocaleString("en")}</dd></div>
          <div><dt>Balls</dt><dd>{lives}</dd></div>
          <div><dt>Best</dt><dd>{Math.max(best, score).toLocaleString("en")}</dd></div>
        </dl>
        <button type="button" className="eyebrow push-bricks-close" onClick={onClose}>Esc · Close</button>
      </div>
      <div className="push-bricks-field">
        <canvas ref={canvas} tabIndex={-1} aria-label="Game field: bricks made of the past year's GitHub contributions" />
        <p className="push-bricks-ticker" aria-live="polite">{lastBroken && `✕ ${lastBroken}`}</p>
        {phase !== "playing" && (
          <div className="push-bricks-overlay">
            <p className="eyebrow">{phase === "ready" ? "A year of pushes" : phase === "won" ? "Year cleared" : "Out of balls"}</p>
            <p className="display push-bricks-headline">
              {phase === "ready" ? <>Break <em>your year</em></> : phase === "won" ? <>All <em>cleared</em></> : <>Game <em>over</em></>}
            </p>
            <p className="push-bricks-copy">
              {phase === "ready"
                ? "Every day with a push is a brick. The darker it is, the more hits it takes. Move with the mouse, a finger or ← →, launch with space."
                : `${score.toLocaleString("en")} contributions broken.${score > 0 && score >= best ? " New best!" : ""}`}
            </p>
            <button type="button" className="push-play" onClick={start} autoFocus>{phase === "ready" ? "▶ Start" : "▶ Again"}</button>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
