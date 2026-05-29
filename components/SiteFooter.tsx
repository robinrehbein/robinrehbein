export default function SiteFooter() {
  return (
    <footer class="mt-20 border-t border-[var(--line)] bg-[var(--surface-muted)] py-12">
      <div class="shell grid gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <p class="text-lg font-semibold tracking-tight">RR3D Studio</p>
          <p class="mt-3 max-w-md text-sm text-[var(--muted)]">
            3D-gedruckte Objekte, kleine Serien und individuelle Druckaufträge
            aus Stuttgart.
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
            Shop
          </p>
          <a class="mt-3 block text-sm hover:text-[var(--accent)]" href="/shop">
            Alle Produkte
          </a>
          <a
            class="mt-2 block text-sm hover:text-[var(--accent)]"
            href="/printauftrag"
          >
            Druckauftrag
          </a>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
            Mehr
          </p>
          <a class="mt-3 block text-sm hover:text-[var(--accent)]" href="/blog">
            Blog
          </a>
          <a
            class="mt-2 block text-sm hover:text-[var(--accent)]"
            href="/about"
          >
            About
          </a>
          <a
            class="mt-2 block text-sm hover:text-[var(--accent)]"
            href="mailto:hello@robinrehbein.de"
          >
            Kontakt
          </a>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
            Rechtliches
          </p>
          <a class="mt-3 block text-sm text-[var(--muted)]" href="/imprint">
            Impressum
          </a>
          <a class="mt-2 block text-sm text-[var(--muted)]" href="/privacy">
            Datenschutz
          </a>
          <a class="mt-2 block text-sm text-[var(--muted)]" href="/disclaimer">
            Disclaimer
          </a>
        </div>
      </div>
    </footer>
  );
}
