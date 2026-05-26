import { HttpError } from "fresh";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getProduct, saveProduct } from "@/lib/products.ts";
import { buildProduct, type FormFields } from "@/lib/product-form.ts";
import { saveUpload } from "@/lib/uploads.ts";
import ProductForm from "@/components/ProductForm.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const product = await getProduct(await getKv(), ctx.params.slug);
    if (!product) throw new HttpError(404, "Product not found");
    return { data: { product } };
  },
  async POST(ctx) {
    const existing = await getProduct(await getKv(), ctx.params.slug);
    if (!existing) throw new HttpError(404, "Product not found");
    const form = await ctx.req.formData();
    const fields: FormFields = { slug: ctx.params.slug };
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = v;
    }
    const file = form.get("image");
    if (file instanceof File && file.size > 0) {
      fields.images = await saveUpload(file, ctx.params.slug);
    } else {
      fields.images = existing.images.join(", ");
    }
    await saveProduct(await getKv(), buildProduct(fields));
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <section class="shell py-12">
    <a href="/admin" class="eyebrow text-[var(--clay)]">← Produkte</a>
    <h1 class="display mt-4 mb-8 text-4xl font-semibold">
      {data.product.name}
    </h1>
    <ProductForm
      product={data.product}
      action={`/admin/${data.product.slug}`}
    />
  </section>
));
