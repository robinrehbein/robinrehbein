import { assertEquals, assertThrows } from "@std/assert";
import { resolveOrderLines } from "@/lib/orders.ts";
import type { Product, VaseProduct } from "@/lib/catalog.ts";

const vase = (over: Partial<VaseProduct> = {}): Product => ({
  slug: "vase",
  name: "Vase",
  category: "vase",
  description: "",
  images: ["/v.jpg"],
  materials: ["PLA Matte"],
  fromPriceCents: 2000,
  leadTime: "3-5 Tage",
  heightMm: 150,
  volumeMl: 500,
  watertight: true,
  variants: [
    { id: "charcoal", label: "Charcoal", priceCents: 2000, attributes: {} },
    { id: "sage", label: "Sage", priceCents: 2500, attributes: {} },
  ],
  channels: [],
  createdAt: 0,
  updatedAt: 0,
  ...over,
});

Deno.test("resolveOrderLines sums real prices from products", () => {
  const { lines, amountCents } = resolveOrderLines([vase()], [
    { slug: "vase", variantId: "charcoal", qty: 2 },
    { slug: "vase", variantId: "sage", qty: 1 },
  ]);
  assertEquals(amountCents, 2000 * 2 + 2500);
  assertEquals(lines.length, 2);
  assertEquals(lines[0].name, "Vase");
});

Deno.test("resolveOrderLines ignores client-supplied prices", () => {
  const items = [
    { slug: "vase", variantId: "charcoal", qty: 1, priceCents: 1 },
    // deno-lint-ignore no-explicit-any
  ] as any;
  const { amountCents } = resolveOrderLines([vase()], items);
  assertEquals(amountCents, 2000);
});

Deno.test("resolveOrderLines throws on unknown product", () => {
  assertThrows(() =>
    resolveOrderLines([vase()], [{ slug: "x", variantId: "charcoal", qty: 1 }])
  );
});

Deno.test("resolveOrderLines throws on unknown variant", () => {
  assertThrows(() =>
    resolveOrderLines([vase()], [{ slug: "vase", variantId: "nope", qty: 1 }])
  );
});

Deno.test("resolveOrderLines throws on non-positive qty", () => {
  assertThrows(() =>
    resolveOrderLines([vase()], [{
      slug: "vase",
      variantId: "charcoal",
      qty: 0,
    }])
  );
});

Deno.test("resolveOrderLines throws on empty cart", () => {
  assertThrows(() => resolveOrderLines([vase()], []));
});
