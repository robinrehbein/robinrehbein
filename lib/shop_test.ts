import { assertEquals } from "@std/assert";
import {
  categoriesOf,
  filterProducts,
  groupByCategory,
  materialsOf,
  newestProducts,
} from "@/lib/shop.ts";
import type { Product, VaseProduct } from "@/lib/catalog.ts";

function vase(slug: string, materials: string[], from: number): VaseProduct {
  return {
    slug,
    name: slug,
    category: "vase",
    description: "",
    images: [],
    materials,
    fromPriceCents: from,
    leadTime: "",
    heightMm: 0,
    volumeMl: 0,
    watertight: false,
    variants: [],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  };
}

const sample: Product[] = [
  vase("a", ["PLA Matte"], 3400),
  {
    ...vase("b", ["PETG"], 1900),
    category: "planter",
    diameterMm: 0,
    drainage: false,
  } as Product,
  vase("c", ["PLA Matte", "PETG"], 2900),
];

Deno.test("categoriesOf returns unique categories in first-seen order", () => {
  assertEquals(categoriesOf(sample), ["vase", "planter"]);
});

Deno.test("materialsOf returns sorted unique materials", () => {
  assertEquals(materialsOf(sample), ["PETG", "PLA Matte"]);
});

Deno.test("filterProducts with no filters returns everything", () => {
  assertEquals(filterProducts(sample, {}).length, 3);
});

Deno.test("filterProducts filters by category", () => {
  assertEquals(
    filterProducts(sample, { category: "vase" }).map((p) => p.slug),
    [
      "a",
      "c",
    ],
  );
});

Deno.test("filterProducts filters by material membership", () => {
  assertEquals(
    filterProducts(sample, { material: "PETG" }).map((p) => p.slug),
    [
      "b",
      "c",
    ],
  );
});

Deno.test("filterProducts filters by max price (fromPriceCents)", () => {
  assertEquals(
    filterProducts(sample, { maxPriceCents: 3000 }).map((p) => p.slug),
    ["b", "c"],
  );
});

Deno.test("filterProducts combines filters (AND)", () => {
  assertEquals(
    filterProducts(sample, { category: "vase", material: "PETG" }).map((p) =>
      p.slug
    ),
    ["c"],
  );
});

Deno.test("newestProducts sorts by createdAt descending", () => {
  const products: Product[] = [
    { ...vase("old", [], 0), createdAt: 100 },
    { ...vase("new", [], 0), createdAt: 300 },
    { ...vase("mid", [], 0), createdAt: 200 },
  ];
  assertEquals(
    newestProducts(products).map((p) => p.slug),
    ["new", "mid", "old"],
  );
});

Deno.test("newestProducts limits to n without mutating input", () => {
  const products: Product[] = [
    { ...vase("a", [], 0), createdAt: 1 },
    { ...vase("b", [], 0), createdAt: 2 },
    { ...vase("c", [], 0), createdAt: 3 },
  ];
  assertEquals(newestProducts(products, 2).map((p) => p.slug), ["c", "b"]);
  // original order preserved (helper copies before sorting)
  assertEquals(products.map((p) => p.slug), ["a", "b", "c"]);
});

Deno.test("groupByCategory groups in first-seen category order", () => {
  const groups = groupByCategory(sample);
  assertEquals(groups.map((g) => g.category), ["vase", "planter"]);
  assertEquals(groups[0].products.map((p) => p.slug), ["a", "c"]);
});
