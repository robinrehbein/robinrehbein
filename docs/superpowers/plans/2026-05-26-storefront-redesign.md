# Storefront-Redesign (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the portfolio-first homepage into a product-first storefront — products front and center, a live category filter, self-marketing moved aside, and the "Marketplace ready" jargon removed.

**Architecture:** Pure frontend change on Fresh 2.x. Extract category-filter logic into a pure, unit-tested helper (`lib/shop.ts`). A small island (`islands/ShopFilter.tsx`) renders filter pills + product grid using that helper. The homepage (`routes/index.tsx`) becomes a compact shop header + the filter island + a slim custom-print CTA + a slim about teaser. `/shop` redirects to `/`. `ProductCard` is reworked to be sales-oriented (no internal SKU).

**Tech Stack:** Deno, Fresh 2.2, Preact, `@preact/signals`, Tailwind 4. Tests via Deno's built-in test runner + `preact-render-to-string`.

---

### Task 1: Add test task + render-to-string dependency

**Files:**
- Modify: `deno.json`

- [ ] **Step 1: Add a `test` task and the `preact-render-to-string` import**

In `deno.json`, add a `test` task to the `tasks` object (keep existing `check`, `dev`, `build`, `start`):

```json
    "test": "deno test -A"
```

In the `imports` object, add (place near the other preact entries):

```json
    "preact-render-to-string": "npm:preact-render-to-string@^6.6.2",
```

- [ ] **Step 2: Verify Deno resolves the new dependency**

Run: `deno run -A -e "import { renderToString } from 'preact-render-to-string'; console.log(typeof renderToString)"`
Expected: prints `function` (npm package downloaded, no errors).

- [ ] **Step 3: Commit**

```bash
git add deno.json
git commit -m "chore: add deno test task and preact-render-to-string dep"
```

---

### Task 2: Pure category-filter helpers (`lib/shop.ts`)

**Files:**
- Create: `lib/shop.ts`
- Test: `lib/shop_test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/shop_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import { categoriesOf, filterByCategory } from "@/lib/shop.ts";
import type { Product } from "@/lib/content.ts";

function p(slug: string, category: string): Product {
  return {
    slug,
    name: slug,
    category,
    price: "ab 1 EUR",
    leadTime: "1 Tag",
    material: [],
    finish: "",
    description: "",
    image: "/x.jpg",
    marketplace: { etsyListingId: "", sku: "", embedUrl: "" },
  };
}

Deno.test("categoriesOf returns unique categories in first-seen order", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen"), p("c", "Vase")];
  assertEquals(categoriesOf(products), ["Vase", "Pflanzen"]);
});

Deno.test("filterByCategory returns all products for 'Alle'", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen")];
  assertEquals(filterByCategory(products, "Alle").length, 2);
});

Deno.test("filterByCategory filters to one category", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen"), p("c", "Vase")];
  const result = filterByCategory(products, "Vase");
  assertEquals(result.map((x) => x.slug), ["a", "c"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A lib/shop_test.ts`
Expected: FAIL — module `lib/shop.ts` not found / `categoriesOf` undefined.

- [ ] **Step 3: Write minimal implementation**

Create `lib/shop.ts`:

```ts
import type { Product } from "@/lib/content.ts";

/** Unique product categories in first-seen order. */
export function categoriesOf(products: Product[]): string[] {
  const seen = new Set<string>();
  for (const product of products) seen.add(product.category);
  return [...seen];
}

/** Filter products by category. The sentinel "Alle" returns everything. */
export function filterByCategory(
  products: Product[],
  category: string,
): Product[] {
  if (category === "Alle") return products;
  return products.filter((product) => product.category === category);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A lib/shop_test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/shop.ts lib/shop_test.ts
git commit -m "feat: add pure category-filter helpers for shop"
```

---

### Task 3: Rework ProductCard (remove SKU, add category badge, sales layout)

**Files:**
- Modify: `components/ProductCard.tsx`
- Test: `components/ProductCard_test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ProductCard_test.tsx`:

```tsx
import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import ProductCard from "@/components/ProductCard.tsx";
import { products } from "@/lib/content.ts";

Deno.test("ProductCard does not expose the internal SKU", () => {
  const product = products[0];
  const html = renderToString(<ProductCard product={product} />);
  assert(
    !html.includes(product.marketplace.sku),
    `SKU "${product.marketplace.sku}" leaked into product card`,
  );
});

Deno.test("ProductCard shows price, name and category", () => {
  const product = products[0];
  const html = renderToString(<ProductCard product={product} />);
  assert(html.includes(product.price), "price missing");
  assert(html.includes(product.name), "name missing");
  assert(html.includes(product.category), "category missing");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A components/ProductCard_test.tsx`
Expected: FAIL — current card renders `product.marketplace.sku` (the "does not expose SKU" test fails).

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `components/ProductCard.tsx` with:

```tsx
import type { Product } from "@/lib/content.ts";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article class="card group overflow-hidden">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="relative aspect-[4/3] overflow-hidden bg-[var(--steel)]">
          <img
            src={product.image}
            alt={product.name}
            class="h-full w-full object-cover opacity-88 transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span class="pill eyebrow absolute left-3 top-3 bg-[var(--paper)]">
            {product.category}
          </span>
        </div>
        <div class="p-5">
          <h3 class="display text-2xl font-semibold">{product.name}</h3>
          <p class="mt-3 text-sm opacity-76">{product.description}</p>
          <div class="mt-5 flex items-center justify-between gap-3">
            <p class="text-lg font-semibold">{product.price}</p>
            <p class="text-sm opacity-70">{product.leadTime}</p>
          </div>
        </div>
      </a>
    </article>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A components/ProductCard_test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ProductCard.tsx components/ProductCard_test.tsx
git commit -m "feat: sales-oriented ProductCard without internal SKU"
```

---

### Task 4: ShopFilter island (filter pills + grid)

**Files:**
- Create: `islands/ShopFilter.tsx`

> Note: island interactivity (click → re-filter) is not unit-tested here — it requires a DOM/hydration harness. The filtering logic it relies on is already covered by `lib/shop_test.ts` (Task 2). This task is verified by `deno task check` (Task 7) and the manual dev-server check (Task 7).

- [ ] **Step 1: Create the island**

Create `islands/ShopFilter.tsx`:

```tsx
import { useSignal } from "@preact/signals";
import type { Product } from "@/lib/content.ts";
import { categoriesOf, filterByCategory } from "@/lib/shop.ts";
import ProductCard from "@/components/ProductCard.tsx";

export default function ShopFilter({ products }: { products: Product[] }) {
  const active = useSignal("Alle");
  const categories = ["Alle", ...categoriesOf(products)];
  const visible = filterByCategory(products, active.value);

  return (
    <div>
      <div class="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = active.value === category;
          return (
            <button
              type="button"
              onClick={() => (active.value = category)}
              aria-pressed={isActive}
              class={`pill eyebrow cursor-pointer transition ${
                isActive ? "bg-[var(--ink)] text-[var(--paper)]" : ""
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add islands/ShopFilter.tsx
git commit -m "feat: add ShopFilter island with category pills"
```

---

### Task 5: Rewrite homepage as storefront (`routes/index.tsx`)

**Files:**
- Modify: `routes/index.tsx`

- [ ] **Step 1: Replace the entire homepage**

Replace the entire contents of `routes/index.tsx` with:

```tsx
import { Head } from "fresh/runtime";
import ShopFilter from "@/islands/ShopFilter.tsx";
import { products } from "@/lib/content.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Robin Rehbein - 3D Print Studio Shop</title>
      </Head>

      <section class="shell py-12 md:py-16">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow text-[var(--clay)]">3D Print Studio</p>
            <h1 class="display mt-4 max-w-3xl text-5xl font-semibold md:text-7xl">
              3D-gedruckte Objekte, kleine Serien.
            </h1>
            <p class="mt-5 max-w-xl text-lg leading-8">
              Vasen, Ordnungsteile und Pflanzenhelfer aus Stuttgart. Klare
              Objekte, sauber gedruckt, in kleinen Auflagen.
            </p>
          </div>
          <a href="/printauftrag" class="button secondary w-fit shrink-0">
            Eigenes Modell drucken
          </a>
        </div>

        <div class="mt-10">
          <ShopFilter products={products} />
        </div>
      </section>

      <section class="section">
        <div class="shell card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p class="eyebrow text-[var(--clay)]">Custom Print</p>
            <h2 class="display mt-3 text-3xl font-semibold md:text-4xl">
              Dein Modell, mein Druckprozess.
            </h2>
            <p class="mt-3 max-w-2xl leading-8">
              STL- oder STEP-Datei hochladen, Material und Finish waehlen,
              technische Hinweise direkt mitgeben.
            </p>
          </div>
          <a href="/printauftrag" class="button shrink-0">
            Druckauftrag starten
          </a>
        </div>
      </section>

      <section class="section">
        <div class="shell flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-sm">
          <p class="opacity-70">
            Hinter dem Studio steht Robin Rehbein, Senior Software Engineer aus
            Stuttgart.
          </p>
          <a href="/about" class="button secondary">Mehr ueber Robin</a>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify no leftover references to removed content**

Run: `deno check routes/index.tsx`
Expected: PASS — no unused imports, no missing symbols. (The old `stats`, `marketplaceChannels`, `posts`, `ProductCard` imports are gone.)

- [ ] **Step 3: Commit**

```bash
git add routes/index.tsx
git commit -m "feat: homepage becomes product-first storefront"
```

---

### Task 6: Redirect `/shop` to `/` + clean up old `/shop` content

**Files:**
- Modify: `routes/shop/index.tsx`
- Test: `routes/shop/index_test.ts`

- [ ] **Step 1: Write the failing test**

Create `routes/shop/index_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import { App } from "fresh";
import { type State } from "@/utils.ts";
import { handler } from "@/routes/shop/index.tsx";

Deno.test("GET /shop redirects to / permanently", async () => {
  const app = new App<State>().get("/shop", handler.GET).handler();
  const res = await app(new Request("http://localhost/shop"));
  await res.body?.cancel();
  assertEquals(res.status, 308);
  assertEquals(res.headers.get("location"), "/");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A routes/shop/index_test.ts`
Expected: FAIL — `handler` is not exported from `routes/shop/index.tsx` (current file only has a default page component).

- [ ] **Step 3: Replace the route with a redirect handler**

Replace the entire contents of `routes/shop/index.tsx` with:

```tsx
import { define } from "@/utils.ts";

// The storefront now lives at "/". Keep "/shop" as a permanent redirect so old
// links and the nav stay valid.
export const handler = define.handlers({
  GET(ctx) {
    return ctx.redirect("/", 308);
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A routes/shop/index_test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add routes/shop/index.tsx routes/shop/index_test.ts
git commit -m "feat: redirect /shop to storefront homepage"
```

---

### Task 7: Update navigation + remove unused content constant

**Files:**
- Modify: `lib/content.ts`
- Verify: `components/SiteNav.tsx` (no code change expected — it maps `navItems`)

- [ ] **Step 1: Update `navItems` and remove `marketplaceChannels`**

In `lib/content.ts`, replace the `navItems` array with (label "Home" → "Shop", drop the now-duplicate "/shop" entry, order Shop · Druckauftrag · Blog · About):

```ts
export const navItems = [
  { href: "/", label: "Shop" },
  { href: "/printauftrag", label: "Druckauftrag" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];
```

Delete the entire `marketplaceChannels` export at the bottom of the file:

```ts
export const marketplaceChannels = [
  "Etsy Listing ID",
  "SKU fuer Inventar",
  "Produktfeed als JSON",
  "Embed-Link fuer externe Shops",
];
```

> Do NOT touch the `Product.marketplace` type or the per-product `marketplace`
> data — those are needed in later phases (Etsy sync).

- [ ] **Step 2: Confirm `marketplaceChannels` has no remaining references**

Run: `grep -rn "marketplaceChannels" routes components islands lib`
Expected: no output (all references removed; the homepage rewrite in Task 5 already dropped its import).

- [ ] **Step 3: Run the full check + all tests**

Run: `deno task check && deno task test`
Expected: fmt/lint/type-check clean, all tests PASS. Fix any `deno fmt` diffs by running `deno fmt` and re-committing.

- [ ] **Step 4: Manual smoke test in the dev server**

Run: `deno task dev` (then open the printed URL, default http://localhost:5173)
Verify by eye:
- `/` shows the product grid near the top with category pills; clicking a pill (e.g. "Vase") filters the grid; "Alle" restores all.
- No "Architect & Develop" hero, no career stats, no "Marketplace Ready" / "Distribution" / "Etsy kann andocken" text anywhere.
- `/shop` redirects to `/`.
- `/about` still shows the bio, portrait and positions.
- Nav reads: Shop · Druckauftrag · Blog · About.

Stop the dev server (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts
git commit -m "feat: nav points home to shop, drop marketplace jargon"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** Storefront homepage (Task 5), filter island (Tasks 2+4), ProductCard without SKU (Task 3), `/shop` redirect (Task 6), nav update (Task 7), removed `marketplaceChannels`/Distribution/Marketplace-Ready UI (Tasks 5+6+7), `/about` untouched (verified Task 7 Step 4). Build/lint/check/fmt green (Task 7 Step 3).
- **Type names are consistent across tasks:** `categoriesOf(products)`, `filterByCategory(products, category)`, `handler.GET`, `ShopFilter({ products })`.
- **Out of scope (later phases):** no admin, no KV, no cart/Stripe, no Etsy API call.
