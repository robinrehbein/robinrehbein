import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { deleteProduct } from "@/lib/products.ts";

export const handler = define.handlers({
  async POST(ctx) {
    await deleteProduct(await getKv(), ctx.params.slug);
    return new Response(null, { status: 303, headers: { location: "/admin" } });
  },
});
