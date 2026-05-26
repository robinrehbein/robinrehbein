import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import ProductCard from "@/components/ProductCard.tsx";
import { products } from "@/lib/content.ts";

Deno.test("ProductCard does not expose the internal SKU", () => {
  const product = products[0];
  const html = renderToString(<ProductCard product={product} />);
  assert(
    !html.includes(product.marketplace.sku),
    `SKU "${product.marketplace.sku}" leaked into product card`,
  );
});

Deno.test("ProductCard shows price, name and category", () => {
  const product = products[0];
  const html = renderToString(<ProductCard product={product} />);
  assert(html.includes(product.price), "price missing");
  assert(html.includes(product.name), "name missing");
  assert(html.includes(product.category), "category missing");
});
