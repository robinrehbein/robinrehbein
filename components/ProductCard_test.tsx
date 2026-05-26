import { assert } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import ProductCard from "@/components/ProductCard.tsx";
import type { KeycapProduct } from "@/lib/catalog.ts";

const product: KeycapProduct = {
  slug: "mbk-blank-set",
  name: "MBK Blank Set",
  category: "keycap",
  description: "Low-Profile-Keycaps für Choc LP.",
  images: ["/x.jpg"],
  materials: ["PLA Matte"],
  fromPriceCents: 1800,
  leadTime: "3-5 Werktage",
  profile: "MBK",
  switchCompat: "Kailh Choc v1",
  legends: "blank",
  variants: [
    {
      id: "a",
      label: "Charcoal",
      priceCents: 1800,
      attributes: { Farbe: "Charcoal" },
    },
  ],
  channels: [{
    channel: "etsy",
    externalId: "secret-123",
    url: "x",
    enabled: true,
  }],
  createdAt: 0,
  updatedAt: 0,
};

Deno.test("ProductCard shows name, formatted price and category label", () => {
  const html = renderToString(<ProductCard product={product} />);
  assert(html.includes("MBK Blank Set"), "name missing");
  assert(html.includes("ab 18 €"), "formatted price missing");
  assert(html.includes("Keycaps"), "category label missing");
});

Deno.test("ProductCard does not leak channel external IDs", () => {
  const html = renderToString(<ProductCard product={product} />);
  assert(!html.includes("secret-123"), "channel externalId leaked");
});
