import { Logo } from "@/components/Logo.tsx";

export function Nav(props: { currentPath?: string }) {
  const { currentPath } = props;
  const isActive = (path: string) => currentPath === path ? "page" : undefined;

  return (
    <header className="border-b-2 border-ink bg-paper/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <a href="/" className="display text-xl font-semibold tracking-tight inline-flex items-center gap-1.5">
          <Logo className="size-[1.6em]" />
          <span className="sr-only md:not-sr-only">Robin&nbsp;Rehbein.</span>
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
            href="#contact"
            className="eyebrow hover:text-green transition-colors"
          >
            Contact
          </a>
          <span className="hidden md:inline-flex items-center gap-2 eyebrow">
            <span className="status-dot" aria-hidden="true" />
            Fully booked
          </span>
        </nav>
      </div>
    </header>
  );
}
