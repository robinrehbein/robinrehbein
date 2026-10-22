import { useEffect, useState } from "react";

// Colour theme: follows the system until the visitor picks one. The choice is kept in localStorage;
// the inline script in root.tsx applies it as <html data-theme> before first paint.
type Choice = "system" | "light" | "dark";
const NEXT: Record<Choice, Choice> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Choice, string> = { system: "System", light: "Light", dark: "Dark" };
const DARK = "(prefers-color-scheme: dark)";

function apply(choice: Choice) {
  const dark = choice === "dark" || (choice === "system" && matchMedia(DARK).matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") setChoice(saved);
    } catch { /* storage blocked: stay on system */ }
  }, []);

  // While following the system, follow it live too.
  useEffect(() => {
    if (choice !== "system") return;
    const media = matchMedia(DARK);
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);

  const cycle = () => {
    const next = NEXT[choice];
    setChoice(next);
    apply(next);
    try {
      if (next === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch { /* storage blocked: the choice lasts for this page */ }
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="theme-toggle nav-link justify-center hover:text-green transition-colors"
      aria-label={`Colour theme: ${LABEL[choice]}. Switch to ${LABEL[NEXT[choice]]}.`}
      title={`Theme: ${LABEL[choice]}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {choice === "light" && (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
          </>
        )}
        {choice === "dark" && <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />}
        {choice === "system" && (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
  );
}
