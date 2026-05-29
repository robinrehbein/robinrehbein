import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import { Price } from "@/components/ui/Price.tsx";
import ShopFilter from "@/islands/ShopFilter.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const products = await listProducts(await getKv());
    return { data: { products, origin: ctx.url.origin } };
  },
});

const STOREFRONT_DESC =
  "3D-gedruckte Vasen, Planter und Choc-LP-Keycaps aus Stuttgart. Klare Objekte, sauber gedruckt, in kleinen Auflagen.";

function PromoBanner({ product }: { product: Product }) {
  return (
    <a
      href={`/shop/${product.slug}`}
      class="card group grid overflow-hidden md:grid-cols-2"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)] md:aspect-auto md:min-h-[26rem]">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div class="flex flex-col justify-center gap-5 p-8 md:p-12">
        <span class="w-fit rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-white">
          Neu im Shop · {categoryLabel(product.category)}
        </span>
        <h2 class="display text-3xl font-semibold md:text-5xl">
          {product.name}
        </h2>
        <p class="max-w-md text-[var(--muted)]">{product.description}</p>
        <Price cents={product.fromPriceCents} from class="text-xl" />
        <span class="button w-fit">Jetzt ansehen →</span>
      </div>
    </a>
  );
}

export default define.page<typeof handler>(function Home({ data }) {
  const { products, origin } = data;
  const featured = products[0];
  const ogImage = featured
    ? new URL(featured.images[0], origin).href
    : undefined;

  return (
    <>
      <Head>
        <title>Robin Rehbein - 3D Print Studio Shop</title>
        <meta name="description" content={STOREFRONT_DESC} />
        <link rel="canonical" href={`${origin}/`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Robin Rehbein · 3D Print Studio"
        />
        <meta property="og:description" content={STOREFRONT_DESC} />
        <meta property="og:url" content={`${origin}/`} />
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Head>

      <div class="border-b border-[var(--line)] bg-[var(--surface-muted)]">
        <div class="shell flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-2.5 text-xs font-medium text-[var(--muted)] md:justify-start">
          <span>✓ Versand in 2–5 Werktagen</span>
          <span>✓ Sichere Zahlung</span>
          <span>✓ Kleine Serien aus Stuttgart</span>
        </div>
      </div>

      <section class="shell py-8 md:py-10">
        {featured && <PromoBanner product={featured} />}

        <div class="mt-12">
          <div class="mb-6 flex items-end justify-between gap-4">
            <h2 class="display text-2xl font-semibold md:text-3xl">
              Alle Produkte
            </h2>
            <span class="text-sm text-[var(--muted)]">
              {products.length} Artikel
            </span>
          </div>
          <ShopFilter products={products} />
        </div>
      </section>

      <section class="section">
        <div class="shell shop-service-band">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
              Druckauftrag
            </p>
            <h2 class="display mt-3 text-2xl font-semibold md:text-4xl">
              Eigenes Modell drucken lassen.
            </h2>
            <p class="mt-3 max-w-2xl text-[var(--muted)]">
              Modell hochladen, Material und Anforderungen erfassen. Ich prüfe
              Geometrie, Fertigungsrisiken und sinnvolle Einstellungen vor dem
              Druck.
            </p>
          </div>
          <a href="/printauftrag" class="button shrink-0">
            Druckauftrag starten
          </a>
        </div>
      </section>
    </>
  );
});
