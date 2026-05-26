# Katalog-Admin (Teilprojekt A+B · Plan 2 von 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A password-protected admin area to create, edit and delete catalog products — including the variant list and image upload — backed by the same Deno KV repository built in Plan 1.

**Architecture:** A session module (`lib/session.ts`) stores opaque session IDs in Deno KV with a TTL; a signed-by-randomness cookie carries the ID. A `routes/admin/_middleware.ts` guards everything under `/admin` except the login page. Admin pages reuse the Plan 1 repository (`lib/products.ts`) and catalog types (`lib/catalog.ts`). Image upload writes files into `static/uploads/` (Docker/VPS writable FS — see spec). Fresh's global `csrf()` validates request Origin for state-changing methods, so same-origin admin forms need no extra token field.

**Tech Stack:** Deno (`--unstable-kv`), Fresh 2.2, Preact, `@preact/signals`, `@std/http/cookie`. Tests via Deno's runner.

**Spec:** [docs/superpowers/specs/2026-05-26-catalog-data-admin-design.md](../specs/2026-05-26-catalog-data-admin-design.md)
**Depends on:** [Plan 1](2026-05-26-catalog-storefront.md) (catalog model, KV repo, `getKv`). Implement Plan 1 first.

---

### Task 1: Session store (`lib/session.ts`)

**Files:**
- Create: `lib/session.ts`
- Test: `lib/session_test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/session_test.ts`:

```ts
import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { createSession, destroySession, isValidSession } from "@/lib/session.ts";

Deno.test("createSession returns a high-entropy id that validates", async () => {
  const kv = await Deno.openKv(":memory:");
  const id = await createSession(kv);
  assert(id.length >= 32, "session id too short");
  assertEquals(await isValidSession(kv, id), true);
  kv.close();
});

Deno.test("ids are unique per call", async () => {
  const kv = await Deno.openKv(":memory:");
  assertNotEquals(await createSession(kv), await createSession(kv));
  kv.close();
});

Deno.test("unknown id is invalid", async () => {
  const kv = await Deno.openKv(":memory:");
  assertEquals(await isValidSession(kv, "nope"), false);
  kv.close();
});

Deno.test("destroySession invalidates the id", async () => {
  const kv = await Deno.openKv(":memory:");
  const id = await createSession(kv);
  await destroySession(kv, id);
  assertEquals(await isValidSession(kv, id), false);
  kv.close();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/session_test.ts`
Expected: FAIL — module `lib/session.ts` not found.

- [ ] **Step 3: Write the implementation**

Create `lib/session.ts`:

```ts
const PREFIX = ["session"] as const;
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/** Hex-encode random bytes into an unguessable session id. */
function randomId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Create a session in KV with a TTL and return its opaque id. */
export async function createSession(kv: Deno.Kv): Promise<string> {
  const id = randomId();
  await kv.set([...PREFIX, id], { createdAt: Date.now() }, { expireIn: TTL_MS });
  return id;
}

/** True if the id maps to a live session. */
export async function isValidSession(kv: Deno.Kv, id: string): Promise<boolean> {
  if (!id) return false;
  const entry = await kv.get([...PREFIX, id]);
  return entry.value !== null;
}

/** Remove a session (logout). */
export async function destroySession(kv: Deno.Kv, id: string): Promise<void> {
  await kv.delete([...PREFIX, id]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/session_test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/session.ts lib/session_test.ts
git commit -m "feat: KV-backed session store for admin auth"
```

---

### Task 2: Upload filename helper + writer (`lib/uploads.ts`)

**Files:**
- Create: `lib/uploads.ts`
- Test: `lib/uploads_test.ts`

> The pure filename logic is unit-tested; the actual file write is a thin wrapper verified manually in Task 7.

- [ ] **Step 1: Write the failing test**

Create `lib/uploads_test.ts`:

```ts
import { assert, assertEquals } from "@std/assert";
import { uploadFileName } from "@/lib/uploads.ts";

Deno.test("uploadFileName keeps slug + extension and timestamps", () => {
  const name = uploadFileName("My Photo.JPG", "ripple-vase", 1700000000000);
  assertEquals(name, "ripple-vase-1700000000000.jpg");
});

Deno.test("uploadFileName falls back to bin for missing extension", () => {
  const name = uploadFileName("noext", "x", 5);
  assert(name.endsWith(".bin"), `expected .bin fallback, got ${name}`);
});

Deno.test("uploadFileName sanitises unsafe extension chars", () => {
  const name = uploadFileName("a.p n g", "x", 5);
  assertEquals(name, "x-5.png");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/uploads_test.ts`
Expected: FAIL — module `lib/uploads.ts` not found.

- [ ] **Step 3: Write the implementation**

Create `lib/uploads.ts`:

```ts
const UPLOAD_DIR = "static/uploads";

/** Build a safe, unique upload filename from the original name + slug + time. */
export function uploadFileName(
  originalName: string,
  slug: string,
  now: number,
): string {
  const dot = originalName.lastIndexOf(".");
  const rawExt = dot >= 0 ? originalName.slice(dot + 1) : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `${slug}-${now}.${ext}`;
}

/** Persist an uploaded file into static/uploads and return its public path. */
export async function saveUpload(file: File, slug: string): Promise<string> {
  const name = uploadFileName(file.name, slug, Date.now());
  await Deno.mkdir(UPLOAD_DIR, { recursive: true });
  await Deno.writeFile(
    `${UPLOAD_DIR}/${name}`,
    new Uint8Array(await file.arrayBuffer()),
  );
  return `/uploads/${name}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/uploads_test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/uploads.ts lib/uploads_test.ts
git commit -m "feat: upload filename helper + static/uploads writer"
```

---

### Task 3: Admin auth middleware + cookie helpers (`routes/admin/_middleware.ts`, `lib/admin-auth.ts`)

**Files:**
- Create: `lib/admin-auth.ts`
- Create: `routes/admin/_middleware.ts`

- [ ] **Step 1: Cookie helpers**

Create `lib/admin-auth.ts`:

```ts
import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

export const SESSION_COOKIE = "admin_session";

/** Read the session id from the request cookies (empty string if absent). */
export function readSessionCookie(headers: Headers): string {
  return getCookies(headers)[SESSION_COOKIE] ?? "";
}

/** Attach the session cookie to a response's headers. */
export function attachSessionCookie(headers: Headers, id: string): void {
  setCookie(headers, {
    name: SESSION_COOKIE,
    value: id,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Clear the session cookie on a response's headers. */
export function clearSessionCookie(headers: Headers): void {
  deleteCookie(headers, SESSION_COOKIE, { path: "/" });
}
```

- [ ] **Step 2: Guard middleware**

Create `routes/admin/_middleware.ts`:

```ts
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { isValidSession } from "@/lib/session.ts";
import { readSessionCookie } from "@/lib/admin-auth.ts";

export default define.middleware(async (ctx) => {
  // Let the login page (GET form + POST handler) through unguarded.
  if (ctx.url.pathname === "/admin/login") return ctx.next();

  const id = readSessionCookie(ctx.req.headers);
  if (id && (await isValidSession(await getKv(), id))) return ctx.next();

  return ctx.redirect("/admin/login");
});
```

- [ ] **Step 3: Type-check**

Run: `deno check lib/admin-auth.ts routes/admin/_middleware.ts`
Expected: PASS (no type errors). (Behaviour is exercised in Task 4’s manual check.)

- [ ] **Step 4: Commit**

```bash
git add lib/admin-auth.ts routes/admin/_middleware.ts
git commit -m "feat: admin session cookie helpers + guard middleware"
```

---

### Task 4: Login + logout (`routes/admin/login.tsx`, `routes/admin/logout.ts`)

**Files:**
- Create: `routes/admin/login.tsx`
- Create: `routes/admin/logout.ts`

> The admin password comes from `ADMIN_PASSWORD` (server-only env). Add it to `.env` for local dev.

- [ ] **Step 1: Add the env var**

Append to `.env` (do not commit secrets beyond local dev defaults):

```sh
ADMIN_PASSWORD=changeme-local
```

- [ ] **Step 2: Login route**

Create `routes/admin/login.tsx`:

```tsx
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { createSession } from "@/lib/session.ts";
import { attachSessionCookie } from "@/lib/admin-auth.ts";

export const handler = define.handlers({
  GET() {
    return { data: { error: false } };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const password = form.get("password")?.toString() ?? "";
    const expected = Deno.env.get("ADMIN_PASSWORD") ?? "";
    if (!expected || password !== expected) {
      return ctx.render(ctx, { error: true });
    }
    const id = await createSession(await getKv());
    const headers = new Headers({ location: "/admin" });
    attachSessionCookie(headers, id);
    return new Response(null, { status: 303, headers });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <section class="shell flex min-h-[70vh] items-center justify-center py-16">
    <form method="post" class="card w-full max-w-sm p-6">
      <p class="eyebrow text-[var(--clay)]">Admin</p>
      <h1 class="display mt-3 text-3xl font-semibold">Anmelden</h1>
      {data.error && (
        <p class="mt-3 text-sm text-[var(--oxide)]">Falsches Passwort.</p>
      )}
      <label class="mt-5 block">
        <span class="eyebrow opacity-70">Passwort</span>
        <input type="password" name="password" class="field mt-1" required />
      </label>
      <button type="submit" class="button mt-5 w-full">Einloggen</button>
    </form>
  </section>
));
```

> If `deno check` flags `ctx.render(ctx, ...)`, mirror the codebase pattern and return `{ data: { error: true } }` with a non-200 status via `ctx.render` options, or simply `return { data: { error: true } };` (the page reads `data.error`). Keep it consistent with `routes/shop/[slug].tsx`.

- [ ] **Step 3: Logout route**

Create `routes/admin/logout.ts`:

```ts
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { destroySession } from "@/lib/session.ts";
import {
  clearSessionCookie,
  readSessionCookie,
} from "@/lib/admin-auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const id = readSessionCookie(ctx.req.headers);
    if (id) await destroySession(await getKv(), id);
    const headers = new Headers({ location: "/admin/login" });
    clearSessionCookie(headers);
    return new Response(null, { status: 303, headers });
  },
});
```

- [ ] **Step 4: Manual check**

Run: `deno task dev`, open `/admin` → should redirect to `/admin/login`. Submit wrong password → "Falsches Passwort." Submit `changeme-local` → lands on `/admin` (404 page for now is fine; the index comes in Task 5). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add routes/admin/login.tsx routes/admin/logout.ts .env
git commit -m "feat: admin login + logout with KV session"
```

---

### Task 5: Admin product list (`routes/admin/index.tsx`)

**Files:**
- Create: `routes/admin/index.tsx`

- [ ] **Step 1: Write the list page**

Create `routes/admin/index.tsx`:

```tsx
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const products = await listProducts(await getKv());
    return ctx.render(ctx, products);
  },
});

export default define.page<typeof handler>(({ data }) => {
  const products = data as Product[];
  return (
    <section class="shell py-12">
      <div class="flex items-center justify-between gap-4">
        <h1 class="display text-4xl font-semibold">Produkte</h1>
        <div class="flex gap-2">
          <a href="/admin/new" class="button">Neues Produkt</a>
          <form method="post" action="/admin/logout">
            <button type="submit" class="button secondary">Logout</button>
          </form>
        </div>
      </div>

      <div class="mt-8 overflow-hidden rounded-[8px] border border-[var(--line)]">
        {products.map((product, i) => (
          <div
            class={`grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 ${
              i < products.length - 1 ? "border-b border-[var(--line)]" : ""
            }`}
          >
            <div>
              <p class="font-semibold">{product.name}</p>
              <p class="text-sm opacity-70">
                {categoryLabel(product.category)} · {formatFrom(product.fromPriceCents)}
                {" · "}
                {product.variants.length} Varianten
              </p>
            </div>
            <a href={`/admin/${product.slug}`} class="button secondary">Bearbeiten</a>
            <form method="post" action={`/admin/${product.slug}/delete`}>
              <button type="submit" class="button secondary">Löschen</button>
            </form>
          </div>
        ))}
        {products.length === 0 && <p class="p-4 opacity-70">Noch keine Produkte.</p>}
      </div>
    </section>
  );
});
```

> Resolve `ctx.render(ctx, products)` vs `return { data: products }` the same way as in Plan 1 Task 10 — follow the codebase convention.

- [ ] **Step 2: Manual check**

Run: `deno task dev`, log in, open `/admin` → seeded products listed with Bearbeiten/Löschen and a Neues-Produkt button. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add routes/admin/index.tsx
git commit -m "feat: admin product list with edit/delete/new actions"
```

---

### Task 6: Variant editor island (`islands/VariantEditor.tsx`)

**Files:**
- Create: `islands/VariantEditor.tsx`

> The editor manages variant rows client-side and writes the array as JSON into a hidden input named `variants`, which the form handler (Task 7) parses. Keeps the form a standard POST.

- [ ] **Step 1: Create the island**

Create `islands/VariantEditor.tsx`:

```tsx
import { useSignal } from "@preact/signals";
import type { Variant } from "@/lib/catalog.ts";

type Row = { id: string; label: string; euro: string; color: string };

function toRows(variants: Variant[]): Row[] {
  return variants.map((v) => ({
    id: v.id,
    label: v.label,
    euro: (v.priceCents / 100).toFixed(2),
    color: v.attributes["Farbe"] ?? "",
  }));
}

function toVariants(rows: Row[]): Variant[] {
  return rows.map((r) => ({
    id: r.id || r.label.toLowerCase().replace(/\s+/g, "-"),
    label: r.label,
    priceCents: Math.round(parseFloat(r.euro.replace(",", ".")) * 100) || 0,
    attributes: r.color ? { Farbe: r.color } : {},
  }));
}

export default function VariantEditor(
  { initial }: { initial: Variant[] },
) {
  const rows = useSignal<Row[]>(
    initial.length ? toRows(initial) : [{ id: "", label: "", euro: "", color: "" }],
  );

  const update = (i: number, key: keyof Row, value: string) => {
    const next = [...rows.value];
    next[i] = { ...next[i], [key]: value };
    rows.value = next;
  };

  return (
    <div>
      <input
        type="hidden"
        name="variants"
        value={JSON.stringify(toVariants(rows.value))}
      />
      <div class="flex flex-col gap-3">
        {rows.value.map((row, i) => (
          <div class="grid grid-cols-[1fr_90px_1fr_auto] gap-2">
            <input
              class="field"
              placeholder="Label (z. B. Charcoal · 36er)"
              value={row.label}
              onInput={(e) => update(i, "label", (e.target as HTMLInputElement).value)}
            />
            <input
              class="field"
              placeholder="€"
              inputMode="decimal"
              value={row.euro}
              onInput={(e) => update(i, "euro", (e.target as HTMLInputElement).value)}
            />
            <input
              class="field"
              placeholder="Farbe (optional)"
              value={row.color}
              onInput={(e) => update(i, "color", (e.target as HTMLInputElement).value)}
            />
            <button
              type="button"
              class="button secondary"
              onClick={() => (rows.value = rows.value.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        class="button secondary mt-3"
        onClick={() =>
          (rows.value = [...rows.value, { id: "", label: "", euro: "", color: "" }])}
      >
        Variante hinzufügen
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add islands/VariantEditor.tsx
git commit -m "feat: client-side variant editor island (serialises to hidden input)"
```

---

### Task 7: Create + edit product form (`components/ProductForm.tsx`, `routes/admin/new.tsx`, `routes/admin/[slug].tsx`)

**Files:**
- Create: `components/ProductForm.tsx`
- Create: `lib/product-form.ts`
- Test: `lib/product-form_test.ts`
- Create: `routes/admin/new.tsx`
- Create: `routes/admin/[slug].tsx`

> A pure builder (`lib/product-form.ts`) turns submitted `FormData` field values into a typed `Product`; it’s unit-tested. The route handlers handle the image file (side effect) and call the builder + repository.

- [ ] **Step 1: Write the failing builder test**

Create `lib/product-form_test.ts`:

```ts
import { assertEquals } from "@std/assert";
import { buildProduct } from "@/lib/product-form.ts";

Deno.test("buildProduct assembles a keycap product from form fields", () => {
  const fields = {
    slug: "mbk-blank-set",
    name: "MBK Blank Set",
    category: "keycap",
    description: "Caps",
    materials: "PLA Matte, PETG",
    leadTime: "3-5 Werktage",
    images: "/uploads/a.jpg",
    variants: JSON.stringify([
      { id: "c-36", label: "Charcoal 36", priceCents: 1800, attributes: { Farbe: "Charcoal" } },
    ]),
    profile: "MBK",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
  };
  const product = buildProduct(fields);
  assertEquals(product.category, "keycap");
  assertEquals(product.materials, ["PLA Matte", "PETG"]);
  assertEquals(product.variants.length, 1);
  if (product.category === "keycap") {
    assertEquals(product.switchCompat, "Kailh Choc v1");
  }
});

Deno.test("buildProduct reads vase-specific numeric fields", () => {
  const product = buildProduct({
    slug: "v",
    name: "V",
    category: "vase",
    description: "",
    materials: "PLA Matte",
    leadTime: "x",
    images: "/uploads/v.jpg",
    variants: "[]",
    heightMm: "180",
    volumeMl: "600",
    watertight: "on",
  });
  if (product.category === "vase") {
    assertEquals(product.heightMm, 180);
    assertEquals(product.watertight, true);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `deno test -A --unstable-kv lib/product-form_test.ts`
Expected: FAIL — module `lib/product-form.ts` not found.

- [ ] **Step 3: Write the builder**

Create `lib/product-form.ts`:

```ts
import type { Product, Variant } from "@/lib/catalog.ts";

export type FormFields = Record<string, string>;

function list(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Build a typed Product from flat form field strings. Variants arrive as JSON. */
export function buildProduct(f: FormFields): Product {
  const variants = JSON.parse(f.variants || "[]") as Variant[];
  const base = {
    slug: f.slug,
    name: f.name,
    description: f.description ?? "",
    images: list(f.images),
    materials: list(f.materials),
    fromPriceCents: 0, // repo recomputes on save
    leadTime: f.leadTime ?? "",
    variants,
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  };
  switch (f.category) {
    case "vase":
      return {
        ...base,
        category: "vase",
        heightMm: Number(f.heightMm) || 0,
        volumeMl: Number(f.volumeMl) || 0,
        watertight: f.watertight === "on",
      };
    case "planter":
      return {
        ...base,
        category: "planter",
        diameterMm: Number(f.diameterMm) || 0,
        drainage: f.drainage === "on",
      };
    case "keycap":
      return {
        ...base,
        category: "keycap",
        profile: f.profile ?? "",
        switchCompat: f.switchCompat ?? "",
        legends: f.legends === "legends" ? "legends" : "blank",
      };
    default:
      return {
        ...base,
        category: "organisation",
        dimensions: f.dimensions ?? "",
      };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `deno test -A --unstable-kv lib/product-form_test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit the builder**

```bash
git add lib/product-form.ts lib/product-form_test.ts
git commit -m "feat: typed Product builder from admin form fields"
```

- [ ] **Step 6: Write the shared form component**

Create `components/ProductForm.tsx`. It renders all base fields, the category select, every category-specific field group (always present; the builder reads only those matching the chosen category), the image upload + current images hidden field, and the variant editor island.

```tsx
import type { Product } from "@/lib/catalog.ts";
import { CATEGORY_LABELS } from "@/lib/catalog.ts";
import VariantEditor from "@/islands/VariantEditor.tsx";

export default function ProductForm(
  { product, action }: { product?: Product; action: string },
) {
  const p = product;
  return (
    <form method="post" action={action} encType="multipart/form-data" class="grid gap-5">
      <label class="block">
        <span class="eyebrow opacity-70">Slug</span>
        <input name="slug" class="field mt-1" value={p?.slug ?? ""} required readOnly={!!p} />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Name</span>
        <input name="name" class="field mt-1" value={p?.name ?? ""} required />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Kategorie</span>
        <select name="category" class="field mt-1">
          {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((c) => (
            <option value={c} selected={p?.category === c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Beschreibung</span>
        <textarea name="description" class="field mt-1" rows={3}>{p?.description ?? ""}</textarea>
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Materialien (Komma-getrennt)</span>
        <input name="materials" class="field mt-1" value={p?.materials.join(", ") ?? ""} />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Lieferzeit</span>
        <input name="leadTime" class="field mt-1" value={p?.leadTime ?? ""} />
      </label>

      <fieldset class="grid gap-3 rounded-[8px] border border-[var(--line)] p-4">
        <legend class="eyebrow px-1">Kategorie-Specs (nur passende werden gespeichert)</legend>
        <input name="heightMm" class="field" placeholder="Vase: Höhe (mm)" value={p?.category === "vase" ? p.heightMm : ""} />
        <input name="volumeMl" class="field" placeholder="Vase: Volumen (ml)" value={p?.category === "vase" ? p.volumeMl : ""} />
        <label class="flex items-center gap-2"><input type="checkbox" name="watertight" checked={p?.category === "vase" && p.watertight} /> Vase: wasserdicht</label>
        <input name="diameterMm" class="field" placeholder="Planter: Durchmesser (mm)" value={p?.category === "planter" ? p.diameterMm : ""} />
        <label class="flex items-center gap-2"><input type="checkbox" name="drainage" checked={p?.category === "planter" && p.drainage} /> Planter: Drainage</label>
        <input name="profile" class="field" placeholder="Keycap: Profil" value={p?.category === "keycap" ? p.profile : ""} />
        <input name="switchCompat" class="field" placeholder="Keycap: Kompatibilität" value={p?.category === "keycap" ? p.switchCompat : ""} />
        <select name="legends" class="field">
          <option value="blank" selected={p?.category === "keycap" && p.legends === "blank"}>Blank</option>
          <option value="legends" selected={p?.category === "keycap" && p.legends === "legends"}>Mit Legenden</option>
        </select>
        <input name="dimensions" class="field" placeholder="Organisation: Maße" value={p?.category === "organisation" ? p.dimensions : ""} />
      </fieldset>

      <div>
        <span class="eyebrow opacity-70">Bilder</span>
        <input type="hidden" name="images" value={p?.images.join(", ") ?? ""} />
        <input type="file" name="image" accept="image/*" class="field mt-1" />
        <p class="mt-1 text-sm opacity-70">Aktuell: {p?.images.join(", ") || "—"}</p>
      </div>

      <div>
        <span class="eyebrow opacity-70">Varianten</span>
        <div class="mt-2"><VariantEditor initial={p?.variants ?? []} /></div>
      </div>

      <button type="submit" class="button w-fit">Speichern</button>
    </form>
  );
}
```

- [ ] **Step 7: Write the new + edit routes**

Create `routes/admin/new.tsx`:

```tsx
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { saveProduct } from "@/lib/products.ts";
import { buildProduct, type FormFields } from "@/lib/product-form.ts";
import { saveUpload } from "@/lib/uploads.ts";
import ProductForm from "@/components/ProductForm.tsx";

export const handler = define.handlers({
  GET() {
    return { data: {} };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const fields: FormFields = {};
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = v;
    }
    const file = form.get("image");
    if (file instanceof File && file.size > 0) {
      fields.images = await saveUpload(file, fields.slug);
    }
    await saveProduct(await getKv(), buildProduct(fields));
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});

export default define.page(function NewProduct() {
  return (
    <section class="shell py-12">
      <a href="/admin" class="eyebrow text-[var(--clay)]">← Produkte</a>
      <h1 class="display mt-4 mb-8 text-4xl font-semibold">Neues Produkt</h1>
      <ProductForm action="/admin/new" />
    </section>
  );
});
```

Create `routes/admin/[slug].tsx`:

```tsx
import { HttpError } from "fresh";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct, saveProduct } from "@/lib/products.ts";
import { buildProduct, type FormFields } from "@/lib/product-form.ts";
import { saveUpload } from "@/lib/uploads.ts";
import ProductForm from "@/components/ProductForm.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProduct(await getKv(), ctx.params.slug);
    if (!product) throw new HttpError(404, "Product not found");
    return { data: { product } };
  },
  async POST(ctx) {
    const existing = await getProduct(await getKv(), ctx.params.slug);
    if (!existing) throw new HttpError(404, "Product not found");
    const form = await ctx.req.formData();
    const fields: FormFields = { slug: ctx.params.slug };
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = v;
    }
    const file = form.get("image");
    if (file instanceof File && file.size > 0) {
      fields.images = await saveUpload(file, ctx.params.slug);
    } else {
      fields.images = existing.images.join(", ");
    }
    await saveProduct(await getKv(), buildProduct(fields));
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <section class="shell py-12">
    <a href="/admin" class="eyebrow text-[var(--clay)]">← Produkte</a>
    <h1 class="display mt-4 mb-8 text-4xl font-semibold">{data.product.name}</h1>
    <ProductForm product={data.product} action={`/admin/${data.product.slug}`} />
  </section>
));
```

- [ ] **Step 8: Run full check + tests**

Run: `deno task check && deno task test`
Expected: green. Run `deno fmt` if needed.

- [ ] **Step 9: Commit**

```bash
git add components/ProductForm.tsx routes/admin/new.tsx routes/admin/[slug].tsx
git commit -m "feat: admin create/edit product form with image upload + variants"
```

---

### Task 8: Delete route (`routes/admin/[slug]/delete.ts`)

**Files:**
- Create: `routes/admin/[slug]/delete.ts`

- [ ] **Step 1: Write the delete handler**

Create `routes/admin/[slug]/delete.ts`:

```ts
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { deleteProduct } from "@/lib/products.ts";

export const handler = define.handlers({
  async POST(ctx) {
    await deleteProduct(await getKv(), ctx.params.slug);
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});
```

> Route nesting: `routes/admin/[slug]/delete.ts` maps to `/admin/:slug/delete` and is still covered by `routes/admin/_middleware.ts`. The edit page lives at `/admin/:slug` (`routes/admin/[slug].tsx`) — both coexist.

- [ ] **Step 2: Run full check + tests**

Run: `deno task check && deno task test`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add routes/admin/[slug]/delete.ts
git commit -m "feat: admin delete product route"
```

---

### Task 9: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Full automated gate**

Run: `deno task check && deno task test`
Expected: all green.

- [ ] **Step 2: Manual admin flow**

Run: `deno task dev`. Then:
- `/admin` → redirects to `/admin/login`; correct password lands on `/admin` with the seeded products.
- "Neues Produkt": create a keycap with two variants and an uploaded image → appears in the list and on `/` (after the homepage loads from KV) and its `/shop/<slug>` page shows the variants + uploaded image.
- "Bearbeiten" an existing product: change price/variants, save → reflected on the storefront.
- "Löschen": removes it from the list and storefront.
- "Logout": returns to login; `/admin` is guarded again.
- Confirm the uploaded file exists under `static/uploads/`.

Stop the server.

- [ ] **Step 3: Commit (if `deno fmt` produced changes)**

```bash
git add -A
git commit -m "chore: formatting after admin implementation"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** password + KV session (Tasks 1, 3, 4); guarded `/admin` (Task 3); product list (Task 5); create/edit with variant editor + image upload to `static/` (Tasks 6, 7); delete (Task 8); generic `channels` retained on the model (Plan 1) — admin leaves it empty by default (channel editing UI is out of scope, data-only). Multi-user/roles explicitly out of scope.
- **Consistent names:** `createSession`/`isValidSession`/`destroySession` (kv first); `SESSION_COOKIE`/`readSessionCookie`/`attachSessionCookie`/`clearSessionCookie`; `uploadFileName`/`saveUpload`; `buildProduct`/`FormFields`; repo + catalog imports identical to Plan 1.
- **CSRF:** Fresh’s global `csrf()` validates Origin for POST — same-origin admin forms pass without a token field; documented in the header.
- **Data-shape caveat:** login/list pages flag the `ctx.render` vs `{ data }` ambiguity; follow the codebase convention (`return { data: ... }`).
- **Security note:** `ADMIN_PASSWORD` is server-only (no `FRESH_PUBLIC_` prefix) and compared directly; the session id is 256 bits of CSPRNG. `.env` holds only a local dev default — set a real value via the deployment environment.
