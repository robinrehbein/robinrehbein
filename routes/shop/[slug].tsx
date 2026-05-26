import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { products } from "@/lib/content.ts";

export const handler = define.handlers({
  GET(ctx) {
    const product = products.find((item) => item.slug === ctx.params.slug);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return { data: { product } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { product } = data;

  return (
    <>
      <Head>
        <title>{product.name} - Robin Rehbein Shop</title>
      </Head>
      <section class="shell grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--ink)] bg-[var(--steel)]">
          <img
            src={product.image}
            alt={product.name}
            class="h-full w-full object-cover"
          />
        </div>
        <div>
          <a href="/shop" class="eyebrow text-[var(--clay)]">
            Zurueck zum Shop
          </a>
          <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
            {product.name}
          </h1>
          <p class="mt-6 max-w-2xl text-xl leading-8">{product.description}</p>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="card p-4">
              <p class="eyebrow">Preis</p>
              <p class="mt-2 text-2xl font-semibold">{product.price}</p>
            </div>
            <div class="card p-4">
              <p class="eyebrow">Fertigung</p>
              <p class="mt-2 text-2xl font-semibold">{product.leadTime}</p>
            </div>
            <div class="card p-4 sm:col-span-2">
              <p class="eyebrow">Materialoptionen</p>
              <p class="mt-2 text-lg">{product.material.join(", ")}</p>
            </div>
            <div class="card p-4 sm:col-span-2">
              <p class="eyebrow">Marketplace</p>
              <p class="mt-2">SKU: {product.marketplace.sku}</p>
              <p>Listing: {product.marketplace.etsyListingId}</p>
            </div>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="/printauftrag" class="button">Aehnliches Teil anfragen</a>
            <a href={product.marketplace.embedUrl} class="button secondary">
              Etsy-Listing vorbereiten
            </a>
          </div>
        </div>
      </section>
    </>
  );
});
