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

/** Newest products first (by createdAt), optionally limited to n. */
export function newestProducts(products: Product[], n?: number): Product[] {
  const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
  return n ? sorted.slice(0, n) : sorted;
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
