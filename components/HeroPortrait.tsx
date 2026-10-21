import { useEffect, useRef, useState } from "react";
import { sizeOf } from "@/lib/imageSizes.ts";
import { createHeroCloud, HOVER_LABELS, INTRO_LABELS, INTRO_NAMES, type HeroCloud, type HoverName, type IntroName } from "@/lib/heroCloud.ts";

const STORE = "hero-fx";
type IntroChoice = IntroName | "random";
type Choice = { intro: IntroChoice; hover: HoverName; eyes: boolean };

let lastIntro: IntroName | null = null;
function resolveIntro(c: IntroChoice): IntroName {
  if (c !== "random") return (lastIntro = c);
  const pool = INTRO_NAMES.filter((n) => n !== lastIntro);
  return (lastIntro = pool[Math.floor(Math.random() * pool.length)]);
}
const DEFAULTS: Choice = { intro: "mist", hover: "mix", eyes: true };

// The picker for intro and hover styles is only shown on the dev instance, locally, or with ?fx.
function panelEnabled() {
  const { hostname, search } = window.location;
  return hostname.startsWith("dev.") || hostname === "localhost" || new URLSearchParams(search).has("fx");
}

function readChoice(): Choice {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? "{}");
    return {
      intro: (saved.intro in INTRO_LABELS || saved.intro === "random" ? saved.intro : DEFAULTS.intro) as IntroChoice,
      hover: (saved.hover in HOVER_LABELS ? saved.hover : DEFAULTS.hover) as HoverName,
      eyes: typeof saved.eyes === "boolean" ? saved.eyes : DEFAULTS.eyes,
    };
  } catch {
    return DEFAULTS;
  }
}

export function HeroPortrait(props: { alt: string; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HeroCloud | null>(null);
  const [panel, setPanel] = useState<null | Choice>(null);
  const [played, setPlayed] = useState<IntroName | null>(null);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current, photo = photoRef.current;
    if (!stage || !canvas || !photo) return;
    if (!document.documentElement.classList.contains("fx-on")) return;
    const choice = panelEnabled() ? readChoice() : DEFAULTS;
    let cancelled = false;
    const first = resolveIntro(choice.intro);
    createHeroCloud(stage, canvas, photo, { ...choice, intro: first })
      .then((cloud) => {
        if (cancelled) return cloud.destroy();
        cloudRef.current = cloud;
        if (panelEnabled()) { setPanel(choice); setPlayed(first); }
      })
      .catch(() => {
        // No WebGL or the data failed to load: keep the plain photo.
        document.documentElement.classList.remove("fx-on");
      });
    return () => { cancelled = true; cloudRef.current?.destroy(); cloudRef.current = null; };
  }, []);

  function choose(next: Choice) {
    setPanel(next);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* storage blocked */ }
    const cloud = cloudRef.current;
    if (!cloud) return;
    cloud.setHover(next.hover);
    cloud.setEyes(next.eyes);
    if (next.intro !== panel?.intro) play(next.intro);
  }

  function play(c: IntroChoice) {
    const cloud = cloudRef.current;
    if (!cloud) return;
    const name = resolveIntro(c);
    cloud.setIntro(name); cloud.replay(); setPlayed(name);
  }

  return (
    <>
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
      {panel && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-wrap items-end gap-3 border-2 border-ink bg-paper px-4 py-3 print-shadow">
          <p className="eyebrow text-mustard-deep w-full">Dev · Hero-Effekt</p>
          <label className="grid gap-1 eyebrow">
            Aufbau
            <select
              value={panel.intro}
              onChange={(e) => choose({ ...panel, intro: e.target.value as IntroChoice })}
              className="border border-ink bg-paper px-2 py-1 normal-case tracking-normal"
            >
              <option value="random">Zufall{panel.intro === "random" && played ? ` (${INTRO_LABELS[played]})` : ""}</option>
              {Object.entries(INTRO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="grid gap-1 eyebrow">
            Hover
            <select
              value={panel.hover}
              onChange={(e) => choose({ ...panel, hover: e.target.value as HoverName })}
              className="border border-ink bg-paper px-2 py-1 normal-case tracking-normal"
            >
              {Object.entries(HOVER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 eyebrow py-1.5">
            <input type="checkbox" checked={panel.eyes} onChange={(e) => choose({ ...panel, eyes: e.target.checked })} />
            Augen folgen
          </label>
          <button type="button" onClick={() => panel && play(panel.intro)} className="eyebrow border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper">
            Abspielen
          </button>
        </div>
      )}
    </>
  );
}
