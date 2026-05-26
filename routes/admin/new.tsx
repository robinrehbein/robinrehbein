import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { saveProduct } from "@/lib/products.ts";
import { buildProduct, type FormFields } from "@/lib/product-form.ts";
import { saveUpload } from "@/lib/uploads.ts";
import ProductForm from "@/components/ProductForm.tsx";

export const handler = define.handlers({
  GET() {
    return { data: {} };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const fields: FormFields = {};
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = v;
    }
    const file = form.get("image");
    if (file instanceof File && file.size > 0) {
      fields.images = await saveUpload(file, fields.slug);
    }
    await saveProduct(await getKv(), buildProduct(fields));
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});

export default define.page(function NewProduct() {
  return (
    <section class="shell py-12">
      <a href="/admin" class="eyebrow text-[var(--clay)]">← Produkte</a>
      <h1 class="display mt-4 mb-8 text-4xl font-semibold">Neues Produkt</h1>
      <ProductForm action="/admin/new" />
    </section>
  );
});
