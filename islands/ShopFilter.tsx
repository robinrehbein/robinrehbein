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

export default function ShopFilter(
  { products, initialCategory }: {
    products: Product[];
    initialCategory?: Category;
  },
) {
  const category = useSignal<Category | "all">(initialCategory ?? "all");
  const material = useSignal<string | "all">("all");
  const maxPrice = useSignal<number>(0); // 0 = no limit

  const categories = categoriesOf(products);
  const materials = materialsOf(products);
  // Round up to the slider step so the priciest product is always reachable.
  const priceCap = Math.ceil(
    Math.max(...products.map((p) => p.fromPriceCents), 0) / 100,
  ) * 100;

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
      <div class="shop-filter-bar">
        <div
          role="group"
          aria-label="Kategorie filtern"
          class="flex flex-wrap gap-2"
        >
          <button
            type="button"
            onClick={() => (category.value = "all")}
            aria-pressed={category.value === "all"}
            class={`category-chip ${
              category.value === "all" ? "is-active" : ""
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => (category.value = cat)}
              aria-pressed={category.value === cat}
              class={`category-chip ${
                category.value === cat ? "is-active" : ""
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
            onChange={(
              e,
            ) => (material.value = (e.target as HTMLSelectElement).value)}
          >
            <option value="all">Alle Materialien</option>
            {materials.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        {priceCap > 0 && (
          <label class="flex flex-col gap-1 text-sm">
            <span class="eyebrow opacity-70">
              Max. Preis:{" "}
              {maxPrice.value === 0 ? "alle" : formatEuro(maxPrice.value)}
            </span>
            <input
              type="range"
              min={0}
              max={priceCap}
              step={100}
              value={maxPrice.value}
              aria-valuetext={maxPrice.value === 0
                ? "alle"
                : formatEuro(maxPrice.value)}
              onInput={(
                e,
              ) => (maxPrice.value = Number(
                (e.target as HTMLInputElement).value,
              ))}
              class="accent-[var(--accent)]"
            />
          </label>
        )}
      </div>

      {groups
        ? (
          <div class="mt-10 flex flex-col gap-12">
            {groups.map((group) => (
              <section key={group.category}>
                <h2 class="text-xl font-semibold tracking-tight">
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
