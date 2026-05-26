import { assertEquals } from "@std/assert";
import { buildProduct } from "@/lib/product-form.ts";

Deno.test("buildProduct assembles a keycap product from form fields", () => {
  const fields = {
    slug: "mbk-blank-set",
    name: "MBK Blank Set",
    category: "keycap",
    description: "Caps",
    materials: "PLA Matte, PETG",
    leadTime: "3-5 Werktage",
    images: "/uploads/a.jpg",
    variants: JSON.stringify([
      {
        id: "c-36",
        label: "Charcoal 36",
        priceCents: 1800,
        attributes: { Farbe: "Charcoal" },
      },
    ]),
    profile: "MBK",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
  };
  const product = buildProduct(fields);
  assertEquals(product.category, "keycap");
  assertEquals(product.materials, ["PLA Matte", "PETG"]);
  assertEquals(product.variants.length, 1);
  if (product.category === "keycap") {
    assertEquals(product.switchCompat, "Kailh Choc v1");
  }
});

Deno.test("buildProduct reads vase-specific numeric fields", () => {
  const product = buildProduct({
    slug: "v",
    name: "V",
    category: "vase",
    description: "",
    materials: "PLA Matte",
    leadTime: "x",
    images: "/uploads/v.jpg",
    variants: "[]",
    heightMm: "180",
    volumeMl: "600",
    watertight: "on",
  });
  if (product.category === "vase") {
    assertEquals(product.heightMm, 180);
    assertEquals(product.watertight, true);
  }
});
