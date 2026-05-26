import type { Product } from "@/lib/content.ts";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article class="card overflow-hidden">
      <a href={`/shop/${product.slug}`} class="block">
        <div class="aspect-[4/3] overflow-hidden bg-[var(--steel)]">
          <img
            src={product.image}
            alt={product.name}
            class="h-full w-full object-cover opacity-88 transition duration-300 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between gap-3">
            <p class="eyebrow text-[var(--clay)]">{product.category}</p>
            <p class="font-semibold">{product.price}</p>
          </div>
          <h3 class="display mt-4 text-3xl font-semibold">{product.name}</h3>
          <p class="mt-3 text-sm opacity-76">{product.description}</p>
          <p class="mt-5 text-sm font-semibold">
            {product.leadTime} · {product.marketplace.sku}
          </p>
        </div>
      </a>
    </article>
  );
}
