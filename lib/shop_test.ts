import { assertEquals } from "@std/assert";
import { categoriesOf, filterByCategory } from "@/lib/shop.ts";
import type { Product } from "@/lib/content.ts";

function p(slug: string, category: string): Product {
  return {
    slug,
    name: slug,
    category,
    price: "ab 1 EUR",
    leadTime: "1 Tag",
    material: [],
    finish: "",
    description: "",
    image: "/x.jpg",
    marketplace: { etsyListingId: "", sku: "", embedUrl: "" },
  };
}

Deno.test("categoriesOf returns unique categories in first-seen order", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen"), p("c", "Vase")];
  assertEquals(categoriesOf(products), ["Vase", "Pflanzen"]);
});

Deno.test("filterByCategory returns all products for 'Alle'", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen")];
  assertEquals(filterByCategory(products, "Alle").length, 2);
});

Deno.test("filterByCategory filters to one category", () => {
  const products = [p("a", "Vase"), p("b", "Pflanzen"), p("c", "Vase")];
  const result = filterByCategory(products, "Vase");
  assertEquals(result.map((x) => x.slug), ["a", "c"]);
});
