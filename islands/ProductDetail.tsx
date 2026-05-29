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
        <p class="text-3xl font-semibold tracking-tight">
          {variant ? formatEuro(variant.priceCents) : ""}
        </p>
        <p class="mt-1 text-sm text-[var(--muted)]">
          inkl. MwSt. · zzgl. Versand
        </p>
        {product.variants.length > 0 && (
          <div class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
              Variante
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => (selectedVariant.value = i)}
                  aria-pressed={selectedVariant.value === i}
                  class={`category-chip ${
                    selectedVariant.value === i ? "is-active" : ""
                  }`}
                >
                  {v.label} · {formatEuro(v.priceCents)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="button"
            disabled
            title="Warenkorb folgt"
          >
            In den Warenkorb
          </button>
          <a href="/printauftrag" class="button secondary">
            Ähnliches anfragen
          </a>
        </div>
        <p class="mt-4 text-sm text-[var(--muted)]">
          Versand in 2–5 Werktagen · sichere Zahlung
        </p>
      </div>
    </div>
  );
}
