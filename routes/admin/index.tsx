import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { listProducts } from "@/lib/products.ts";
import { categoryLabel } from "@/lib/catalog.ts";
import { formatFrom } from "@/lib/price.ts";

export const handler = define.handlers({
  async GET() {
    const products = await listProducts(await getKv());
    return { data: products };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const products = data;
  return (
    <section class="shell py-12">
      <div class="flex items-center justify-between gap-4">
        <h1 class="display text-4xl font-semibold">Produkte</h1>
        <div class="flex gap-2">
          <a href="/admin/new" class="button">Neues Produkt</a>
          <form method="post" action="/admin/logout">
            <button type="submit" class="button secondary">Logout</button>
          </form>
        </div>
      </div>

      <div class="mt-8 overflow-hidden rounded-[8px] border border-[var(--line)]">
        {products.map((product, i) => (
          <div
            key={product.slug}
            class={`grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 ${
              i < products.length - 1 ? "border-b border-[var(--line)]" : ""
            }`}
          >
            <div>
              <p class="font-semibold">{product.name}</p>
              <p class="text-sm opacity-70">
                {categoryLabel(product.category)} ·{" "}
                {formatFrom(product.fromPriceCents)} · {product.variants.length}
                {" "}
                Varianten
              </p>
            </div>
            <a href={`/admin/${product.slug}`} class="button secondary">
              Bearbeiten
            </a>
            <form method="post" action={`/admin/${product.slug}/delete`}>
              <button type="submit" class="button secondary">Löschen</button>
            </form>
          </div>
        ))}
        {products.length === 0 && (
          <p class="p-4 opacity-70">Noch keine Produkte.</p>
        )}
      </div>
    </section>
  );
});
