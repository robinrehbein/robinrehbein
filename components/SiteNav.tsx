import { navItems } from "@/lib/content.ts";

export default function SiteNav() {
  return (
    <header class="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(244,240,230,0.82)] backdrop-blur-xl">
      <nav class="shell flex flex-col gap-3 py-3 md:min-h-20 md:flex-row md:items-center md:justify-between md:py-0">
        <a
          href="/"
          class="group flex items-center gap-3"
          aria-label="Startseite"
        >
          <img
            src="/logo.svg"
            alt=""
            class="size-11 rounded-[8px]"
            width="44"
            height="44"
          />
          <span class="leading-tight">
            <span class="display block text-xl font-semibold">
              RR3D Studio
            </span>
            <span class="text-sm opacity-70">3D Print Shop</span>
          </span>
        </a>
        <div class="nav-links flex items-center gap-1 overflow-x-auto border-t border-[var(--line)] pt-3 md:border-0 md:pt-0">
          {navItems.map((item) => (
            <a
              href={item.href}
              class="shrink-0 rounded-[6px] px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] hover:bg-[rgba(23,19,14,0.08)]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a href="/printauftrag" class="button nav-action">
          Angebot anfragen
        </a>
      </nav>
    </header>
  );
}
