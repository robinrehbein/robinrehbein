import { assert, assertEquals } from "@std/assert";
import { seedIfEmpty } from "@/lib/seed.ts";
import { listProducts } from "@/lib/products.ts";

Deno.test("seedIfEmpty populates an empty KV with demo products", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const all = await listProducts(kv);
  assert(all.length >= 7, `expected >= 7 demo products, got ${all.length}`);
  const cats = new Set(all.map((p) => p.category));
  assertEquals(cats.has("vase"), true);
  assertEquals(cats.has("planter"), true);
  assertEquals(cats.has("keycap"), true);
  assertEquals(cats.has("organisation"), true);
  kv.close();
});

Deno.test("seedIfEmpty is idempotent (does not duplicate)", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const first = (await listProducts(kv)).length;
  await seedIfEmpty(kv);
  assertEquals((await listProducts(kv)).length, first);
  kv.close();
});

Deno.test("keycap demo product targets Choc LP and has variants", async () => {
  const kv = await Deno.openKv(":memory:");
  await seedIfEmpty(kv);
  const all = await listProducts(kv);
  const keycap = all.find((p) => p.category === "keycap");
  assert(keycap, "no keycap product seeded");
  assert(keycap.variants.length >= 2, "keycap should have variants");
  kv.close();
});
