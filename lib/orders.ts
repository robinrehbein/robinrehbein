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
