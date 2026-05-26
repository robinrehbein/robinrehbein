import type { Product } from "@/lib/content.ts";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article class="card group overflow-hidden">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="relative aspect-[4/3] overflow-hidden bg-[var(--steel)]">
          <img
            src={product.image}
            alt={product.name}
            class="h-full w-full object-cover opacity-88 transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span class="pill eyebrow absolute left-3 top-3 bg-[var(--paper)]">
            {product.category}
          </span>
        </div>
        <div class="p-5">
          <h3 class="display text-2xl font-semibold">{product.name}</h3>
          <p class="mt-3 text-sm opacity-76">{product.description}</p>
          <div class="mt-5 flex items-center justify-between gap-3">
            <p class="text-lg font-semibold">{product.price}</p>
            <p class="text-sm opacity-70">{product.leadTime}</p>
          </div>
        </div>
      </a>
    </article>
  );
}
