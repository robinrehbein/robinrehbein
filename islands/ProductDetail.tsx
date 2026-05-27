import { useSignal } from "@preact/signals";
import type { Product } from "@/lib/catalog.ts";
import { formatEuro } from "@/lib/price.ts";

export default function ProductDetail({ product }: { product: Product }) {
  const selectedImage = useSignal(0);
  const selectedVariant = useSignal(0);
  const variant = product.variants[selectedVariant.value];
  const mainImage = variant?.image ?? product.images[selectedImage.value] ??
    product.images[0];

  return (
    <div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div class="grid grid-cols-[64px_1fr] gap-3">
        <div class="flex flex-col gap-2">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => (selectedImage.value = i)}
              aria-label={`Bild ${i + 1}`}
              class={`aspect-square overflow-hidden rounded-[5px] border ${
                selectedImage.value === i
                  ? "border-[var(--clay)] outline outline-2 outline-[var(--clay)]"
                  : "border-[var(--line)]"
              }`}
            >
              <img src={src} alt="" class="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div class="aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--ink)] bg-[var(--steel)]">
          <img
            src={mainImage}
            alt={product.name}
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <div>
        <p class="text-2xl font-semibold">
          {variant ? formatEuro(variant.priceCents) : ""}
        </p>
        {product.variants.length > 0 && (
          <div class="mt-5">
            <p class="eyebrow opacity-70">Variante</p>
            <div class="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => (selectedVariant.value = i)}
                  aria-pressed={selectedVariant.value === i}
                  class={`pill eyebrow cursor-pointer transition ${
                    selectedVariant.value === i
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : ""
                  }`}
                >
                  {v.label} · {formatEuro(v.priceCents)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div class="mt-8 flex flex-wrap gap-3">
          <button type="button" class="button" disabled>
            In den Warenkorb
          </button>
          <a href="/printauftrag" class="button secondary">
            Ähnliches anfragen
          </a>
        </div>
      </div>
    </div>
  );
}
