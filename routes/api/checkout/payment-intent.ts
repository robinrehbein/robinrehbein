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
