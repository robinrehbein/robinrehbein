export function Nav(props: { currentPath?: string }) {
  const { currentPath } = props;
  const isActive = (path: string) => currentPath === path ? "page" : undefined;

  return (
    <header className="border-b-2 border-ink bg-paper/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <a href="/" className="display text-xl font-semibold tracking-tight">
          <span className="md:hidden" aria-label="Robin Rehbein">RR</span>
          <span className="hidden md:inline">Robin&nbsp;Rehbein</span>
          <span className="text-mustard-deep">.</span>
        </a>
        <nav className="flex items-center gap-4 md:gap-8">
          <a
            href="/work"
            aria-current={isActive("/work")}
            className="eyebrow hover:text-green transition-colors aria-[current=page]:text-green"
          >
            Work
          </a>
          <a
            href="/about"
            aria-current={isActive("/about")}
            className="eyebrow hover:text-green transition-colors aria-[current=page]:text-green"
          >
            About
          </a>
          <a
            href="/#contact"
            className="eyebrow hover:text-green transition-colors"
          >
            Contact
          </a>
          <span className="hidden md:inline-flex items-center gap-2 eyebrow text-green">
            <span className="status-dot" aria-hidden="true" />
            Open to interesting side projects
          </span>
        </nav>
      </div>
    </header>
  );
}
