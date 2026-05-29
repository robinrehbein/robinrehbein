import { assertEquals } from "@std/assert";
import {
  addLine,
  cartCount,
  type CartLine,
  cartTotalCents,
  removeLine,
  setQty,
} from "@/lib/cart.ts";

const line = (over: Partial<CartLine> = {}): CartLine => ({
  slug: "vase-x",
  variantId: "charcoal",
  name: "Vase X",
  variantLabel: "Charcoal",
  priceCents: 2000,
  image: "/x.jpg",
  qty: 1,
  ...over,
});

Deno.test("addLine merges same slug+variant by incrementing qty", () => {
  const a = addLine([], line());
  const b = addLine(a, line({ qty: 2 }));
  assertEquals(b.length, 1);
  assertEquals(b[0].qty, 3);
});

Deno.test("addLine keeps different variants separate", () => {
  const a = addLine([], line());
  const b = addLine(a, line({ variantId: "sage" }));
  assertEquals(b.length, 2);
});

Deno.test("cartCount sums quantities", () => {
  const lines = addLine(
    addLine([], line({ qty: 2 })),
    line({ variantId: "y" }),
  );
  assertEquals(cartCount(lines), 3);
});

Deno.test("cartTotalCents sums price * qty", () => {
  const lines = [
    line({ qty: 2, priceCents: 2000 }),
    line({ variantId: "y", priceCents: 500 }),
  ];
  assertEquals(cartTotalCents(lines), 4500);
});

Deno.test("setQty updates a line", () => {
  const lines = setQty([line()], "vase-x", "charcoal", 5);
  assertEquals(lines[0].qty, 5);
});

Deno.test("setQty to 0 removes the line", () => {
  const lines = setQty([line()], "vase-x", "charcoal", 0);
  assertEquals(lines.length, 0);
});

Deno.test("removeLine drops the matching line only", () => {
  const lines = removeLine([line(), line({ variantId: "y" })], "vase-x", "y");
  assertEquals(lines.length, 1);
  assertEquals(lines[0].variantId, "charcoal");
});
