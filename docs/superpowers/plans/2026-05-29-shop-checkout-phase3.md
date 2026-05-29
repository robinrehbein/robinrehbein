# Shop Checkout (Stripe) — Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Steps use `- [ ]` checkboxes.

**Goal:** A working embedded checkout: the cart drawer leads to `/checkout`, where
the customer enters a shipping address and pays via the Stripe Payment Element. The
server recomputes the amount from KV prices, creates a PaymentIntent, persists a
pending order, and a Stripe webhook marks it paid.

**Architecture:** Server-side Stripe SDK (`npm:stripe`, fetch HTTP client for Deno)
creates PaymentIntents; the publishable key is passed from the route handler to the
island as a prop (no client env inlining). Order amounts are NEVER trusted from the
client — `lib/orders.ts` resolves `{slug,variantId,qty}` against KV products and
sums real prices (pure + unit-tested). The Payment Element is mounted client-side
via `@stripe/stripe-js`. A webhook is the source of truth for paid status.

**Tech Stack:** Fresh 2.2, Deno KV, `npm:stripe@^18`, `npm:@stripe/stripe-js`,
`@preact/signals`.

**Required env (server-only):** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`,
`STRIPE_WEBHOOK_SECRET`. Without them the flow renders but cannot complete a payment.

---

## File Structure

- Modify `deno.json` — add `stripe` and `@stripe/stripe-js` imports.
- Modify `.env.example` — document the three Stripe vars.
- Create `lib/orders.ts` (+ `lib/orders_test.ts`) — Order types, pure
  `resolveOrderLines`, KV `saveOrder`/`getOrder`/`markOrderPaid`.
- Create `lib/stripe.ts` — server Stripe client + webhook event parser from env.
- Create `routes/api/checkout/payment-intent.ts` — POST: resolve cart → PI → order.
- Create `routes/api/stripe/webhook.ts` — verify signature, mark order paid.
- Create `routes/checkout/index.tsx` — checkout page, passes publishable key.
- Create `islands/CheckoutForm.tsx` — reads cart, posts items, mounts Payment Element.
- Create `routes/checkout/success.tsx` — confirmation; clears cart.
- Create `islands/ClearCart.tsx` — clears the client cart on success mount.
- Modify `lib/cart-store.ts` — add `clearCart()`.
- Modify `islands/CartDrawer.tsx` — "Zur Kasse" becomes an enabled link to `/checkout`.

---

## Task 1: Add dependencies

**Files:** Modify `deno.json`, `.env.example`

- [ ] **Step 1: Add imports to `deno.json`**

Add to the `imports` map:

```json
"stripe": "npm:stripe@^18",
"@stripe/stripe-js": "npm:@stripe/stripe-js@^4"
```

- [ ] **Step 2: Document env in `.env.example`**

Append:

```
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

- [ ] **Step 3: Cache + commit**

Run: `deno cache npm:stripe@^18`
```bash
git add deno.json deno.lock .env.example
git commit -m "build(checkout): add stripe + stripe-js deps, document env"
```

---

## Task 2: Orders domain (`lib/orders.ts`)

**Files:** Create `lib/orders.ts`, `lib/orders_test.ts`

- [ ] **Step 1: Write failing tests for `resolveOrderLines`**

```ts
import { assertEquals, assertThrows } from "@std/assert";
import { resolveOrderLines } from "@/lib/orders.ts";
import type { Product, VaseProduct } from "@/lib/catalog.ts";

const vase = (over: Partial<VaseProduct> = {}): Product => ({
  slug: "vase",
  name: "Vase",
  category: "vase",
  description: "",
  images: ["/v.jpg"],
  materials: ["PLA Matte"],
  fromPriceCents: 2000,
  leadTime: "3-5 Tage",
  heightMm: 150,
  volumeMl: 500,
  watertight: true,
  variants: [
    { id: "charcoal", label: "Charcoal", priceCents: 2000, attributes: {} },
    { id: "sage", label: "Sage", priceCents: 2500, attributes: {} },
  ],
  channels: [],
  createdAt: 0,
  updatedAt: 0,
  ...over,
});

Deno.test("resolveOrderLines sums real prices from products", () => {
  const { lines, amountCents } = resolveOrderLines([vase()], [
    { slug: "vase", variantId: "charcoal", qty: 2 },
    { slug: "vase", variantId: "sage", qty: 1 },
  ]);
  assertEquals(amountCents, 2000 * 2 + 2500);
  assertEquals(lines.length, 2);
  assertEquals(lines[0].name, "Vase");
});

Deno.test("resolveOrderLines ignores client-supplied prices", () => {
  // deno-lint-ignore no-explicit-any
  const items = [{ slug: "vase", variantId: "charcoal", qty: 1, priceCents: 1 }] as any;
  const { amountCents } = resolveOrderLines([vase()], items);
  assertEquals(amountCents, 2000);
});

Deno.test("resolveOrderLines throws on unknown product", () => {
  assertThrows(() => resolveOrderLines([vase()], [{ slug: "x", variantId: "charcoal", qty: 1 }]));
});

Deno.test("resolveOrderLines throws on unknown variant", () => {
  assertThrows(() => resolveOrderLines([vase()], [{ slug: "vase", variantId: "nope", qty: 1 }]));
});

Deno.test("resolveOrderLines throws on non-positive qty", () => {
  assertThrows(() => resolveOrderLines([vase()], [{ slug: "vase", variantId: "charcoal", qty: 0 }]));
});

Deno.test("resolveOrderLines throws on empty cart", () => {
  assertThrows(() => resolveOrderLines([vase()], []));
});
```

- [ ] **Step 2: Run to verify failure**

Run: `deno test lib/orders_test.ts -A`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/orders.ts`**

```ts
import type { Product } from "@/lib/catalog.ts";

/** A requested cart item from the client (prices are NOT trusted). */
export type OrderRequestItem = { slug: string; variantId: string; qty: number };

/** A resolved order line with server-authoritative pricing. */
export type OrderItem = {
  slug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  qty: number;
};

export type OrderStatus = "pending" | "paid";

export type Order = {
  id: string; // Stripe PaymentIntent id
  items: OrderItem[];
  amountCents: number;
  currency: "eur";
  status: OrderStatus;
  email?: string;
  createdAt: number;
};

/**
 * Resolve client-requested items against real products, summing authoritative
 * prices. Throws on empty cart, unknown product/variant, or non-positive qty.
 */
export function resolveOrderLines(
  products: Product[],
  items: OrderRequestItem[],
): { lines: OrderItem[]; amountCents: number } {
  if (items.length === 0) throw new Error("Warenkorb ist leer.");
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines: OrderItem[] = [];
  for (const item of items) {
    if (!Number.isInteger(item.qty) || item.qty < 1) {
      throw new Error(`Ungültige Menge für ${item.slug}.`);
    }
    const product = bySlug.get(item.slug);
    if (!product) throw new Error(`Produkt nicht gefunden: ${item.slug}.`);
    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      throw new Error(`Variante nicht gefunden: ${item.variantId}.`);
    }
    lines.push({
      slug: product.slug,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      priceCents: variant.priceCents,
      qty: item.qty,
    });
  }
  const amountCents = lines.reduce((n, l) => n + l.priceCents * l.qty, 0);
  return { lines, amountCents };
}

const PREFIX = ["order"] as const;

export async function saveOrder(kv: Deno.Kv, order: Order): Promise<void> {
  await kv.set([...PREFIX, order.id], order);
}

export async function getOrder(kv: Deno.Kv, id: string): Promise<Order | null> {
  const entry = await kv.get<Order>([...PREFIX, id]);
  return entry.value;
}

export async function markOrderPaid(kv: Deno.Kv, id: string): Promise<void> {
  const entry = await kv.get<Order>([...PREFIX, id]);
  if (!entry.value) return;
  await kv.set([...PREFIX, id], { ...entry.value, status: "paid" });
}
```

- [ ] **Step 4: Run to verify pass**

Run: `deno test lib/orders_test.ts -A`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/orders.ts lib/orders_test.ts
git commit -m "feat(checkout): order resolution (server-authoritative prices) + KV store"
```

---

## Task 3: Stripe server client (`lib/stripe.ts`)

**Files:** Create `lib/stripe.ts`

- [ ] **Step 1: Implement**

```ts
import Stripe from "stripe";

let client: Stripe | undefined;

/** Lazily build the Stripe client; throws if the secret key is missing. */
export function getStripe(): Stripe {
  if (client) return client;
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  client = new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
    apiVersion: "2025-08-27.basil",
  });
  return client;
}

/** Verify and parse a Stripe webhook event using async SubtleCrypto. */
export function constructWebhookEvent(
  payload: string,
  signature: string,
): Promise<Stripe.Event> {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET ist nicht gesetzt.");
  return getStripe().webhooks.constructEventAsync(
    payload,
    signature,
    secret,
    undefined,
    Stripe.createSubtleCryptoProvider(),
  );
}
```

- [ ] **Step 2: Type-check**

Run: `deno check lib/stripe.ts`
Expected: passes. (If `apiVersion` literal is rejected by the type, drop the
`apiVersion` line — the SDK default is fine.)

- [ ] **Step 3: Commit**

```bash
git add lib/stripe.ts
git commit -m "feat(checkout): server stripe client + webhook verifier"
```

---

## Task 4: Payment-intent API (`routes/api/checkout/payment-intent.ts`)

**Files:** Create `routes/api/checkout/payment-intent.ts`

- [ ] **Step 1: Implement**

```ts
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct } from "@/lib/products.ts";
import {
  type Order,
  type OrderRequestItem,
  resolveOrderLines,
  saveOrder,
} from "@/lib/orders.ts";
import { getStripe } from "@/lib/stripe.ts";
import type { Product } from "@/lib/catalog.ts";

export const handler = define.handlers({
  async POST(ctx) {
    let body: { items?: OrderRequestItem[] };
    try {
      body = await ctx.req.json();
    } catch {
      return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }
    const items = body.items ?? [];

    // Load each requested product from KV (deduped).
    const kv = await getKv();
    const slugs = [...new Set(items.map((i) => i.slug))];
    const loaded = await Promise.all(slugs.map((s) => getProduct(kv, s)));
    const products = loaded.filter((p): p is Product => p !== null);

    let resolved;
    try {
      resolved = resolveOrderLines(products, items);
    } catch (err) {
      return Response.json({ error: (err as Error).message }, { status: 400 });
    }

    let intent;
    try {
      intent = await getStripe().paymentIntents.create({
        amount: resolved.amountCents,
        currency: "eur",
        automatic_payment_methods: { enabled: true },
      });
    } catch (err) {
      console.error("Stripe PaymentIntent fehlgeschlagen:", err);
      return Response.json(
        { error: "Zahlung konnte nicht initialisiert werden." },
        { status: 502 },
      );
    }

    const order: Order = {
      id: intent.id,
      items: resolved.lines,
      amountCents: resolved.amountCents,
      currency: "eur",
      status: "pending",
      createdAt: Date.now(),
    };
    await saveOrder(kv, order);

    return Response.json({
      clientSecret: intent.client_secret,
      amountCents: resolved.amountCents,
      lines: resolved.lines,
    });
  },
});
```

- [ ] **Step 2: Type-check**

Run: `deno check routes/api/checkout/payment-intent.ts`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add routes/api/checkout/payment-intent.ts
git commit -m "feat(checkout): payment-intent endpoint (server-priced)"
```

---

## Task 5: Webhook (`routes/api/stripe/webhook.ts`)

**Files:** Create `routes/api/stripe/webhook.ts`

- [ ] **Step 1: Implement**

```ts
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { markOrderPaid } from "@/lib/orders.ts";
import { constructWebhookEvent } from "@/lib/stripe.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const signature = ctx.req.headers.get("stripe-signature");
    if (!signature) return new Response("Missing signature", { status: 400 });

    const payload = await ctx.req.text();
    let event;
    try {
      event = await constructWebhookEvent(payload, signature);
    } catch (err) {
      console.error("Webhook-Signatur ungültig:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as { id: string };
      await markOrderPaid(await getKv(), intent.id);
    }

    return new Response("ok", { status: 200 });
  },
});
```

- [ ] **Step 2: Type-check**

Run: `deno check routes/api/stripe/webhook.ts`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add routes/api/stripe/webhook.ts
git commit -m "feat(checkout): stripe webhook marks orders paid"
```

---

## Task 6: `clearCart` store action + drawer link

**Files:** Modify `lib/cart-store.ts`, `islands/CartDrawer.tsx`

- [ ] **Step 1: Add `clearCart` to `lib/cart-store.ts`**

```ts
export function clearCart(): void {
  cartLines.value = [];
}
```

- [ ] **Step 2: Make "Zur Kasse" an enabled link in `CartDrawer.tsx`**

Replace the disabled `<button ...>Zur Kasse</button>` with:

```tsx
<a
  href="/checkout"
  onClick={closeCart}
  class={`button mt-4 w-full ${
    lines.length === 0 ? "pointer-events-none opacity-50" : ""
  }`}
  aria-disabled={lines.length === 0 ? "true" : "false"}
>
  Zur Kasse
</a>
```

- [ ] **Step 3: Type-check + commit**

Run: `deno check lib/cart-store.ts islands/CartDrawer.tsx`
```bash
git add lib/cart-store.ts islands/CartDrawer.tsx
git commit -m "feat(checkout): clearCart action + enable checkout link"
```

---

## Task 7: Checkout page + island

**Files:** Create `routes/checkout/index.tsx`, `islands/CheckoutForm.tsx`

- [ ] **Step 1: Implement the route (passes publishable key)**

```tsx
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import CheckoutForm from "@/islands/CheckoutForm.tsx";

export const handler = define.handlers({
  GET() {
    return {
      data: { publishableKey: Deno.env.get("STRIPE_PUBLISHABLE_KEY") ?? "" },
    };
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <Head>
      <title>Kasse - Robin Rehbein Shop</title>
      <meta name="robots" content="noindex" />
    </Head>
    <section class="shell max-w-3xl py-12">
      <h1 class="display mb-8 text-3xl font-semibold md:text-4xl">Kasse</h1>
      <CheckoutForm publishableKey={data.publishableKey} />
    </section>
  </>
));
```

- [ ] **Step 2: Implement the island**

```tsx
import { useEffect, useRef, useState } from "preact/hooks";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import { cartLines } from "@/lib/cart-store.ts";
import { formatEuro } from "@/lib/price.ts";

type Status = "loading" | "ready" | "processing" | "error" | "empty";

export default function CheckoutForm(
  { publishableKey }: { publishableKey: string },
) {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const paymentRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);

  useEffect(() => {
    const lines = cartLines.value;
    if (lines.length === 0) {
      setStatus("empty");
      return;
    }
    if (!publishableKey) {
      setStatus("error");
      setMessage("Zahlung ist noch nicht konfiguriert (Stripe-Key fehlt).");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/payment-intent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: lines.map((l) => ({
              slug: l.slug,
              variantId: l.variantId,
              qty: l.qty,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Fehler beim Checkout.");
        if (cancelled) return;
        setAmount(data.amountCents);

        const stripe = await loadStripe(publishableKey);
        if (!stripe) throw new Error("Stripe konnte nicht geladen werden.");
        stripeRef.current = stripe;
        const elements = stripe.elements({ clientSecret: data.clientSecret });
        elementsRef.current = elements;
        elements.create("address", { mode: "shipping" }).mount(
          addressRef.current!,
        );
        elements.create("payment").mount(paymentRef.current!);
        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage((err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publishableKey]);

  async function submit(e: Event) {
    e.preventDefault();
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) return;
    setStatus("processing");
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    if (error) {
      setStatus("ready");
      setMessage(error.message ?? "Zahlung fehlgeschlagen.");
    }
  }

  if (status === "empty") {
    return (
      <p class="text-[var(--muted)]">
        Dein Warenkorb ist leer. <a href="/" class="text-[var(--accent)]">
          Weiter shoppen →
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={submit} class="grid gap-6">
      {amount > 0 && (
        <div class="flex items-center justify-between rounded-[12px] border border-[var(--line)] p-4">
          <span class="text-[var(--muted)]">Gesamt</span>
          <span class="text-xl font-semibold">{formatEuro(amount)}</span>
        </div>
      )}
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
          Lieferadresse
        </p>
        <div ref={addressRef} />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
          Zahlung
        </p>
        <div ref={paymentRef} />
      </div>
      {message && <p class="text-sm text-[var(--accent)]">{message}</p>}
      <button
        type="submit"
        class="button"
        disabled={status !== "ready"}
      >
        {status === "processing" ? "Wird verarbeitet…" : "Jetzt bezahlen"}
      </button>
      {status === "loading" && (
        <p class="text-sm text-[var(--muted)]">Checkout wird geladen…</p>
      )}
    </form>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `deno check routes/checkout/index.tsx islands/CheckoutForm.tsx`
Expected: passes. (If `elements.create("address", ...)` option typing is strict,
use `{ mode: "shipping" as const }`.)

- [ ] **Step 4: Commit**

```bash
git add routes/checkout/index.tsx islands/CheckoutForm.tsx
git commit -m "feat(checkout): checkout page with Stripe Payment Element"
```

---

## Task 8: Success page + clear-cart island

**Files:** Create `routes/checkout/success.tsx`, `islands/ClearCart.tsx`

- [ ] **Step 1: Implement clear-cart island**

```tsx
import { useEffect } from "preact/hooks";
import { clearCart } from "@/lib/cart-store.ts";

export default function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
```

- [ ] **Step 2: Implement the success route**

```tsx
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getOrder } from "@/lib/orders.ts";
import { formatEuro } from "@/lib/price.ts";
import ClearCart from "@/islands/ClearCart.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const id = ctx.url.searchParams.get("payment_intent");
    const order = id ? await getOrder(await getKv(), id) : null;
    return { data: { order } };
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <Head>
      <title>Bestellung bestätigt - Robin Rehbein Shop</title>
      <meta name="robots" content="noindex" />
    </Head>
    <ClearCart />
    <section class="shell max-w-2xl py-16 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        Danke!
      </p>
      <h1 class="display mt-3 text-4xl font-semibold md:text-5xl">
        Bestellung eingegangen.
      </h1>
      <p class="mt-4 text-[var(--muted)]">
        Du erhältst eine Bestätigung per E-Mail. Druck und Versand starten in
        Kürze.
      </p>
      {data.order && (
        <div class="mt-8 overflow-hidden rounded-[12px] border border-[var(--line)] text-left">
          {data.order.items.map((item, i) => (
            <div
              key={`${item.slug}-${item.variantId}`}
              class={`flex items-center justify-between p-4 ${
                i < data.order!.items.length - 1
                  ? "border-b border-[var(--line)]"
                  : ""
              }`}
            >
              <span>
                {item.qty}× {item.name} · {item.variantLabel}
              </span>
              <span class="font-semibold">
                {formatEuro(item.priceCents * item.qty)}
              </span>
            </div>
          ))}
          <div class="flex items-center justify-between bg-[var(--surface-muted)] p-4 font-semibold">
            <span>Gesamt</span>
            <span>{formatEuro(data.order.amountCents)}</span>
          </div>
        </div>
      )}
      <a href="/" class="button mt-8">Weiter shoppen</a>
    </section>
  </>
));
```

- [ ] **Step 3: Type-check + commit**

Run: `deno check routes/checkout/success.tsx islands/ClearCart.tsx`
```bash
git add routes/checkout/success.tsx islands/ClearCart.tsx
git commit -m "feat(checkout): order confirmation page, clears cart"
```

---

## Task 9: Full verification

- [ ] **Step 1: Check + test**

Run: `deno task check && deno task test`
Expected: fmt/lint/check clean; all tests PASS (orders tests included).

- [ ] **Step 2: Smoke test (dev server, no keys)**

Open `/checkout` with an item in the cart: page renders, shows
"Zahlung ist noch nicht konfiguriert" when no publishable key — confirms graceful
degradation. With keys in `.env`, the Payment Element mounts.

- [ ] **Step 3: Commit any fixups**

```bash
git add -A
git commit -m "test(checkout): phase 3 verification fixups"
```

---

## Done Criteria

- Cart drawer → `/checkout` → shipping + Payment Element → `/checkout/success`.
- Amount recomputed server-side from KV prices; client prices ignored.
- Pending order stored on PI creation; webhook flips it to paid.
- Graceful message when Stripe keys are absent.
- `deno task check` and `deno task test` green.

## Manual setup the user must do to go live

1. Put `sk_test_…`, `pk_test_…` into `.env` as `STRIPE_SECRET_KEY` /
   `STRIPE_PUBLISHABLE_KEY`.
2. Create a webhook endpoint (Stripe CLI `stripe listen --forward-to
   localhost:5173/api/stripe/webhook`) and put the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
3. Test with card `4242 4242 4242 4242`.
