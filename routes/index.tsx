import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";
import ShopFilter from "@/islands/ShopFilter.tsx";

export const handler = define.handlers({
  async GET() {
    const products = await listProducts(await getKv());
    return { data: products };
  },
});

function Featured({ product }: { product: Product }) {
  return (
    <a
      href={`/shop/${product.slug}`}
      class="card group grid overflow-hidden md:grid-cols-2"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-[var(--steel)] md:aspect-auto">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div class="flex flex-col justify-center gap-4 p-8 md:p-10">
        <p class="eyebrow text-[var(--clay)]">
          Diesen Monat · {categoryLabel(product.category)}
        </p>
        <h2 class="display text-4xl font-semibold md:text-6xl">
          {product.name}
        </h2>
        <p class="max-w-md leading-8 opacity-80">{product.description}</p>
        <p class="text-lg font-semibold">
          {formatFrom(product.fromPriceCents)}
        </p>
      </div>
    </a>
  );
}

export default define.page<typeof handler>(function Home({ data }) {
  const products = data;
  const featured = products[0];

  return (
    <>
      <Head>
        <title>Robin Rehbein - 3D Print Studio Shop</title>
      </Head>

      <section class="shell py-12 md:py-16">
        <div class="shop-heading mb-10">
          <div>
            <p class="eyebrow text-[var(--clay)]">3D Print Studio</p>
            <h1 class="display mt-4 max-w-3xl text-5xl font-semibold md:text-7xl">
              3D-gedruckte Objekte, kleine Serien.
            </h1>
            <p class="mt-5 max-w-xl text-lg leading-8">
              Vasen, Planter und Keycaps für Choc-LP-Switches aus Stuttgart.
              Klare Objekte, sauber gedruckt, in kleinen Auflagen.
            </p>
          </div>
          <div class="shop-heading__meta" aria-label="Shop Informationen">
            <span>{products.length} Produkte</span>
            <span>2-5 Werktage</span>
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
            <p class="eyebrow text-[var(--clay)]">Custom Print</p>
            <h2 class="display mt-3 text-3xl font-semibold md:text-4xl">
              Dein Modell, mein Druckprozess.
            </h2>
            <p class="mt-3 max-w-2xl leading-8">
              STL- oder STEP-Datei hochladen, Material und Finish wählen,
              technische Hinweise direkt mitgeben.
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
