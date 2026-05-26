import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import ProductCard from "@/components/ProductCard.tsx";
import type { Product } from "@/lib/content.ts";

const fixture: Product = {
  slug: "ripple-vase",
  name: "Ripple Vase",
  category: "Vase",
  price: "ab 34 EUR",
  leadTime: "3-5 Werktage",
  material: ["PLA Matte"],
  finish: "0,16 mm Layer",
  description: "Eine organische Vase mit ruhigem Wellenprofil.",
  image: "/me_square.jpg",
  marketplace: {
    etsyListingId: "etsy-ripple-vase-draft",
    sku: "RR3D-VASE-RIPPLE",
    embedUrl: "https://www.etsy.com/de/listing/etsy-ripple-vase-draft",
  },
};

Deno.test("ProductCard does not expose the internal SKU", () => {
  const html = renderToString(<ProductCard product={fixture} />);
  assert(
    !html.includes(fixture.marketplace.sku),
    `SKU "${fixture.marketplace.sku}" leaked into product card`,
  );
});

Deno.test("ProductCard shows price, name, category and description", () => {
  const html = renderToString(<ProductCard product={fixture} />);
  assert(html.includes(fixture.price), "price missing");
  assert(html.includes(fixture.name), "name missing");
  assert(html.includes(fixture.category), "category missing");
  assert(html.includes(fixture.description), "description missing");
});

Deno.test("ProductCard links to the product detail page", () => {
  const html = renderToString(<ProductCard product={fixture} />);
  assert(html.includes(`/shop/${fixture.slug}`), "detail link missing");
});
