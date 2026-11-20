import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { contributionTotal, lastWeeks, longestStreak, type ContributionCalendar } from "@/lib/contributions.ts";
import { PushCalendar } from "@/components/PushCalendar.tsx";

// Easter egg on the footer's GitHub link: hovering or focusing it pins a newspaper clipping of the last
// 26 weeks of contributions above it, and the clipping's Play button opens a bricks game on the whole
// year. On touch screens the first tap opens the clipping and a second tap follows the link.
// The calendar is fetched from this site's own /contributions.json on first open, the game only on Play.

const PushBricks = lazy(() => import("@/components/PushBricks.tsx"));
const WEEKS = 26;

let request: Promise<ContributionCalendar | null> | undefined;
function loadCalendar() {
  request ??= fetch("/contributions.json")
    .then((r) => (r.ok ? (r.json() as Promise<ContributionCalendar>) : null))
    .catch(() => null)
    .then((calendar) => { if (!calendar) request = undefined; return calendar; });
  return request;
}

export function PushClipping(props: { href: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [calendar, setCalendar] = useState<ContributionCalendar | null | "unavailable">(null);
  const [playing, setPlaying] = useState(false);
  const wrapper = useRef<HTMLSpanElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastPointer = useRef("mouse");

  useEffect(() => {
    if (!open || calendar) return;
    let live = true;
    loadCalendar().then((c) => { if (live) setCalendar(c ?? "unavailable"); });
    return () => { live = false; };
  }, [open, calendar]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !playing) { setOpen(false); link.current?.focus(); } };
    const onOutside = (e: PointerEvent) => { if (!wrapper.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onOutside); };
  }, [open, playing]);

  const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 180); };

  const days = calendar && calendar !== "unavailable" ? calendar.days : null;
  const recent = days ? lastWeeks(days, WEEKS) : null;

  return (
    <span
      ref={wrapper}
      className="push-clip-anchor"
      data-open={open || undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") show(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && !playing) hideSoon(); }}
      onFocus={show}
      onBlur={(e) => { if (!wrapper.current?.contains(e.relatedTarget as Node | null) && !playing) hideSoon(); }}
    >
      <a
        ref={link}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="link-wavy"
        aria-describedby="push-clipping"
        onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
        onClick={(e) => { if (lastPointer.current !== "mouse" && !open) { e.preventDefault(); show(); } }}
      >
        {props.children}
      </a>
      <span id="push-clipping" className="push-clipping" role="tooltip">
        <span className="eyebrow push-clipping-head">git push --history · last {WEEKS} weeks</span>
        {calendar === "unavailable"
          ? <span className="push-clipping-note">The calendar is taking a break. The profile on GitHub has it all.</span>
          : <PushCalendar days={recent} weeks={WEEKS} />}
        <span className="push-clipping-foot">
          <span>{recent ? `${contributionTotal(recent).toLocaleString("en")} contributions · best streak ${longestStreak(recent)} days` : calendar === "unavailable" ? "" : "Fetching…"}</span>
          {days && (
            <button type="button" className="push-play" onClick={() => setPlaying(true)}>
              ▶ Play
            </button>
          )}
        </span>
      </span>
      {playing && days && (
        <Suspense fallback={null}>
          <PushBricks days={days} onClose={() => { setPlaying(false); setOpen(false); link.current?.focus(); }} />
        </Suspense>
      )}
    </span>
  );
}
