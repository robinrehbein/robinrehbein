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

function Featured({ product }: { product: Product }) {
  return (
    <a
      href={`/shop/${product.slug}`}
      class="card group grid overflow-hidden md:grid-cols-2"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)] md:aspect-auto">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <span class="product-badge">{categoryLabel(product.category)}</span>
      </div>
      <div class="flex flex-col justify-center gap-4 p-8 md:p-10">
        <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          Diesen Monat
        </p>
        <h2 class="display text-3xl font-semibold md:text-5xl">
          {product.name}
        </h2>
        <p class="max-w-md text-[var(--muted)]">{product.description}</p>
        <Price cents={product.fromPriceCents} from class="text-lg" />
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

      <section class="shell py-10 md:py-14">
        <div class="shop-heading mb-8">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
              3D Print Studio · Stuttgart
            </p>
            <h1 class="display mt-3 max-w-3xl text-4xl font-semibold md:text-6xl">
              3D-gedruckte Objekte, in kleinen Serien.
            </h1>
            <p class="mt-4 max-w-xl text-[var(--muted)]">
              Vasen, Planter und Keycaps für Choc-LP-Switches. Klare Objekte,
              sauber gedruckt — direkt aus der Werkstatt.
            </p>
            <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
              <span>✓ Versand in 2–5 Werktagen</span>
              <span>✓ Sichere Zahlung</span>
              <span>✓ Kleine Serien</span>
            </div>
          </div>
          <div class="shop-heading__meta" aria-label="Shop Informationen">
            <span>{products.length} Produkte</span>
            <span>2–5 Werktage</span>
            <span>Kleine Serien</span>
          </div>
        </div>

        {featured && <Featured product={featured} />}

        <div class="mt-12">
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
