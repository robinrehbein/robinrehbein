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
      <div
        class="flex flex-wrap gap-2"
        role="group"
        aria-label="Kategorie filtern"
      >
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
