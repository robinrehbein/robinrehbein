import { Head } from "fresh/runtime";
import ProductCard from "@/components/ProductCard.tsx";
import { products } from "@/lib/content.ts";

export default function ShopIndex() {
  return (
    <>
      <Head>
        <title>Shop - Robin Rehbein 3D Print Studio</title>
      </Head>
      <section class="shell py-16">
        <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p class="eyebrow text-[var(--clay)]">3D Print Shop</p>
            <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
              Kleine Serien, klare Objekte.
            </h1>
          </div>
          <p class="max-w-2xl text-xl leading-8">
            Vasen, Ordnungsteile, Pflanzenhelfer und experimentelle Objekte.
            Jedes Produkt besitzt SKU und Marketplace-Metadaten, damit der
            eigene Shop, Etsy und weitere Plattformen dieselbe Quelle nutzen
            koennen.
          </p>
        </div>
        <div class="mt-12 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <section class="section">
        <div class="shell card grid gap-8 p-6 md:grid-cols-[1fr_1fr] md:p-8">
          <div>
            <p class="eyebrow text-[var(--clay)]">Distribution</p>
            <h2 class="display mt-4 text-5xl font-semibold">
              Bereit fuer Etsy, eigene Feeds und Embedded Cards.
            </h2>
          </div>
          <div class="grid gap-4">
            <p>
              Die Produktdaten enthalten SKU, Listing-ID und externe URL. In
              einem naechsten Schritt kann daraus automatisch ein Etsy Sync,
              JSON-Feed oder ein eingebettetes Widget fuer Partnerseiten werden.
            </p>
            <a href="/printauftrag" class="button w-fit">
              Individuellen Druck anfragen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
