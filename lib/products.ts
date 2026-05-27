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
    createdAt: existingCreatedAt || product.createdAt || now,
    updatedAt: now,
  };
}

/** Create or update a product (keyed by slug). Sets timestamps + fromPrice. */
export async function saveProduct(
  kv: Deno.Kv,
  product: Product,
): Promise<void> {
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
