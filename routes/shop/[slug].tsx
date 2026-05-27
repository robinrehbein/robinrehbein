import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct } from "@/lib/products.ts";
import { categoryLabel, type Product } from "@/lib/catalog.ts";
import ProductDetail from "@/islands/ProductDetail.tsx";

/** Category-specific descriptive specs as label/value pairs. */
function specsOf(product: Product): [string, string][] {
  const specs: [string, string][] = [
    ["Material", product.materials.join(", ")],
    ["Fertigung", product.leadTime],
  ];
  switch (product.category) {
    case "vase":
      specs.unshift(
        ["Höhe", `${product.heightMm} mm`],
        ["Volumen", `${product.volumeMl} ml`],
        ["Wasserdicht", product.watertight ? "Ja" : "Einsatz empfohlen"],
      );
      break;
    case "planter":
      specs.unshift(
        ["Durchmesser", `${product.diameterMm} mm`],
        ["Drainage", product.drainage ? "Ja" : "Nein"],
      );
      break;
    case "keycap":
      specs.unshift(
        ["Profil", product.profile],
        ["Kompatibel", product.switchCompat],
        ["Legenden", product.legends === "blank" ? "Blank" : "Mit Legenden"],
      );
      break;
    case "organisation":
      specs.unshift(["Maße", product.dimensions]);
      break;
  }
  return specs;
}

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProduct(await getKv(), ctx.params.slug);
    if (!product) throw new HttpError(404, "Product not found");
    return { data: { product, specs: specsOf(product) } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { product, specs } = data;
  return (
    <>
      <Head>
        <title>{product.name} - Robin Rehbein Shop</title>
      </Head>
      <section class="shell py-16">
        <a href="/" class="eyebrow text-[var(--clay)]">
          ← Zurück zum Shop · {categoryLabel(product.category)}
        </a>
        <h1 class="display mt-5 mb-8 text-6xl font-semibold md:text-8xl">
          {product.name}
        </h1>
        <ProductDetail product={product} />
        <p class="mt-8 max-w-2xl text-lg leading-8 opacity-85">
          {product.description}
        </p>
        <div class="mt-8 overflow-hidden rounded-[8px] border border-[var(--line)]">
          {specs.map(([label, value], i) => (
            <div
              key={label}
              class={`grid grid-cols-[140px_1fr] ${
                i < specs.length - 1 ? "border-b border-[var(--line)]" : ""
              }`}
            >
              <div class="border-r border-[var(--line)] p-3 text-sm font-semibold text-[var(--clay)]">
                {label}
              </div>
              <div class="p-3 text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
});
