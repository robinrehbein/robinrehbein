import { navItems } from "@/lib/content.ts";

export default function SiteNav() {
  return (
    <header class="sticky top-0 z-20 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
      <nav class="shell flex items-center justify-between gap-4 py-3 md:min-h-[4.5rem]">
        <a href="/" class="flex items-center gap-3" aria-label="Startseite">
          <img
            src="/logo.svg"
            alt=""
            class="size-10 rounded-lg"
            width="40"
            height="40"
          />
          <span class="leading-tight">
            <span class="block text-base font-semibold tracking-tight">
              RR3D Studio
            </span>
            <span class="text-xs text-[var(--muted)]">3D Print Shop</span>
          </span>
        </a>

        <div class="nav-links hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              href={item.href}
              class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div class="flex items-center gap-2">
          {/* Cart slot — wired up in Phase 2 */}
          <span
            aria-hidden="true"
            class="hidden size-10 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] md:grid"
            title="Warenkorb (bald verfügbar)"
          >
            🛒
          </span>
          <a href="/printauftrag" class="button nav-action">
            Angebot anfragen
          </a>
        </div>
      </nav>
      <div class="nav-links flex items-center gap-1 overflow-x-auto border-t border-[var(--line)] px-4 py-2 md:hidden">
        {navItems.map((item) => (
          <a
            href={item.href}
            class="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-muted)]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
