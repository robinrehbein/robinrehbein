import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import {
  type Category,
  CATEGORY_LABELS,
  categoryLabel,
} from "@/lib/catalog.ts";
import ShopFilter from "@/islands/ShopFilter.tsx";

/** Narrow a raw query value to a valid category, or undefined. */
export function parseCategory(raw: string | null): Category | undefined {
  return raw && raw in CATEGORY_LABELS ? (raw as Category) : undefined;
}

export const handler = define.handlers({
  async GET(ctx) {
    const products = await listProducts(await getKv());
    const category = parseCategory(ctx.url.searchParams.get("category"));
    return { data: { products, category, origin: ctx.url.origin } };
  },
});

const SHOP_DESC =
  "Alle 3D-gedruckten Objekte aus dem Studio: Vasen, Planter, Keycaps und Organisation. Nach Kategorie, Material und Preis filtern.";

export default define.page<typeof handler>(function Shop({ data }) {
  const { products, category, origin } = data;
  const title = category
    ? `${categoryLabel(category)} · Shop`
    : "Shop · Alle Produkte";

  return (
    <>
      <Head>
        <title>{title} · RR3D Studio</title>
        <meta name="description" content={SHOP_DESC} />
        <link rel="canonical" href={`${origin}/shop`} />
      </Head>

      <section class="shell py-8 md:py-12">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="eyebrow text-[var(--accent)]">Shop</p>
            <h1 class="display mt-2 text-3xl font-semibold md:text-4xl">
              Alle Produkte
            </h1>
          </div>
          <span class="text-sm text-[var(--muted)]">
            {products.length} Artikel
          </span>
        </div>
        <ShopFilter products={products} initialCategory={category} />
      </section>
    </>
  );
});
