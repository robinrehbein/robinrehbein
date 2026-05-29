# Shop Clean-Modern Redesign — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the earthy/editorial visual language with a clean, modern,
product-focused shop design via new design tokens and reusable UI primitives,
then restyle every public surface — without changing any business logic.

**Architecture:** Phase 1 is purely presentational. We introduce a neutral token
set in `assets/styles.css` (removing paper texture/noise/grid), add `cva`-based UI
primitives under `components/ui/` (single source of truth for buttons, badges,
prices), then migrate `SiteNav`, `SiteFooter`, `ProductCard`, the home storefront,
the product detail, and the `ShopFilter` island onto the new system. No handlers,
routes, or data flows change. The cart button stays disabled (Phase 2) and no
payment code is added (Phase 3).

**Tech Stack:** Fresh 2.2, Preact, Tailwind v4, `class-variance-authority`,
`@nick/clsx`, `tailwind-merge`, Deno (`deno task check`, `deno test`).

---

## File Structure

- Create `components/ui/cn.ts` — `cn()` helper merging clsx + tailwind-merge.
- Create `components/ui/Price.tsx` (+ `Price_test.tsx`) — price formatting wrapper.
- Create `components/ui/Button.tsx` (+ `Button_test.tsx`) — `cva` button.
- Create `components/ui/Badge.tsx` (+ `Badge_test.tsx`) — `cva` badge.
- Modify `assets/styles.css` — new tokens, remove textures, restyle base classes.
- Modify `components/ProductCard.tsx` (+ test) — clean card using Price/Badge.
- Modify `components/SiteNav.tsx` — shop-first nav, reserved cart slot.
- Modify `components/SiteFooter.tsx` — clean footer, demote Blog/About/Portfolio.
- Modify `routes/index.tsx` — slim hero + trust strip + storefront.
- Modify `routes/shop/[slug].tsx` + `islands/ProductDetail.tsx` — clean detail.
- Modify `islands/ShopFilter.tsx` — light markup pass (most styling via CSS).

---

## Task 1: `cn()` class-merge helper

**Files:**
- Create: `components/ui/cn.ts`

- [ ] **Step 1: Write the helper**

```ts
import { clsx, type ClassValue } from "@nick/clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Type-check**

Run: `deno check components/ui/cn.ts`
Expected: passes (no errors). If `@nick/clsx` lacks `ClassValue`, fall back to
`import { clsx } from "@nick/clsx";` and type inputs as `unknown[]`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/cn.ts
git commit -m "feat(ui): add cn() class-merge helper"
```

---

## Task 2: `Price` primitive

**Files:**
- Create: `components/ui/Price.tsx`
- Test: `components/ui/Price_test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Price } from "@/components/ui/Price.tsx";

Deno.test("Price renders an exact euro amount", () => {
  const html = renderToString(<Price cents={1800} />);
  assert(html.includes("18 €"), "exact price missing");
});

Deno.test("Price with from prefix renders 'ab'", () => {
  const html = renderToString(<Price cents={1800} from />);
  assert(html.includes("ab 18 €"), "from price missing");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test components/ui/Price_test.tsx -A`
Expected: FAIL — module `Price.tsx` not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
import { formatEuro, formatFrom } from "@/lib/price.ts";
import { cn } from "@/components/ui/cn.ts";

export function Price(
  { cents, from = false, class: cls }: {
    cents: number;
    from?: boolean;
    class?: string;
  },
) {
  return (
    <span class={cn("font-semibold tracking-tight", cls)}>
      {from ? formatFrom(cents) : formatEuro(cents)}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test components/ui/Price_test.tsx -A`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Price.tsx components/ui/Price_test.tsx
git commit -m "feat(ui): add Price primitive"
```

---

## Task 3: `Button` primitive

**Files:**
- Create: `components/ui/Button.tsx`
- Test: `components/ui/Button_test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Button } from "@/components/ui/Button.tsx";

Deno.test("Button renders label and primary classes by default", () => {
  const html = renderToString(<Button>Kaufen</Button>);
  assert(html.includes("Kaufen"), "label missing");
  assert(html.includes("bg-[var(--ink)]"), "primary background missing");
});

Deno.test("Button secondary variant is outlined", () => {
  const html = renderToString(<Button variant="secondary">X</Button>);
  assert(html.includes("border"), "secondary border missing");
});

Deno.test("Button can render as an anchor", () => {
  const html = renderToString(<Button as="a" href="/x">Link</Button>);
  assert(html.includes("<a"), "anchor not rendered");
  assert(html.includes('href="/x"'), "href missing");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test components/ui/Button_test.tsx -A`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
import { type ComponentChildren, type JSX } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn.ts";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ink)] text-white hover:bg-black",
        secondary:
          "border border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--surface-muted)]",
        ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--surface-muted)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps =
  & VariantProps<typeof button>
  & {
    children: ComponentChildren;
    class?: string;
  }
  & (
    | ({ as?: "button" } & JSX.IntrinsicElements["button"])
    | ({ as: "a" } & JSX.IntrinsicElements["a"])
  );

export function Button(props: ButtonProps) {
  const { variant, size, class: cls, children, as, ...rest } = props;
  const cn_ = cn(button({ variant, size }), cls);
  if (as === "a") {
    return (
      <a class={cn_} {...rest as JSX.IntrinsicElements["a"]}>{children}</a>
    );
  }
  return (
    <button class={cn_} {...rest as JSX.IntrinsicElements["button"]}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test components/ui/Button_test.tsx -A`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx components/ui/Button_test.tsx
git commit -m "feat(ui): add Button primitive (cva)"
```

---

## Task 4: `Badge` primitive

**Files:**
- Create: `components/ui/Badge.tsx`
- Test: `components/ui/Badge_test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import { Badge } from "@/components/ui/Badge.tsx";

Deno.test("Badge renders children", () => {
  const html = renderToString(<Badge>Vase</Badge>);
  assert(html.includes("Vase"), "badge label missing");
});

Deno.test("Badge accent variant uses accent color", () => {
  const html = renderToString(<Badge variant="accent">Neu</Badge>);
  assert(html.includes("var(--accent)"), "accent color missing");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test components/ui/Badge_test.tsx -A`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
import { type ComponentChildren } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn.ts";

const badge = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        category:
          "border border-[var(--line)] bg-white/90 text-[var(--ink)]",
        accent: "bg-[var(--accent)] text-white",
        muted: "bg-[var(--surface-muted)] text-[var(--muted)]",
        stock: "bg-[var(--surface-muted)] text-[var(--muted)] normal-case tracking-normal",
      },
    },
    defaultVariants: { variant: "category" },
  },
);

export function Badge(
  { variant, class: cls, children }: VariantProps<typeof badge> & {
    class?: string;
    children: ComponentChildren;
  },
) {
  return <span class={cn(badge({ variant }), cls)}>{children}</span>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test components/ui/Badge_test.tsx -A`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Badge.tsx components/ui/Badge_test.tsx
git commit -m "feat(ui): add Badge primitive (cva)"
```

---

## Task 5: New design tokens + base classes (`assets/styles.css`)

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Replace the `:root` block and remove textures**

Replace the `:root { ... }` declaration (currently lines ~41–55) with:

```css
:root {
  color: #171717;
  background: #ffffff;
  font-family: "Anaheim", sans-serif;
  font-size: 16px;
  line-height: 1.55;
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-muted: #f6f6f4;
  --ink: #171717;
  --muted: #6b7280;
  --accent: #b55732;
  --line: #e5e5e5;
  --radius: 12px;
}
```

Replace the `body { ... }` block (the multi-layer gradient background) with:

```css
body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  background: var(--bg);
}
```

Delete the entire `body::before { ... }` rule (the noise overlay).

- [ ] **Step 2: Restyle base component classes**

Update `.button` to the clean style (Ink fill, soft radius):

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 3rem;
  padding: 0.78rem 1.25rem;
  border: 1px solid var(--ink);
  border-radius: 8px;
  color: #fff;
  background: var(--ink);
  font-weight: 600;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.button:hover {
  transform: translateY(-1px);
  background: #000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.button.secondary {
  color: var(--ink);
  background: transparent;
}

.button.secondary:hover {
  background: var(--surface-muted);
}
```

Update `.card`, `.product-card`, `.product-badge`, `.category-chip`, `.field`,
`.shop-heading__meta`, `.shop-filter-bar`, `.pill`, `.section` so they use the new
tokens and a clean look. Apply these replacements:

```css
.card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.product-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: #d4d4d4;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.product-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  align-items: center;
  min-height: 1.9rem;
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.92);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  backdrop-filter: blur(4px);
}

.product-link {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
  padding: 0.72rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-weight: 600;
  transition: background 160ms ease, border-color 160ms ease;
}

.product-link:hover {
  background: var(--surface-muted);
  border-color: #d4d4d4;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: var(--surface);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease, border-color 140ms ease;
}

.category-chip:hover {
  border-color: #d4d4d4;
  background: var(--surface-muted);
}

.category-chip.is-active {
  border-color: var(--ink);
  color: #fff;
  background: var(--ink);
}

.field {
  width: 100%;
  min-height: 3.1rem;
  padding: 0.8rem 0.92rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
}

.field:focus {
  outline: 2px solid rgba(181, 87, 50, 0.3);
  border-color: var(--accent);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.52rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
}

.shop-heading__meta {
  display: grid;
  min-width: min(100%, 22rem);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.shop-heading__meta span {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--line);
  font-weight: 600;
}

.shop-heading__meta span:last-child {
  border-bottom: 0;
}

.shop-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0.65rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.section {
  padding: clamp(3.5rem, 7vw, 6rem) 0;
  border-top: 1px solid var(--line);
}

.display {
  font-family: "ClashDisplay", sans-serif;
  line-height: 1.02;
  letter-spacing: -0.01em;
}
```

Also update `::selection` to `background: var(--accent)`. Leave the
`.viewer-*`, `.file-dropzone*`, `.status-dot*`, `.maker-grid` rules as-is except
swapping any hard-coded paper color `#f4f0e6` in `.viewer-canvas` for `#f6f6f4` and
removing its grid-line layers if trivial (otherwise leave — viewer is out of scope).

- [ ] **Step 3: Format + type-check + run all tests**

Run: `deno task check && deno test -A`
Expected: fmt/lint/check pass; existing tests still PASS.

- [ ] **Step 4: Visual check**

Run dev server (`deno task dev`), open `http://localhost:5173/`. Confirm: white
background, no noise/grid texture, black buttons, clean cards.

- [ ] **Step 5: Commit**

```bash
git add assets/styles.css
git commit -m "feat(design): clean-modern token set, remove paper/noise texture"
```

---

## Task 6: Restyle `ProductCard`

**Files:**
- Modify: `components/ProductCard.tsx`
- Test: `components/ProductCard_test.tsx` (must keep passing)

- [ ] **Step 1: Confirm existing card tests still describe required output**

The tests assert the card includes `"MBK Blank Set"`, `"ab 18 €"`, `"Keycaps"`,
and does NOT include `"secret-123"`. The restyle must preserve all four.

- [ ] **Step 2: Rewrite the card using `Price` and `Badge`**

```tsx
import type { Product } from "@/lib/catalog.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import { Price } from "@/components/ui/Price.tsx";
import { Badge } from "@/components/ui/Badge.tsx";

const COLOR_HEX: Record<string, string> = {
  Charcoal: "#28313b",
  Clay: "#b55732",
  Sage: "#708468",
  Bone: "#f4f0e6",
};

function variantColors(product: Product): { name: string; hex: string }[] {
  const names = new Set<string>();
  for (const variant of product.variants) {
    const name = variant.attributes["Farbe"];
    if (name) names.add(name);
  }
  return [...names].map((name) => ({
    name,
    hex: COLOR_HEX[name] ?? "#28313b",
  }));
}

export default function ProductCard({ product }: { product: Product }) {
  const colors = variantColors(product);
  return (
    <article class="product-card group">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
          <img
            src={product.images[0]}
            alt={product.name}
            class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span class="product-badge">{categoryLabel(product.category)}</span>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold tracking-tight">{product.name}</h3>
          <p class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
            {product.description}
          </p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <Price cents={product.fromPriceCents} from class="text-lg" />
            <span class="text-xs text-[var(--muted)]">{product.leadTime}</span>
          </div>
          {colors.length > 0 && (
            <div
              class="mt-4 flex gap-1.5"
              role="group"
              aria-label="Farbvarianten"
            >
              {colors.map((color) => (
                <span
                  key={color.name}
                  role="img"
                  title={color.name}
                  aria-label={color.name}
                  class="h-3.5 w-3.5 rounded-full border border-[var(--line)]"
                  style={`background:${color.hex}`}
                />
              ))}
            </div>
          )}
          <span class="product-link">Produkt ansehen</span>
        </div>
      </a>
    </article>
  );
}
```

- [ ] **Step 3: Run card tests**

Run: `deno test components/ProductCard_test.tsx -A`
Expected: PASS (2 tests — name/price/category present, no channel leak).

- [ ] **Step 4: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat(shop): clean ProductCard using Price/Badge primitives"
```

---

## Task 7: Restyle `SiteNav` (shop-first, reserved cart slot)

**Files:**
- Modify: `components/SiteNav.tsx`

- [ ] **Step 1: Rewrite the nav**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `deno check components/SiteNav.tsx`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/SiteNav.tsx
git commit -m "feat(nav): clean shop-first nav with reserved cart slot"
```

---

## Task 8: Restyle `SiteFooter` (demote Blog/About/Portfolio)

**Files:**
- Modify: `components/SiteFooter.tsx`

- [ ] **Step 1: Rewrite the footer**

```tsx
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
          <a class="mt-3 block text-sm hover:text-[var(--accent)]" href="/">
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
          <a class="mt-2 block text-sm hover:text-[var(--accent)]" href="/about">
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
```

- [ ] **Step 2: Type-check**

Run: `deno check components/SiteFooter.tsx`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/SiteFooter.tsx
git commit -m "feat(footer): clean footer, demote blog/about into footer nav"
```

---

## Task 9: Restyle home storefront (`routes/index.tsx`)

**Files:**
- Modify: `routes/index.tsx`

- [ ] **Step 1: Replace the `Featured` component and page body**

Keep the existing `handler`, `STOREFRONT_DESC`, and `Head` block unchanged.
Replace the `Featured` function and the JSX returned by `Home` (everything inside
the `<>...</>` after `</Head>`). New `Featured`:

```tsx
function Featured({ product }: { product: Product }) {
  return (
    <a
      href={`/shop/${product.slug}`}
      class="card group grid overflow-hidden md:grid-cols-2"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)] md:aspect-auto">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <span class="product-badge">{categoryLabel(product.category)}</span>
      </div>
      <div class="flex flex-col justify-center gap-4 p-8 md:p-10">
        <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          Diesen Monat
        </p>
        <h2 class="display text-3xl font-semibold md:text-5xl">
          {product.name}
        </h2>
        <p class="max-w-md text-[var(--muted)]">{product.description}</p>
        <Price cents={product.fromPriceCents} from class="text-lg" />
      </div>
    </a>
  );
}
```

New body (replace the two `<section>` blocks):

```tsx
<section class="shell py-10 md:py-14">
  <div class="shop-heading mb-8">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        3D Print Studio · Stuttgart
      </p>
      <h1 class="display mt-3 max-w-3xl text-4xl font-semibold md:text-6xl">
        3D-gedruckte Objekte, in kleinen Serien.
      </h1>
      <p class="mt-4 max-w-xl text-[var(--muted)]">
        Vasen, Planter und Keycaps für Choc-LP-Switches. Klare Objekte,
        sauber gedruckt — direkt aus der Werkstatt.
      </p>
      <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
        <span>✓ Versand in 2–5 Werktagen</span>
        <span>✓ Sichere Zahlung</span>
        <span>✓ Kleine Serien</span>
      </div>
    </div>
    <div class="shop-heading__meta" aria-label="Shop Informationen">
      <span>{products.length} Produkte</span>
      <span>2–5 Werktage</span>
      <span>Kleine Serien</span>
    </div>
  </div>

  {featured && <Featured product={featured} />}

  <div class="mt-12">
    <ShopFilter products={products} />
  </div>
</section>

<section class="section">
  <div class="shell shop-service-band">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        Druckauftrag
      </p>
      <h2 class="display mt-3 text-2xl font-semibold md:text-4xl">
        Eigenes Modell drucken lassen.
      </h2>
      <p class="mt-3 max-w-2xl text-[var(--muted)]">
        Modell hochladen, Material und Anforderungen erfassen. Ich prüfe
        Geometrie, Fertigungsrisiken und sinnvolle Einstellungen vor dem Druck.
      </p>
    </div>
    <a href="/printauftrag" class="button shrink-0">Druckauftrag starten</a>
  </div>
</section>
```

- [ ] **Step 2: Add the `Price` import**

At the top, add: `import { Price } from "@/components/ui/Price.tsx";`
(Keep `categoryLabel` / `type Product` imports; the `formatFrom` import can stay
or be removed if now unused — run check to confirm.)

- [ ] **Step 3: Format, type-check, test**

Run: `deno task check && deno test -A`
Expected: all pass. If lint flags an unused `formatFrom` import, remove it.

- [ ] **Step 4: Visual check**

Open `/` — slim hero, trust ticks, featured card, product grid, print band.

- [ ] **Step 5: Commit**

```bash
git add routes/index.tsx
git commit -m "feat(home): clean storefront hero + trust strip"
```

---

## Task 10: Restyle product detail (`routes/shop/[slug].tsx` + `islands/ProductDetail.tsx`)

**Files:**
- Modify: `routes/shop/[slug].tsx`
- Modify: `islands/ProductDetail.tsx`

- [ ] **Step 1: Tone down the detail heading**

In `routes/shop/[slug].tsx`, replace the back-link + `<h1>` block:

```tsx
<a href="/" class="text-sm font-medium text-[var(--accent)] hover:underline">
  ← Zurück zum Shop · {categoryLabel(product.category)}
</a>
<h1 class="display mt-4 mb-8 text-4xl font-semibold md:text-6xl">
  {product.name}
</h1>
```

(Leave handler, JSON-LD, specs table, and `<Head>` unchanged.)

- [ ] **Step 2: Restyle `ProductDetail` island**

Replace the price + variant + actions section (keep image gallery logic). The
"In den Warenkorb" button stays `disabled` (Phase 2 enables it):

```tsx
<div>
  <p class="text-3xl font-semibold tracking-tight">
    {variant ? formatEuro(variant.priceCents) : ""}
  </p>
  <p class="mt-1 text-sm text-[var(--muted)]">inkl. MwSt. · zzgl. Versand</p>
  {product.variants.length > 0 && (
    <div class="mt-6">
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
        Variante
      </p>
      <div class="mt-2 flex flex-wrap gap-2">
        {product.variants.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => (selectedVariant.value = i)}
            aria-pressed={selectedVariant.value === i}
            class={`category-chip ${
              selectedVariant.value === i ? "is-active" : ""
            }`}
          >
            {v.label} · {formatEuro(v.priceCents)}
          </button>
        ))}
      </div>
    </div>
  )}
  <div class="mt-8 flex flex-wrap gap-3">
    <button type="button" class="button" disabled title="Warenkorb folgt">
      In den Warenkorb
    </button>
    <a href="/printauftrag" class="button secondary">Ähnliches anfragen</a>
  </div>
  <p class="mt-4 text-sm text-[var(--muted)]">
    Versand in 2–5 Werktagen · sichere Zahlung
  </p>
</div>
```

- [ ] **Step 3: Format, type-check, test**

Run: `deno task check && deno test -A`
Expected: all pass.

- [ ] **Step 4: Visual check**

Open a product (`/shop/<any-slug>`) — clean gallery, prominent price, variant
chips, disabled cart button, shipping note.

- [ ] **Step 5: Commit**

```bash
git add routes/shop/[slug].tsx islands/ProductDetail.tsx
git commit -m "feat(detail): clean product detail layout"
```

---

## Task 11: Light pass on `ShopFilter` island

**Files:**
- Modify: `islands/ShopFilter.tsx`

- [ ] **Step 1: Update group headings + range accent**

Change the group `<h2>` class from `display text-3xl font-semibold` to
`text-xl font-semibold tracking-tight`. The chips/fields already inherit the new
CSS, so no further markup change is required. The range input keeps
`class="accent-[var(--accent)]"` (already accent-driven; `--clay` token was renamed
to `--accent` — update the class from `accent-[var(--clay)]` to
`accent-[var(--accent)]`).

- [ ] **Step 2: Format, type-check, test**

Run: `deno task check && deno test -A`
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add islands/ShopFilter.tsx
git commit -m "feat(shop): align ShopFilter headings with clean design"
```

---

## Task 12: Repo-wide token sweep + final verification

**Files:**
- Modify: any remaining files referencing removed tokens (`--clay`, `--paper`,
  `--steel`, `--oxide`, `--sage`, `--lime`).

- [ ] **Step 1: Find stale token references**

Run: `grep -rn "var(--clay)\|var(--paper)\|var(--steel)\|var(--oxide)\|var(--sage)\|var(--lime)" routes components islands`
Expected: a list of remaining usages (e.g. in `printauftrag`, `blog`, `about`,
`_error`, `PrintRequestForm`, viewer components).

- [ ] **Step 2: Replace stale tokens**

For each match outside the 3D viewer (`PrintModelWorkbench`, `PrintModelController`,
`VariantEditor` viewer canvas — leave those), map:
`--clay → --accent`, `--paper → --surface` (or `#fff`), `--steel → --surface-muted`,
`--oxide → --accent`, `--sage → --muted`. Edit each file accordingly so nothing
references an undefined token.

- [ ] **Step 3: Re-add viewer tokens if still used**

If the 3D viewer files still need `--steel`/`--clay`, append a scoped fallback at
the end of `:root` in `assets/styles.css`:

```css
:root {
  --steel: #28313b;
  --clay: #b55732;
  --sage: #708468;
}
```

(Only include the tokens that grep showed are still referenced by viewer code.)

- [ ] **Step 4: Full verification**

Run: `deno task check && deno test -A`
Expected: fmt/lint/check clean, ALL tests PASS.

- [ ] **Step 5: Visual smoke test of every public route**

Open in dev server: `/`, `/shop/<slug>`, `/printauftrag`, `/blog`,
`/blog/<slug>`, `/about`, `/imprint`. Confirm consistent clean look, no broken
colors, no leftover texture.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(design): sweep stale color tokens to clean palette"
```

---

## Done Criteria

- White, texture-free design across all public routes.
- Black primary CTAs, clay accent only as highlight, soft shadows, clean cards.
- Reusable `Button`/`Badge`/`Price` primitives back the shop UI.
- Nav is shop-first with a reserved (non-functional) cart slot; Blog/About live in
  the footer.
- `deno task check` and `deno test -A` both green.
- No business logic, routes, or data flows changed; cart button still disabled.
