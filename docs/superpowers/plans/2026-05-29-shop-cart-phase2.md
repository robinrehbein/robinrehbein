# Shop Cart — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Steps use `- [ ]` checkboxes.

**Goal:** A working client-side shopping cart — add from the product detail page
(with variant) and via quick-add on cards, view/edit it in a slide-over drawer with
a live count badge in the nav, persisted across reloads.

**Architecture:** Pure cart math lives in `lib/cart.ts` (no DOM/signals, fully
unit-tested). A shared `lib/cart-store.ts` holds module-level `@preact/signals`
that every island imports (singletons in the client bundle), plus `localStorage`
persistence. `CartButton` (in the nav) and a globally-mounted `CartDrawer`
(in `_layout.tsx`) are islands; `ProductDetail` and `ProductCard` call store
actions. The Stripe checkout button is present but disabled (Phase 3).

**Tech Stack:** Fresh 2.2, Preact, `@preact/signals`, Deno tests.

---

## File Structure

- Create `lib/cart.ts` (+ `lib/cart_test.ts`) — `CartLine` type + pure functions.
- Create `lib/cart-store.ts` — shared signals, persistence, actions.
- Create `islands/CartButton.tsx` — nav cart icon + count, opens drawer.
- Create `islands/CartDrawer.tsx` — slide-over panel.
- Modify `components/SiteNav.tsx` — replace static cart span with `CartButton`.
- Modify `routes/_layout.tsx` — mount `CartDrawer` globally.
- Modify `islands/ProductDetail.tsx` — enable add-to-cart for selected variant.
- Modify `components/ProductCard.tsx` — quick-add button (first variant).

---

## Task 1: Pure cart logic (`lib/cart.ts`)

**Files:**
- Create: `lib/cart.ts`
- Test: `lib/cart_test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { assertEquals } from "@std/assert";
import {
  addLine,
  type CartLine,
  cartCount,
  cartTotalCents,
  removeLine,
  setQty,
} from "@/lib/cart.ts";

const line = (over: Partial<CartLine> = {}): CartLine => ({
  slug: "vase-x",
  variantId: "charcoal",
  name: "Vase X",
  variantLabel: "Charcoal",
  priceCents: 2000,
  image: "/x.jpg",
  qty: 1,
  ...over,
});

Deno.test("addLine merges same slug+variant by incrementing qty", () => {
  const a = addLine([], line());
  const b = addLine(a, line({ qty: 2 }));
  assertEquals(b.length, 1);
  assertEquals(b[0].qty, 3);
});

Deno.test("addLine keeps different variants separate", () => {
  const a = addLine([], line());
  const b = addLine(a, line({ variantId: "sage" }));
  assertEquals(b.length, 2);
});

Deno.test("cartCount sums quantities", () => {
  const lines = addLine(addLine([], line({ qty: 2 })), line({ variantId: "y" }));
  assertEquals(cartCount(lines), 3);
});

Deno.test("cartTotalCents sums price * qty", () => {
  const lines = [line({ qty: 2, priceCents: 2000 }), line({
    variantId: "y",
    priceCents: 500,
  })];
  assertEquals(cartTotalCents(lines), 4500);
});

Deno.test("setQty updates a line", () => {
  const lines = setQty([line()], "vase-x", "charcoal", 5);
  assertEquals(lines[0].qty, 5);
});

Deno.test("setQty to 0 removes the line", () => {
  const lines = setQty([line()], "vase-x", "charcoal", 0);
  assertEquals(lines.length, 0);
});

Deno.test("removeLine drops the matching line only", () => {
  const lines = removeLine([line(), line({ variantId: "y" })], "vase-x", "y");
  assertEquals(lines.length, 1);
  assertEquals(lines[0].variantId, "charcoal");
});
```

- [ ] **Step 2: Run to verify failure**

Run: `deno test lib/cart_test.ts -A`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/cart.ts`**

```ts
/** A single line in the cart — a snapshot taken at add-time for display. */
export type CartLine = {
  slug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  image: string;
  qty: number;
};

const keyOf = (slug: string, variantId: string) => `${slug}::${variantId}`;

/** Total number of items (sum of quantities). */
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

/** Sum of price * quantity across all lines, in cents. */
export function cartTotalCents(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.priceCents * l.qty, 0);
}

/** Add a line, merging into an existing slug+variant by incrementing qty. */
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const key = keyOf(line.slug, line.variantId);
  if (lines.some((l) => keyOf(l.slug, l.variantId) === key)) {
    return lines.map((l) =>
      keyOf(l.slug, l.variantId) === key ? { ...l, qty: l.qty + line.qty } : l
    );
  }
  return [...lines, line];
}

/** Set a line's quantity; a qty <= 0 removes the line. */
export function setQty(
  lines: CartLine[],
  slug: string,
  variantId: string,
  qty: number,
): CartLine[] {
  if (qty <= 0) return removeLine(lines, slug, variantId);
  const key = keyOf(slug, variantId);
  return lines.map((l) =>
    keyOf(l.slug, l.variantId) === key ? { ...l, qty } : l
  );
}

/** Remove the line matching slug+variant. */
export function removeLine(
  lines: CartLine[],
  slug: string,
  variantId: string,
): CartLine[] {
  const key = keyOf(slug, variantId);
  return lines.filter((l) => keyOf(l.slug, l.variantId) !== key);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `deno test lib/cart_test.ts -A`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/cart.ts lib/cart_test.ts
git commit -m "feat(cart): pure cart logic (add/merge/qty/remove/totals)"
```

---

## Task 2: Shared cart store (`lib/cart-store.ts`)

**Files:**
- Create: `lib/cart-store.ts`

- [ ] **Step 1: Implement the store**

```ts
import { computed, effect, signal } from "@preact/signals";
import {
  addLine,
  type CartLine,
  cartCount,
  cartTotalCents,
  removeLine,
  setQty,
} from "@/lib/cart.ts";

const STORAGE_KEY = "rr3d-cart";

function load(): CartLine[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as CartLine[] : [];
  } catch (err) {
    console.warn("Cart konnte nicht aus localStorage gelesen werden:", err);
    return [];
  }
}

export const cartLines = signal<CartLine[]>(load());
export const cartOpen = signal(false);
export const count = computed(() => cartCount(cartLines.value));
export const totalCents = computed(() => cartTotalCents(cartLines.value));

// Persist on every change — client only.
if (typeof document !== "undefined") {
  effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartLines.value));
  });
}

export function addToCart(line: CartLine): void {
  cartLines.value = addLine(cartLines.value, line);
}

export function updateQty(slug: string, variantId: string, qty: number): void {
  cartLines.value = setQty(cartLines.value, slug, variantId, qty);
}

export function removeFromCart(slug: string, variantId: string): void {
  cartLines.value = removeLine(cartLines.value, slug, variantId);
}

export function openCart(): void {
  cartOpen.value = true;
}

export function closeCart(): void {
  cartOpen.value = false;
}
```

- [ ] **Step 2: Type-check**

Run: `deno check lib/cart-store.ts`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/cart-store.ts
git commit -m "feat(cart): shared signal store with localStorage persistence"
```

---

## Task 3: `CartButton` island

**Files:**
- Create: `islands/CartButton.tsx`

- [ ] **Step 1: Implement**

```tsx
import { count, openCart } from "@/lib/cart-store.ts";

export default function CartButton() {
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Warenkorb öffnen"
      class="relative grid size-10 place-items-center rounded-lg border border-[var(--line)] text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
    >
      <span aria-hidden="true">🛒</span>
      {count.value > 0 && (
        <span class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-xs font-bold text-white">
          {count.value}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `deno check islands/CartButton.tsx`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add islands/CartButton.tsx
git commit -m "feat(cart): nav cart button with live count"
```

---

## Task 4: `CartDrawer` island

**Files:**
- Create: `islands/CartDrawer.tsx`

- [ ] **Step 1: Implement**

```tsx
import {
  cartLines,
  cartOpen,
  closeCart,
  removeFromCart,
  totalCents,
  updateQty,
} from "@/lib/cart-store.ts";
import { formatEuro } from "@/lib/price.ts";

export default function CartDrawer() {
  const open = cartOpen.value;
  const lines = cartLines.value;
  return (
    <div
      class={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={open ? "false" : "true"}
    >
      <div
        onClick={closeCart}
        class={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        class={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Warenkorb"
      >
        <header class="flex items-center justify-between border-b border-[var(--line)] p-5">
          <h2 class="text-lg font-semibold tracking-tight">Warenkorb</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Schließen"
            class="grid size-9 place-items-center rounded-lg hover:bg-[var(--surface-muted)]"
          >
            ✕
          </button>
        </header>

        <div class="flex-1 overflow-y-auto p-5">
          {lines.length === 0
            ? (
              <p class="mt-10 text-center text-[var(--muted)]">
                Dein Warenkorb ist leer.
              </p>
            )
            : (
              <ul class="flex flex-col gap-4">
                {lines.map((l) => (
                  <li
                    key={`${l.slug}::${l.variantId}`}
                    class="flex gap-3 border-b border-[var(--line)] pb-4"
                  >
                    <img
                      src={l.image}
                      alt=""
                      class="size-16 rounded-lg border border-[var(--line)] object-cover"
                    />
                    <div class="flex-1">
                      <p class="font-semibold leading-tight">{l.name}</p>
                      <p class="text-sm text-[var(--muted)]">{l.variantLabel}</p>
                      <div class="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Menge verringern"
                          onClick={() =>
                            updateQty(l.slug, l.variantId, l.qty - 1)}
                          class="grid size-7 place-items-center rounded border border-[var(--line)] hover:bg-[var(--surface-muted)]"
                        >
                          −
                        </button>
                        <span class="min-w-6 text-center text-sm font-semibold">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Menge erhöhen"
                          onClick={() =>
                            updateQty(l.slug, l.variantId, l.qty + 1)}
                          class="grid size-7 place-items-center rounded border border-[var(--line)] hover:bg-[var(--surface-muted)]"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(l.slug, l.variantId)}
                          class="ml-auto text-sm text-[var(--muted)] hover:text-[var(--accent)]"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                    <span class="font-semibold">
                      {formatEuro(l.priceCents * l.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <footer class="border-t border-[var(--line)] p-5">
          <div class="flex items-center justify-between">
            <span class="text-[var(--muted)]">Zwischensumme</span>
            <span class="text-lg font-semibold">
              {formatEuro(totalCents.value)}
            </span>
          </div>
          <p class="mt-1 text-xs text-[var(--muted)]">
            inkl. MwSt. · zzgl. Versand
          </p>
          <button
            type="button"
            class="button mt-4 w-full"
            disabled={lines.length === 0}
            title="Checkout folgt in Phase 3"
          >
            Zur Kasse
          </button>
        </footer>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `deno check islands/CartDrawer.tsx`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add islands/CartDrawer.tsx
git commit -m "feat(cart): slide-over cart drawer with qty controls"
```

---

## Task 5: Wire nav + layout

**Files:**
- Modify: `components/SiteNav.tsx`
- Modify: `routes/_layout.tsx`

- [ ] **Step 1: Replace the static cart span in `SiteNav.tsx`**

Add at the top: `import CartButton from "@/islands/CartButton.tsx";`

Replace the cart-slot `<span ...>🛒</span>` block with:

```tsx
<div class="hidden md:block">
  <CartButton />
</div>
```

- [ ] **Step 2: Mount the drawer in `routes/_layout.tsx`**

```tsx
import { type PageProps } from "fresh";
import SiteFooter from "@/components/SiteFooter.tsx";
import SiteNav from "@/components/SiteNav.tsx";
import CartDrawer from "@/islands/CartDrawer.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <SiteNav />
      <main>
        <Component />
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `deno check components/SiteNav.tsx routes/_layout.tsx`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/SiteNav.tsx routes/_layout.tsx
git commit -m "feat(cart): mount cart button in nav and drawer globally"
```

---

## Task 6: Enable add-to-cart on product detail

**Files:**
- Modify: `islands/ProductDetail.tsx`

- [ ] **Step 1: Import store actions**

Add: `import { addToCart, openCart } from "@/lib/cart-store.ts";`

- [ ] **Step 2: Replace the disabled cart button**

Replace the `<button ... disabled title="Warenkorb folgt">In den Warenkorb</button>`
with an enabled handler (uses the already-selected `variant`):

```tsx
<button
  type="button"
  class="button"
  disabled={!variant}
  onClick={() => {
    if (!variant) return;
    addToCart({
      slug: product.slug,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      priceCents: variant.priceCents,
      image: variant.image ?? product.images[0],
      qty: 1,
    });
    openCart();
  }}
>
  In den Warenkorb
</button>
```

- [ ] **Step 3: Type-check**

Run: `deno check islands/ProductDetail.tsx`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add islands/ProductDetail.tsx
git commit -m "feat(cart): add-to-cart from product detail"
```

---

## Task 7: Quick-add on product cards

**Files:**
- Modify: `components/ProductCard.tsx`
- Test: `components/ProductCard_test.tsx` (must keep passing)

ProductCard renders inside the `ShopFilter` island, so its click handler hydrates.
The quick-add uses the first variant and must not trigger the card's link.

- [ ] **Step 1: Add the store import**

Add: `import { addToCart, openCart } from "@/lib/cart-store.ts";`

- [ ] **Step 2: Add a quick-add button inside the card body**

Replace the `<span class="product-link">Produkt ansehen</span>` line with:

```tsx
<div class="mt-4 flex gap-2">
  <span class="product-link flex-1">Ansehen</span>
  {product.variants[0] && (
    <button
      type="button"
      aria-label={`${product.name} in den Warenkorb`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const v = product.variants[0];
        addToCart({
          slug: product.slug,
          variantId: v.id,
          name: product.name,
          variantLabel: v.label,
          priceCents: v.priceCents,
          image: v.image ?? product.images[0],
          qty: 1,
        });
        openCart();
      }}
      class="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[var(--ink)] text-lg text-white transition hover:bg-black"
    >
      +
    </button>
  )}
</div>
```

- [ ] **Step 3: Run card tests**

Run: `deno test components/ProductCard_test.tsx -A`
Expected: PASS (still finds name/price/category, no channel leak).

- [ ] **Step 4: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat(cart): quick-add button on product cards"
```

---

## Task 8: Full verification

- [ ] **Step 1: Check + test**

Run: `deno task check && deno task test`
Expected: fmt/lint/check clean, all tests PASS.

- [ ] **Step 2: Manual smoke test (dev server)**

Open `/`: click a card's `+` → drawer opens, badge shows 1. Open a product,
choose a variant, "In den Warenkorb" → drawer shows the right variant/price.
Change qty with ±, remove a line, reload page → cart persists.

- [ ] **Step 3: Commit any fixups**

```bash
git add -A
git commit -m "test(cart): phase 2 verification fixups"
```

---

## Done Criteria

- Add to cart from detail (selected variant) and from card quick-add (first variant).
- Slide-over drawer with qty +/- , remove, subtotal; nav badge shows live count.
- Cart persists across reloads via `localStorage`.
- `deno task check` and `deno task test` green.
- "Zur Kasse" present but disabled (Phase 3 wires Stripe checkout).
