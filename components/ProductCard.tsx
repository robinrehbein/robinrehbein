import type { Product } from "@/lib/catalog.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import { Price } from "@/components/ui/Price.tsx";

const COLOR_HEX: Record<string, string> = {
  Charcoal: "#28313b",
  Clay: "#b55732",
  Sage: "#708468",
  Bone: "#f4f0e6",
};

function variantColors(product: Product): { name: string; hex: string }[] {
  const names = new Set<string>();
  for (const variant of product.variants) {
    const name = variant.attributes["Farbe"];
    if (name) names.add(name);
  }
  return [...names].map((name) => ({
    name,
    hex: COLOR_HEX[name] ?? "#28313b",
  }));
}

export default function ProductCard({ product }: { product: Product }) {
  const colors = variantColors(product);
  return (
    <article class="product-card group">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
          <img
            src={product.images[0]}
            alt={product.name}
            class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span class="product-badge">{categoryLabel(product.category)}</span>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold tracking-tight">{product.name}</h3>
          <p class="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
            {product.description}
          </p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <Price cents={product.fromPriceCents} from class="text-lg" />
            <span class="text-xs text-[var(--muted)]">{product.leadTime}</span>
          </div>
          {colors.length > 0 && (
            <div
              class="mt-4 flex gap-1.5"
              role="group"
              aria-label="Farbvarianten"
            >
              {colors.map((color) => (
                <span
                  key={color.name}
                  role="img"
                  title={color.name}
                  aria-label={color.name}
                  class="h-3.5 w-3.5 rounded-full border border-[var(--line)]"
                  style={`background:${color.hex}`}
                />
              ))}
            </div>
          )}
          <span class="product-link">Produkt ansehen</span>
        </div>
      </a>
    </article>
  );
}
