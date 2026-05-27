import { assert, assertEquals } from "@std/assert";
import {
  deleteProduct,
  getProduct,
  listProducts,
  saveProduct,
} from "@/lib/products.ts";
import type { KeycapProduct } from "@/lib/catalog.ts";

function keycap(slug: string, prices: number[]): KeycapProduct {
  return {
    slug,
    name: slug,
    category: "keycap",
    description: "",
    images: ["/x.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    variants: prices.map((p, i) => ({
      id: `v${i}`,
      label: `V${i}`,
      priceCents: p,
      attributes: {},
    })),
    channels: [],
    createdAt: 0,
    updatedAt: 0,
    profile: "MBK",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
  };
}

Deno.test("saveProduct then getProduct round-trips", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800, 2800]));
  const got = await getProduct(kv, "a");
  assert(got, "product not found");
  assertEquals(got.name, "a");
  kv.close();
});

Deno.test("saveProduct derives fromPriceCents from cheapest variant", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [2800, 1800, 3000]));
  const got = await getProduct(kv, "a");
  assertEquals(got!.fromPriceCents, 1800);
  kv.close();
});

Deno.test("saveProduct sets timestamps; update keeps createdAt", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800]));
  const first = await getProduct(kv, "a");
  assert(first!.createdAt > 0, "createdAt unset");
  await saveProduct(kv, { ...first!, name: "renamed" });
  const second = await getProduct(kv, "a");
  assertEquals(second!.createdAt, first!.createdAt);
  assert(second!.updatedAt >= first!.updatedAt, "updatedAt not advanced");
  kv.close();
});

Deno.test("listProducts returns all, sorted by name", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("beta", [1800]));
  await saveProduct(kv, keycap("alpha", [1800]));
  const all = await listProducts(kv);
  assertEquals(all.map((p) => p.slug), ["alpha", "beta"]);
  kv.close();
});

Deno.test("deleteProduct removes the product", async () => {
  const kv = await Deno.openKv(":memory:");
  await saveProduct(kv, keycap("a", [1800]));
  await deleteProduct(kv, "a");
  assertEquals(await getProduct(kv, "a"), null);
  kv.close();
});
