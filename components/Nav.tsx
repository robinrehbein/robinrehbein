export function Nav(props: { currentPath?: string }) {
  const { currentPath } = props;
  const isActive = (path: string) => currentPath === path ? "page" : undefined;

  return (
    <header class="border-b-2 border-ink bg-paper/95 sticky top-0 z-50 backdrop-blur-sm">
      <div class="shell flex items-center justify-between gap-3 py-3">
        <a href="/" class="display text-xl font-semibold tracking-tight">
          <span class="md:hidden" aria-label="Robin Rehbein">RR</span>
          <span class="hidden md:inline">Robin&nbsp;Rehbein</span>
          <span class="text-mustard-deep">.</span>
        </a>
        <nav class="flex items-center gap-4 md:gap-8">
          <a
            href="/work"
            aria-current={isActive("/work")}
            class="eyebrow hover:text-green transition-colors aria-[current=page]:text-green"
          >
            Work
          </a>
          <a
            href="/about"
            aria-current={isActive("/about")}
            class="eyebrow hover:text-green transition-colors aria-[current=page]:text-green"
          >
            About
          </a>
          <a
            href="/#contact"
            class="eyebrow hover:text-green transition-colors"
          >
            Contact
          </a>
          <span class="hidden md:inline-flex items-center gap-2 eyebrow text-green">
            <span class="status-dot" aria-hidden="true" />
            Open to interesting side projects
          </span>
        </nav>
      </div>
    </header>
  );
}
