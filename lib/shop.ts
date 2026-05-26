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
