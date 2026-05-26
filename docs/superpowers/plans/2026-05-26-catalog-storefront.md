# Katalog + Storefront-Redesign (Teilprojekt A+B · Plan 1 von 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move products from a static array into Deno KV with a typed, variant-aware data model, seed a realistic demo catalog (including Choc-LP keycaps), and rebuild the storefront in the "Editorial Maker" style with multi-dimensional filtering (category, material, price).

**Architecture:** Pure backend + frontend on Fresh 2.2 / Deno. A typed discriminated-union `Product` model lives in `lib/catalog.ts`. Persistence is Deno KV behind a small repository (`lib/products.ts`) whose functions take a `Deno.Kv` so they're trivially testable with an in-memory KV. Idempotent seeding (`lib/seed.ts`) fills a demo catalog on first boot. Pure filter helpers (`lib/shop.ts`) are unit-tested; the `ShopFilter` island and product pages consume them. This is **Plan 1 of 2** for sub-project A+B; the admin UI is **Plan 2** (`2026-05-26-catalog-admin.md`, written next).

**Tech Stack:** Deno (with `--unstable-kv`), Fresh 2.2, Preact, `@preact/signals`, Tailwind 4. Tests via Deno's built-in runner + `preact-render-to-string` (both already configured).

**Spec:** [docs/superpowers/specs/2026-05-26-catalog-data-admin-design.md](../specs/2026-05-26-catalog-data-admin-design.md)

---

### Task 1: Enable Deno KV in the task commands

**Files:**
- Modify: `deno.json:5-11` (the `tasks` object)

- [ ] **Step 1: Add `--unstable-kv` to dev, start, and test tasks**

`Deno.openKv()` requires the `--unstable-kv` flag. `-A` only grants permissions, not unstable APIs. In `deno.json`, change the three tasks (leave `check` and `build` as-is):

```json
    "dev": "deno run -A --unstable-kv vite --host",
    "build": "deno run -A vite build",
    "start": "deno serve -A --unstable-kv _fresh/server.js",
    "test": "deno test -A --unstable-kv"
```

- [ ] **Step 2: Verify KV opens**

Run: `deno run -A --unstable-kv -e "const kv = await Deno.openKv(':memory:'); await kv.set(['x'], 1); console.log((await kv.get(['x'])).value); kv.close()"`
Expected: prints `1` (no "Deno.openKv is not a function" / unstable error).

- [ ] **Step 3: Commit**

```bash
git add deno.json
git commit -m "chore: enable Deno KV (--unstable-kv) in dev/start/test tasks"
```

---

### Task 2: Typed catalog model (`lib/catalog.ts`)

**Files:**
- Create: `lib/catalog.ts`
- Test: `lib/catalog_test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/catalog_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import { categoryLabel } from "@/lib/catalog.ts";

Deno.test("categoryLabel maps union keys to German labels", () => {
  assertEquals(categoryLabel("vase"), "Vase");
  assertEquals(categoryLabel("planter"), "Planter");
  assertEquals(categoryLabel("keycap"), "Keycaps");
  assertEquals(categoryLabel("organisation"), "Organisation");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/catalog_test.ts`
Expected: FAIL — module `lib/catalog.ts` not found.

- [ ] **Step 3: Write the model**

Create `lib/catalog.ts`:

```ts
/** A sales channel a product is (or will be) listed on. Data only — no sync. */
export type Channel = {
  channel: "etsy" | "avocadostore" | "kaufland" | "instagram" | "direct";
  externalId: string;
  url: string;
  enabled: boolean;
};

/** A buyable configuration of a product (e.g. colour x set size). */
export type Variant = {
  id: string; // stable, e.g. "charcoal-36"
  label: string; // "Charcoal · 36er Set"
  priceCents: number;
  image?: string;
  stock?: number | null; // null = made to order
  attributes: Record<string, string>; // { Farbe: "Charcoal", Set: "36er" }
};

type BaseProduct = {
  slug: string;
  name: string;
  description: string;
  images: string[]; // gallery; [0] is the main image
  materials: string[]; // filterable
  fromPriceCents: number; // cheapest variant; derived on save
  leadTime: string;
  variants: Variant[];
  channels: Channel[];
  createdAt: number;
  updatedAt: number;
};

export type VaseProduct = BaseProduct & {
  category: "vase";
  heightMm: number;
  volumeMl: number;
  watertight: boolean;
};

export type PlanterProduct = BaseProduct & {
  category: "planter";
  diameterMm: number;
  drainage: boolean;
};

export type KeycapProduct = BaseProduct & {
  category: "keycap";
  profile: string;
  switchCompat: string;
  legends: "blank" | "legends";
};

export type OrganisationProduct = BaseProduct & {
  category: "organisation";
  dimensions: string;
};

export type Product =
  | VaseProduct
  | PlanterProduct
  | KeycapProduct
  | OrganisationProduct;

export type Category = Product["category"];

export const CATEGORY_LABELS: Record<Category, string> = {
  vase: "Vase",
  planter: "Planter",
  keycap: "Keycaps",
  organisation: "Organisation",
};

/** Human-readable German label for a category key. */
export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/catalog_test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add lib/catalog.ts lib/catalog_test.ts
git commit -m "feat: typed catalog model with variants and per-category specs"
```

---

### Task 3: Price formatting (`lib/price.ts`)

**Files:**
- Create: `lib/price.ts`
- Test: `lib/price_test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/price_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import { formatEuro, formatFrom } from "@/lib/price.ts";

Deno.test("formatEuro shows whole euros without decimals", () => {
  assertEquals(formatEuro(3400), "34 €");
});

Deno.test("formatEuro shows cents when present", () => {
  assertEquals(formatEuro(1850), "18,50 €");
});

Deno.test("formatFrom prefixes with 'ab'", () => {
  assertEquals(formatFrom(3400), "ab 34 €");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/price_test.ts`
Expected: FAIL — module `lib/price.ts` not found.

- [ ] **Step 3: Write the implementation**

Create `lib/price.ts`:

```ts
/** Format integer cents as a euro string, dropping ",00" for whole amounts. */
export function formatEuro(cents: number): string {
  const euros = cents / 100;
  const hasCents = cents % 100 !== 0;
  const body = hasCents
    ? euros.toFixed(2).replace(".", ",")
    : String(Math.round(euros));
  return `${body} €`;
}

/** "ab 34 €" — for list/card prices that start from the cheapest variant. */
export function formatFrom(cents: number): string {
  return `ab ${formatEuro(cents)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/price_test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/price.ts lib/price_test.ts
git commit -m "feat: euro price formatting helpers"
```

---

### Task 4: KV product repository (`lib/products.ts`)

**Files:**
- Create: `lib/products.ts`
- Test: `lib/products_test.ts`

> Repository functions take a `Deno.Kv` as their first argument. Routes pass the shared singleton (Task 7); tests pass an in-memory KV for full isolation.

- [ ] **Step 1: Write the failing test**

Create `lib/products_test.ts`:

```ts
import { assert, assertEquals } from "@std/assert";
import {
  deleteProduct,
  getProduct,
  listProducts,
  saveProduct,
} from "@/lib/products.ts";
import type { KeycapProduct } from "@/lib/catalog.ts";

function keycap(slug: string, prices: number[]): KeycapProduct {
  return {
    slug,
    name: slug,
    category: "keycap",
    description: "",
    images: ["/x.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    variants: prices.map((p, i) => ({
      id: `v${i}`,
      label: `V${i}`,
      priceCents: p,
      attributes: {},
    })),
    channels: [],
    createdAt: 0,
    updatedAt: 0,
    profile: "MBK",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
  };
}

Deno.test("saveProduct then getProduct round-trips", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800, 2800]));
  const got = await getProduct(kv, "a");
  assert(got, "product not found");
  assertEquals(got.name, "a");
  kv.close();
});

Deno.test("saveProduct derives fromPriceCents from cheapest variant", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [2800, 1800, 3000]));
  const got = await getProduct(kv, "a");
  assertEquals(got!.fromPriceCents, 1800);
  kv.close();
});

Deno.test("saveProduct sets timestamps; update keeps createdAt", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800]));
  const first = await getProduct(kv, "a");
  assert(first!.createdAt > 0, "createdAt unset");
  await saveProduct(kv, { ...first!, name: "renamed" });
  const second = await getProduct(kv, "a");
  assertEquals(second!.createdAt, first!.createdAt);
  assert(second!.updatedAt >= first!.updatedAt, "updatedAt not advanced");
  kv.close();
});

Deno.test("listProducts returns all, sorted by name", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("beta", [1800]));
  await saveProduct(kv, keycap("alpha", [1800]));
  const all = await listProducts(kv);
  assertEquals(all.map((p) => p.slug), ["alpha", "beta"]);
  kv.close();
});

Deno.test("deleteProduct removes the product", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800]));
  await deleteProduct(kv, "a");
  assertEquals(await getProduct(kv, "a"), null);
  kv.close();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/products_test.ts`
Expected: FAIL — module `lib/products.ts` not found.

- [ ] **Step 3: Write the repository**

Create `lib/products.ts`:

```ts
import type { Product } from "@/lib/catalog.ts";

const PREFIX = ["product"] as const;

/** Recompute derived fields (cheapest price) and timestamps before storing. */
function withDerived(product: Product, existingCreatedAt?: number): Product {
  const now = Date.now();
  const prices = product.variants.map((v) => v.priceCents);
  const fromPriceCents = prices.length > 0 ? Math.min(...prices) : 0;
  return {
    ...product,
    fromPriceCents,
    createdAt: existingCreatedAt ?? product.createdAt ?? now,
    updatedAt: now,
  };
}

/** Create or update a product (keyed by slug). Sets timestamps + fromPrice. */
export async function saveProduct(kv: Deno.Kv, product: Product): Promise<void> {
  const existing = await kv.get<Product>([...PREFIX, product.slug]);
  const record = withDerived(product, existing.value?.createdAt);
  await kv.set([...PREFIX, product.slug], record);
}

/** Fetch one product by slug, or null if missing. */
export async function getProduct(
  kv: Deno.Kv,
  slug: string,
): Promise<Product | null> {
  const entry = await kv.get<Product>([...PREFIX, slug]);
  return entry.value;
}

/** All products, sorted by name (case-insensitive). */
export async function listProducts(kv: Deno.Kv): Promise<Product[]> {
  const products: Product[] = [];
  for await (const entry of kv.list<Product>({ prefix: [...PREFIX] })) {
    products.push(entry.value);
  }
  return products.sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/** Remove a product by slug. */
export async function deleteProduct(kv: Deno.Kv, slug: string): Promise<void> {
  await kv.delete([...PREFIX, slug]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/products_test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/products.ts lib/products_test.ts
git commit -m "feat: Deno KV product repository with derived price + timestamps"
```

---

### Task 5: Demo catalog seeding (`lib/seed.ts`)

**Files:**
- Create: `lib/seed.ts`
- Test: `lib/seed_test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/seed_test.ts`:

```ts
import { assert, assertEquals } from "@std/assert";
import { seedIfEmpty } from "@/lib/seed.ts";
import { listProducts } from "@/lib/products.ts";

Deno.test("seedIfEmpty populates an empty KV with demo products", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const all = await listProducts(kv);
  assert(all.length >= 7, `expected >= 7 demo products, got ${all.length}`);
  // covers all four categories
  const cats = new Set(all.map((p) => p.category));
  assertEquals(cats.has("vase"), true);
  assertEquals(cats.has("planter"), true);
  assertEquals(cats.has("keycap"), true);
  assertEquals(cats.has("organisation"), true);
  kv.close();
});

Deno.test("seedIfEmpty is idempotent (does not duplicate)", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const first = (await listProducts(kv)).length;
  await seedIfEmpty(kv);
  assertEquals((await listProducts(kv)).length, first);
  kv.close();
});

Deno.test("keycap demo product targets Choc LP and has variants", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const all = await listProducts(kv);
  const keycap = all.find((p) => p.category === "keycap");
  assert(keycap, "no keycap product seeded");
  assert(keycap.variants.length >= 2, "keycap should have variants");
  kv.close();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/seed_test.ts`
Expected: FAIL — module `lib/seed.ts` not found.

- [ ] **Step 3: Write the seed module**

Create `lib/seed.ts`. Placeholder images reuse files already in `static/`; replace later via the admin (Plan 2).

```ts
import type { Product } from "@/lib/catalog.ts";
import { listProducts, saveProduct } from "@/lib/products.ts";

const DEMO: Product[] = [
  {
    slug: "ripple-vase",
    name: "Ripple Vase",
    category: "vase",
    description:
      "Organische Vase mit ruhigem Wellenprofil für Trockenblumen und kleine Arrangements.",
    images: ["/me_square.jpg"],
    materials: ["PLA Matte", "PETG Transparent"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    heightMm: 180,
    volumeMl: 600,
    watertight: false,
    variants: [
      { id: "matte", label: "Matt", priceCents: 3400, attributes: { Finish: "Matt" } },
      { id: "trans", label: "Transparent", priceCents: 3900, attributes: { Finish: "Transparent" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "facet-vase",
    name: "Facet Vase",
    category: "vase",
    description: "Kantige, facettierte Vase mit mattem Korpus für einen grafischen Look.",
    images: ["/me.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    heightMm: 150,
    volumeMl: 400,
    watertight: false,
    variants: [
      { id: "bone", label: "Bone", priceCents: 2900, attributes: { Farbe: "Bone" } },
      { id: "charcoal", label: "Charcoal", priceCents: 2900, attributes: { Farbe: "Charcoal" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "ring-planter",
    name: "Ring Planter",
    category: "planter",
    description: "Selbstständiger Übertopf mit Wasserrille und abnehmbarem Untersetzer.",
    images: ["/me_square.jpg"],
    materials: ["PETG", "PETG Outdoor"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    diameterMm: 120,
    drainage: true,
    variants: [
      { id: "s", label: "Ø 10 cm", priceCents: 1900, attributes: { Größe: "10 cm" } },
      { id: "m", label: "Ø 14 cm", priceCents: 2600, attributes: { Größe: "14 cm" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "hanging-planter",
    name: "Hanging Planter",
    category: "planter",
    description: "Leichter Hängetopf mit drei Schnüren, ideal für Stecklinge und kleine Pflanzen.",
    images: ["/me.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    diameterMm: 100,
    drainage: false,
    variants: [
      { id: "sage", label: "Sage", priceCents: 2200, attributes: { Farbe: "Sage" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "mbk-blank-set",
    name: "MBK Blank Set",
    category: "keycap",
    description:
      "Gedruckte Low-Profile-Keycaps im MBK-Stil für Kailh Choc v1. Blank, seidenmatte Oberfläche, präziser Switch-Sitz.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    profile: "MBK (Low Profile)",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
    variants: [
      { id: "charcoal-single", label: "Charcoal · Einzeln", priceCents: 300, attributes: { Farbe: "Charcoal", Set: "Einzeln" } },
      { id: "charcoal-36", label: "Charcoal · 36er Set", priceCents: 1800, attributes: { Farbe: "Charcoal", Set: "36er" } },
      { id: "clay-36", label: "Clay · 36er Set", priceCents: 1800, attributes: { Farbe: "Clay", Set: "36er" } },
      { id: "charcoal-full", label: "Charcoal · Full", priceCents: 2800, attributes: { Farbe: "Charcoal", Set: "Full" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "choc-homing-pair",
    name: "Choc Homing Pair",
    category: "keycap",
    description: "Zwei Homing-Keycaps mit fühlbarem Steg für die Zeigefinger, kompatibel mit Choc LP.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte", "PETG Carbon Look"],
    fromPriceCents: 0,
    leadTime: "2-3 Werktage",
    profile: "MBK (Low Profile)",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
    variants: [
      { id: "charcoal", label: "Charcoal", priceCents: 500, attributes: { Farbe: "Charcoal" } },
      { id: "clay", label: "Clay", priceCents: 500, attributes: { Farbe: "Clay" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "desk-grid-tray",
    name: "Desk Grid Tray",
    category: "organisation",
    description:
      "Flaches Ordnungssystem für Schreibtisch, Keyboard-Parts, Schrauben und Bits.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte", "PETG Carbon Look"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    dimensions: "180 × 120 × 18 mm",
    variants: [
      { id: "single", label: "Einzeltray", priceCents: 2200, attributes: { Umfang: "1 Tray" } },
      { id: "trio", label: "3er Modul", priceCents: 5400, attributes: { Umfang: "3 Trays" } },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
];

/** Seed the demo catalog only when KV holds no products yet. Idempotent. */
export async function seedIfEmpty(kv: Deno.Kv): Promise<void> {
  const existing = await listProducts(kv);
  if (existing.length > 0) return;
  for (const product of DEMO) {
    await saveProduct(kv, product);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/seed_test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/seed.ts lib/seed_test.ts
git commit -m "feat: idempotent demo catalog seeding (incl. Choc LP keycaps)"
```

---

### Task 6: Multi-dimensional filter helpers (`lib/shop.ts`)

**Files:**
- Modify: `lib/shop.ts` (full rewrite)
- Modify: `lib/shop_test.ts` (full rewrite)

> The old `lib/shop.ts` filtered by a single category string against the old `lib/content.ts` model. It is rewritten here to use the new `lib/catalog.ts` model and to filter by category + material + max price. The old `categoriesOf`/`filterByCategory` names are replaced.

- [ ] **Step 1: Rewrite the test**

Replace the entire contents of `lib/shop_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import {
  categoriesOf,
  filterProducts,
  groupByCategory,
  materialsOf,
} from "@/lib/shop.ts";
import type { Product, VaseProduct } from "@/lib/catalog.ts";

function vase(slug: string, materials: string[], from: number): VaseProduct {
  return {
    slug,
    name: slug,
    category: "vase",
    description: "",
    images: [],
    materials,
    fromPriceCents: from,
    leadTime: "",
    heightMm: 0,
    volumeMl: 0,
    watertight: false,
    variants: [],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  };
}

const sample: Product[] = [
  vase("a", ["PLA Matte"], 3400),
  { ...vase("b", ["PETG"], 1900), category: "planter", diameterMm: 0, drainage: false } as Product,
  vase("c", ["PLA Matte", "PETG"], 2900),
];

Deno.test("categoriesOf returns unique categories in first-seen order", () => {
  assertEquals(categoriesOf(sample), ["vase", "planter"]);
});

Deno.test("materialsOf returns sorted unique materials", () => {
  assertEquals(materialsOf(sample), ["PETG", "PLA Matte"]);
});

Deno.test("filterProducts with no filters returns everything", () => {
  assertEquals(filterProducts(sample, {}).length, 3);
});

Deno.test("filterProducts filters by category", () => {
  assertEquals(filterProducts(sample, { category: "vase" }).map((p) => p.slug), [
    "a",
    "c",
  ]);
});

Deno.test("filterProducts filters by material membership", () => {
  assertEquals(filterProducts(sample, { material: "PETG" }).map((p) => p.slug), [
    "b",
    "c",
  ]);
});

Deno.test("filterProducts filters by max price (fromPriceCents)", () => {
  assertEquals(
    filterProducts(sample, { maxPriceCents: 3000 }).map((p) => p.slug),
    ["b", "c"],
  );
});

Deno.test("filterProducts combines filters (AND)", () => {
  assertEquals(
    filterProducts(sample, { category: "vase", material: "PETG" }).map((p) =>
      p.slug
    ),
    ["c"],
  );
});

Deno.test("groupByCategory groups in first-seen category order", () => {
  const groups = groupByCategory(sample);
  assertEquals(groups.map((g) => g.category), ["vase", "planter"]);
  assertEquals(groups[0].products.map((p) => p.slug), ["a", "c"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/shop_test.ts`
Expected: FAIL — `filterProducts`/`materialsOf`/`groupByCategory` not exported (old module only has `categoriesOf`/`filterByCategory`).

- [ ] **Step 3: Rewrite the implementation**

Replace the entire contents of `lib/shop.ts`:

```ts
import type { Category, Product } from "@/lib/catalog.ts";

export type ProductFilter = {
  category?: Category;
  material?: string;
  maxPriceCents?: number;
};

/** Unique categories in first-seen order. */
export function categoriesOf(products: Product[]): Category[] {
  const seen = new Set<Category>();
  for (const product of products) seen.add(product.category);
  return [...seen];
}

/** Unique materials across all products, alphabetically sorted. */
export function materialsOf(products: Product[]): string[] {
  const seen = new Set<string>();
  for (const product of products) {
    for (const material of product.materials) seen.add(material);
  }
  return [...seen].sort((a, b) => a.localeCompare(b, "de"));
}

/** Filter products by any combination of category, material, and max price. */
export function filterProducts(
  products: Product[],
  filter: ProductFilter,
): Product[] {
  return products.filter((product) => {
    if (filter.category && product.category !== filter.category) return false;
    if (filter.material && !product.materials.includes(filter.material)) {
      return false;
    }
    if (
      filter.maxPriceCents !== undefined &&
      product.fromPriceCents > filter.maxPriceCents
    ) {
      return false;
    }
    return true;
  });
}

export type CategoryGroup = { category: Category; products: Product[] };

/** Group products by category, preserving first-seen category order. */
export function groupByCategory(products: Product[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  for (const product of products) {
    let group = groups.find((g) => g.category === product.category);
    if (!group) {
      group = { category: product.category, products: [] };
      groups.push(group);
    }
    group.products.push(product);
  }
  return groups;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/shop_test.ts`
Expected: PASS (8 tests).

> Note: `deno task check` will still fail at this point because `islands/ShopFilter.tsx`, `components/ProductCard.tsx`, `routes/index.tsx`, and `routes/shop/[slug].tsx` still import the old model. They are migrated in Tasks 8–10. Do not run `deno task check` until then; the per-file tests above are green.

- [ ] **Step 5: Commit**

```bash
git add lib/shop.ts lib/shop_test.ts
git commit -m "feat: multi-dimensional product filter helpers (category/material/price)"
```

---

### Task 7: Shared KV singleton + boot seeding (`lib/kv.ts`, `main.ts`)

**Files:**
- Create: `lib/kv.ts`
- Modify: `main.ts:1-7`

- [ ] **Step 1: Create the KV singleton**

Create `lib/kv.ts`:

```ts
let kvPromise: Promise<Deno.Kv> | undefined;

/** Lazily open and memoise the application's Deno KV connection. */
export function getKv(): Promise<Deno.Kv> {
  if (!kvPromise) kvPromise = Deno.openKv();
  return kvPromise;
}
```

- [ ] **Step 2: Seed on boot in `main.ts`**

In `main.ts`, add the seed call after the imports and before `export const app`. The top section becomes:

```ts
import "@std/dotenv/load";
import { App, csrf, staticFiles } from "fresh";
import { type State } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { seedIfEmpty } from "@/lib/seed.ts";

await seedIfEmpty(await getKv());

export const app = new App<State>();
```

(Leave the rest of `main.ts` — middlewares, `fsRoutes()`, `listen()` — unchanged.)

- [ ] **Step 3: Verify the server boots and seeds**

Run: `deno run -A --unstable-kv -e "import { getKv } from './lib/kv.ts'; import { seedIfEmpty } from './lib/seed.ts'; import { listProducts } from './lib/products.ts'; const kv = await getKv(); await seedIfEmpty(kv); console.log('products:', (await listProducts(kv)).length)"`
Expected: prints `products: 7` (or the demo count). A real on-disk KV file is created.

- [ ] **Step 4: Commit**

```bash
git add lib/kv.ts main.ts
git commit -m "feat: shared KV singleton and seed demo catalog on boot"
```

---

### Task 8: Sales-oriented ProductCard on the new model

**Files:**
- Modify: `components/ProductCard.tsx` (full rewrite)
- Modify: `components/ProductCard_test.tsx` (full rewrite)

> Variant colour dots read an optional `Farbe` attribute and map known colour names to the palette; unknown names fall back to steel. This keeps the card purely presentational.

- [ ] **Step 1: Rewrite the test**

Replace the entire contents of `components/ProductCard_test.tsx`:

```tsx
import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import ProductCard from "@/components/ProductCard.tsx";
import type { KeycapProduct } from "@/lib/catalog.ts";

const product: KeycapProduct = {
  slug: "mbk-blank-set",
  name: "MBK Blank Set",
  category: "keycap",
  description: "Low-Profile-Keycaps für Choc LP.",
  images: ["/x.jpg"],
  materials: ["PLA Matte"],
  fromPriceCents: 1800,
  leadTime: "3-5 Werktage",
  profile: "MBK",
  switchCompat: "Kailh Choc v1",
  legends: "blank",
  variants: [
    { id: "a", label: "Charcoal", priceCents: 1800, attributes: { Farbe: "Charcoal" } },
  ],
  channels: [{ channel: "etsy", externalId: "secret-123", url: "x", enabled: true }],
  createdAt: 0,
  updatedAt: 0,
};

Deno.test("ProductCard shows name, formatted price and category label", () => {
  const html = renderToString(<ProductCard product={product} />);
  assert(html.includes("MBK Blank Set"), "name missing");
  assert(html.includes("ab 18 €"), "formatted price missing");
  assert(html.includes("Keycaps"), "category label missing");
});

Deno.test("ProductCard does not leak channel external IDs", () => {
  const html = renderToString(<ProductCard product={product} />);
  assert(!html.includes("secret-123"), "channel externalId leaked");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv components/ProductCard_test.tsx`
Expected: FAIL — current card imports `Product` from `@/lib/content.ts` and renders `product.price`/`product.image` (old fields), so it won't compile/pass.

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `components/ProductCard.tsx`:

```tsx
import type { Product } from "@/lib/catalog.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";

const COLOR_HEX: Record<string, string> = {
  Charcoal: "#28313b",
  Clay: "#b55732",
  Sage: "#708468",
  Bone: "#f4f0e6",
};

function variantColors(product: Product): string[] {
  const names = new Set<string>();
  for (const variant of product.variants) {
    const name = variant.attributes["Farbe"];
    if (name) names.add(name);
  }
  return [...names].map((name) => COLOR_HEX[name] ?? "#28313b");
}

export default function ProductCard({ product }: { product: Product }) {
  const colors = variantColors(product);
  return (
    <article class="card group overflow-hidden">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="relative aspect-[4/3] overflow-hidden bg-[var(--steel)]">
          <img
            src={product.images[0]}
            alt={product.name}
            class="h-full w-full object-cover opacity-88 transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span class="pill eyebrow absolute left-3 top-3 bg-[var(--paper)]">
            {categoryLabel(product.category)}
          </span>
        </div>
        <div class="p-5">
          <h3 class="display text-2xl font-semibold">{product.name}</h3>
          <p class="mt-3 text-sm opacity-76">{product.description}</p>
          <div class="mt-5 flex items-center justify-between gap-3">
            <p class="text-lg font-semibold">{formatFrom(product.fromPriceCents)}</p>
            <p class="text-sm opacity-70">{product.leadTime}</p>
          </div>
          {colors.length > 0 && (
            <div class="mt-4 flex gap-1.5" aria-label="Farbvarianten">
              {colors.map((hex) => (
                <span
                  class="h-3.5 w-3.5 rounded-full border border-[var(--line)]"
                  style={`background:${hex}`}
                />
              ))}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv components/ProductCard_test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ProductCard.tsx components/ProductCard_test.tsx
git commit -m "feat: ProductCard on catalog model with price + variant colour dots"
```

---

### Task 9: Multi-filter ShopFilter island

**Files:**
- Modify: `islands/ShopFilter.tsx` (full rewrite)

> Interactivity (click → re-filter) is not unit-tested (needs a hydration harness); the filtering logic is covered by `lib/shop_test.ts` (Task 6). Verified by `deno task check` (Task 12) and the manual dev check.

- [ ] **Step 1: Rewrite the island**

Replace the entire contents of `islands/ShopFilter.tsx`:

```tsx
import { useSignal } from "@preact/signals";
import type { Category, Product } from "@/lib/catalog.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import {
  categoriesOf,
  filterProducts,
  groupByCategory,
  materialsOf,
} from "@/lib/shop.ts";
import { formatEuro } from "@/lib/price.ts";
import ProductCard from "@/components/ProductCard.tsx";

export default function ShopFilter({ products }: { products: Product[] }) {
  const category = useSignal<Category | "all">("all");
  const material = useSignal<string | "all">("all");
  const maxPrice = useSignal<number>(0); // 0 = no limit

  const categories = categoriesOf(products);
  const materials = materialsOf(products);
  const priceCap = Math.max(...products.map((p) => p.fromPriceCents), 0);

  const filtered = filterProducts(products, {
    category: category.value === "all" ? undefined : category.value,
    material: material.value === "all" ? undefined : material.value,
    maxPriceCents: maxPrice.value === 0 ? undefined : maxPrice.value,
  });

  const noFilters = category.value === "all" && material.value === "all" &&
    maxPrice.value === 0;
  const groups = noFilters ? groupByCategory(filtered) : null;

  return (
    <div>
      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
        <div role="group" aria-label="Kategorie filtern" class="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (category.value = "all")}
            aria-pressed={category.value === "all"}
            class={`pill eyebrow cursor-pointer transition ${
              category.value === "all" ? "bg-[var(--ink)] text-[var(--paper)]" : ""
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              onClick={() => (category.value = cat)}
              aria-pressed={category.value === cat}
              class={`pill eyebrow cursor-pointer transition ${
                category.value === cat ? "bg-[var(--ink)] text-[var(--paper)]" : ""
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        <label class="flex flex-col gap-1 text-sm">
          <span class="eyebrow opacity-70">Material</span>
          <select
            class="field"
            value={material.value}
            onChange={(e) => (material.value = (e.target as HTMLSelectElement).value)}
          >
            <option value="all">Alle Materialien</option>
            {materials.map((m) => <option value={m}>{m}</option>)}
          </select>
        </label>

        {priceCap > 0 && (
          <label class="flex flex-col gap-1 text-sm">
            <span class="eyebrow opacity-70">
              Max. Preis: {maxPrice.value === 0 ? "alle" : formatEuro(maxPrice.value)}
            </span>
            <input
              type="range"
              min={0}
              max={priceCap}
              step={100}
              value={maxPrice.value}
              onInput={(e) =>
                (maxPrice.value = Number((e.target as HTMLInputElement).value))}
              class="accent-[var(--clay)]"
            />
          </label>
        )}
      </div>

      {groups
        ? (
          <div class="mt-10 flex flex-col gap-12">
            {groups.map((group) => (
              <section>
                <h2 class="display text-3xl font-semibold">
                  {categoryLabel(group.category)}
                </h2>
                <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )
        : (
          <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
            {filtered.length === 0 && (
              <p class="opacity-70">Keine Produkte für diese Filter.</p>
            )}
          </div>
        )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add islands/ShopFilter.tsx
git commit -m "feat: multi-filter ShopFilter island (category/material/price) with category grouping"
```

---

### Task 10: Editorial homepage with featured band + KV handler

**Files:**
- Modify: `routes/index.tsx` (full rewrite)
- Modify: `lib/content.ts` (remove old `Product` type + `products` array + `materials` left intact)

> The homepage now loads products from KV in a handler and renders a featured band (first product by name, kept simple — admin-driven "featured" flag is out of scope) + the ShopFilter island. Removing the old `products`/`Product` from `lib/content.ts` is safe here because the last consumers (`ShopFilter`, `ProductCard`) were migrated in Tasks 8–9 and `routes/shop/[slug].tsx` is migrated in this task's Step 3.

- [ ] **Step 1: Remove the old product model from `lib/content.ts`**

In `lib/content.ts`, delete the `Product` type (lines defining `slug…marketplace`) and the entire `products` array. Keep `Post`, `posts`, `navItems`, and `materials`. The file should no longer reference `marketplace`/`sku`.

- [ ] **Step 2: Rewrite the homepage**

Replace the entire contents of `routes/index.tsx`:

```tsx
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";
import ShopFilter from "@/islands/ShopFilter.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const products = await listProducts(await getKv());
    return ctx.render(ctx, products);
  },
});

function Featured({ product }: { product: Product }) {
  return (
    <a
      href={`/shop/${product.slug}`}
      class="card group grid overflow-hidden md:grid-cols-2"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-[var(--steel)] md:aspect-auto">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div class="flex flex-col justify-center gap-4 p-8 md:p-10">
        <p class="eyebrow text-[var(--clay)]">
          Diesen Monat · {categoryLabel(product.category)}
        </p>
        <h2 class="display text-4xl font-semibold md:text-6xl">{product.name}</h2>
        <p class="max-w-md leading-8 opacity-80">{product.description}</p>
        <p class="text-lg font-semibold">{formatFrom(product.fromPriceCents)}</p>
      </div>
    </a>
  );
}

export default define.page<typeof handler>(function Home({ data }) {
  const products = data as Product[];
  const featured = products[0];

  return (
    <>
      <Head>
        <title>Robin Rehbein - 3D Print Studio Shop</title>
      </Head>

      <section class="shell py-12 md:py-16">
        <div class="mb-10">
          <p class="eyebrow text-[var(--clay)]">3D Print Studio</p>
          <h1 class="display mt-4 max-w-3xl text-5xl font-semibold md:text-7xl">
            3D-gedruckte Objekte, kleine Serien.
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-8">
            Vasen, Planter und Keycaps für Choc-LP-Switches aus Stuttgart. Klare
            Objekte, sauber gedruckt, in kleinen Auflagen.
          </p>
        </div>

        {featured && <Featured product={featured} />}

        <div class="mt-12">
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
              STL- oder STEP-Datei hochladen, Material und Finish wählen,
              technische Hinweise direkt mitgeben.
            </p>
          </div>
          <a href="/printauftrag" class="button shrink-0">Druckauftrag starten</a>
        </div>
      </section>

      <section class="section">
        <div class="shell flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-sm">
          <p class="opacity-70">
            Hinter dem Studio steht Robin Rehbein, Senior Software Engineer aus
            Stuttgart.
          </p>
          <a href="/about" class="button secondary">Mehr über Robin</a>
        </div>
      </section>
    </>
  );
});
```

> `ctx.render(ctx, products)` passes `products` as the page `data`. If the installed Fresh 2.2 `define.handlers` expects the `{ data }` return shape instead, use `return { data: products };` and `define.page` will receive `props.data`. Verify against the existing `routes/shop/[slug].tsx` pattern (which returns `{ data: { product } }`) — to stay consistent with the codebase, prefer `return { data: products };` and read `props.data` in the page. Adjust the two lines accordingly before running the check.

- [ ] **Step 3: Migrate `routes/shop/[slug].tsx` to the repository (minimal)**

So the build compiles, update `routes/shop/[slug].tsx` to load from KV and use the new fields. Full visual redesign of this page is Task 11; here just make it correct and compiling:

```tsx
import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct } from "@/lib/products.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProduct(await getKv(), ctx.params.slug);
    if (!product) throw new HttpError(404, "Product not found");
    return { data: { product } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { product } = data;
  return (
    <>
      <Head>
        <title>{product.name} - Robin Rehbein Shop</title>
      </Head>
      <section class="shell grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--ink)] bg-[var(--steel)]">
          <img
            src={product.images[0]}
            alt={product.name}
            class="h-full w-full object-cover"
          />
        </div>
        <div>
          <a href="/" class="eyebrow text-[var(--clay)]">
            ← Zurück zum Shop · {categoryLabel(product.category)}
          </a>
          <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
            {product.name}
          </h1>
          <p class="mt-6 max-w-2xl text-xl leading-8">{product.description}</p>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="card p-4">
              <p class="eyebrow">Preis</p>
              <p class="mt-2 text-2xl font-semibold">
                {formatFrom(product.fromPriceCents)}
              </p>
            </div>
            <div class="card p-4">
              <p class="eyebrow">Fertigung</p>
              <p class="mt-2 text-2xl font-semibold">{product.leadTime}</p>
            </div>
            <div class="card p-4 sm:col-span-2">
              <p class="eyebrow">Materialoptionen</p>
              <p class="mt-2 text-lg">{product.materials.join(", ")}</p>
            </div>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="/printauftrag" class="button">Ähnliches Teil anfragen</a>
          </div>
        </div>
      </section>
    </>
  );
});
```

- [ ] **Step 4: Run the full check + tests**

Run: `deno task check && deno task test`
Expected: fmt/lint/type-check clean, all tests PASS. Fix any `deno fmt` diffs by running `deno fmt`. Resolve the `ctx.render` vs `{ data }` shape per the note in Step 2 if `deno check` complains.

- [ ] **Step 5: Commit**

```bash
git add routes/index.tsx routes/shop/[slug].tsx lib/content.ts
git commit -m "feat: editorial homepage with featured band, products from KV"
```

---

### Task 11: Polished detail page with gallery + variant selector

**Files:**
- Create: `islands/ProductDetail.tsx`
- Modify: `routes/shop/[slug].tsx` (render the island + typed spec table)

> The island owns the interactive parts (gallery thumbnail switching, variant selection updating price + main image). The typed spec table is server-rendered from category-specific fields and passed in as a serialisable list of label/value pairs.

- [ ] **Step 1: Create the ProductDetail island**

Create `islands/ProductDetail.tsx`:

```tsx
import { useSignal } from "@preact/signals";
import type { Product } from "@/lib/catalog.ts";
import { formatEuro } from "@/lib/price.ts";

export default function ProductDetail({ product }: { product: Product }) {
  const selectedImage = useSignal(0);
  const selectedVariant = useSignal(0);
  const variant = product.variants[selectedVariant.value];
  const mainImage = variant?.image ?? product.images[selectedImage.value] ??
    product.images[0];

  return (
    <div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div class="grid grid-cols-[64px_1fr] gap-3">
        <div class="flex flex-col gap-2">
          {product.images.map((src, i) => (
            <button
              type="button"
              onClick={() => (selectedImage.value = i)}
              aria-label={`Bild ${i + 1}`}
              class={`aspect-square overflow-hidden rounded-[5px] border ${
                selectedImage.value === i
                  ? "border-[var(--clay)] outline outline-2 outline-[var(--clay)]"
                  : "border-[var(--line)]"
              }`}
            >
              <img src={src} alt="" class="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div class="aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--ink)] bg-[var(--steel)]">
          <img src={mainImage} alt={product.name} class="h-full w-full object-cover" />
        </div>
      </div>

      <div>
        <p class="text-2xl font-semibold">
          {variant ? formatEuro(variant.priceCents) : ""}
        </p>
        {product.variants.length > 0 && (
          <div class="mt-5">
            <p class="eyebrow opacity-70">Variante</p>
            <div class="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  type="button"
                  onClick={() => (selectedVariant.value = i)}
                  aria-pressed={selectedVariant.value === i}
                  class={`pill eyebrow cursor-pointer transition ${
                    selectedVariant.value === i
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : ""
                  }`}
                >
                  {v.label} · {formatEuro(v.priceCents)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div class="mt-8 flex flex-wrap gap-3">
          <button type="button" class="button" disabled>In den Warenkorb</button>
          <a href="/printauftrag" class="button secondary">Ähnliches anfragen</a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build the typed spec list + render island in the route**

Replace the entire contents of `routes/shop/[slug].tsx`:

```tsx
import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import ProductDetail from "@/islands/ProductDetail.tsx";

/** Category-specific descriptive specs as label/value pairs. */
function specsOf(product: Product): [string, string][] {
  const specs: [string, string][] = [
    ["Material", product.materials.join(", ")],
    ["Fertigung", product.leadTime],
  ];
  switch (product.category) {
    case "vase":
      specs.unshift(
        ["Höhe", `${product.heightMm} mm`],
        ["Volumen", `${product.volumeMl} ml`],
        ["Wasserdicht", product.watertight ? "Ja" : "Einsatz empfohlen"],
      );
      break;
    case "planter":
      specs.unshift(
        ["Durchmesser", `${product.diameterMm} mm`],
        ["Drainage", product.drainage ? "Ja" : "Nein"],
      );
      break;
    case "keycap":
      specs.unshift(
        ["Profil", product.profile],
        ["Kompatibel", product.switchCompat],
        ["Legenden", product.legends === "blank" ? "Blank" : "Mit Legenden"],
      );
      break;
    case "organisation":
      specs.unshift(["Maße", product.dimensions]);
      break;
  }
  return specs;
}

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProduct(await getKv(), ctx.params.slug);
    if (!product) throw new HttpError(404, "Product not found");
    return { data: { product, specs: specsOf(product) } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { product, specs } = data;
  return (
    <>
      <Head>
        <title>{product.name} - Robin Rehbein Shop</title>
      </Head>
      <section class="shell py-16">
        <a href="/" class="eyebrow text-[var(--clay)]">
          ← Zurück zum Shop · {categoryLabel(product.category)}
        </a>
        <h1 class="display mt-5 mb-8 text-6xl font-semibold md:text-8xl">
          {product.name}
        </h1>
        <ProductDetail product={product} />
        <p class="mt-8 max-w-2xl text-lg leading-8 opacity-85">
          {product.description}
        </p>
        <div class="mt-8 overflow-hidden rounded-[8px] border border-[var(--line)]">
          {specs.map(([label, value], i) => (
            <div
              class={`grid grid-cols-[140px_1fr] ${
                i < specs.length - 1 ? "border-b border-[var(--line)]" : ""
              }`}
            >
              <div class="border-r border-[var(--line)] p-3 text-sm font-semibold text-[var(--clay)]">
                {label}
              </div>
              <div class="p-3 text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
});
```

- [ ] **Step 3: Run the full check + tests**

Run: `deno task check && deno task test`
Expected: fmt/lint/type-check clean, all tests PASS. Run `deno fmt` if needed.

- [ ] **Step 4: Commit**

```bash
git add islands/ProductDetail.tsx routes/shop/[slug].tsx
git commit -m "feat: detail page with gallery, variant selector and typed specs"
```

---

### Task 12: Full verification + manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Full automated gate**

Run: `deno task check && deno task test`
Expected: all green (fmt, lint, type-check, every test file).

- [ ] **Step 2: Manual smoke test in the dev server**

Run: `deno task dev` (open the printed URL, default http://localhost:5173).
Verify by eye:
- `/` shows the hero text, a **featured product band**, then the filter controls (category pills · material select · price slider) and category-grouped product sections.
- Selecting category "Keycaps" shows only the Choc-LP keycap products; choosing a material narrows further; the price slider drops higher-priced items; clearing all filters restores the grouped view.
- A product detail page (`/shop/mbk-blank-set`) shows the thumbnail gallery, variant pills that update the shown price, and the typed spec table (Profil / Kompatibel / Legenden …).
- `/shop` still redirects to `/` (unchanged from Phase 1); `/about`, `/blog`, `/printauftrag` still work.

Stop the dev server (Ctrl+C) when done.

- [ ] **Step 3: Commit (if `deno fmt` produced changes)**

```bash
git add -A
git commit -m "chore: formatting after catalog + storefront rebuild"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** typed per-category model + variants + generic channels (Task 2); price as cents + formatting (Task 3); KV repository (Task 4); demo catalog incl. Choc-LP keycaps (Task 5); category/material/price filters (Tasks 6, 9); editorial homepage with featured band (Task 10); detail page with gallery + variant selector + typed specs (Task 11); old Etsy-specific `marketplace` field removed with the old model (Task 10). Admin UI (auth, CRUD, image upload) is **Plan 2** — not in this plan.
- **Consistent names across tasks:** `Product`/`Variant`/`Channel`/`Category` from `@/lib/catalog.ts`; `categoryLabel`; `formatEuro`/`formatFrom`; repo `saveProduct`/`getProduct`/`listProducts`/`deleteProduct` (all take `kv` first); filters `categoriesOf`/`materialsOf`/`filterProducts`/`groupByCategory`; `getKv`; `seedIfEmpty`.
- **Green-commit ordering:** new modules (Tasks 2–7) are additive; the model switchover (Tasks 8–10) migrates `ProductCard`, `ShopFilter`, the homepage and `[slug].tsx` together and only then deletes the old `products`/`Product` from `lib/content.ts`, so `deno task check` is first run green at Task 10 Step 4. (Tasks 6/8 note this explicitly.)
- **Fresh data-shape caveat:** Task 10 flags the `ctx.render(ctx, data)` vs `return { data }` ambiguity and tells the implementer to follow the existing `[slug].tsx` pattern (`return { data: ... }`).
- **Out of scope (later):** cart/Stripe (C), Etsy/channel sync (D), admin (Plan 2).
