import { assertEquals } from "@std/assert";
import type { Product } from "@/lib/catalog.ts";
import {
  buildEtsyDraftListingBody,
  createEtsyDraftListing,
  type EtsySyncConfig,
} from "@/lib/marketplace.ts";

const product: Product = {
  slug: "ripple-vase",
  name: "Ripple Vase",
  category: "vase",
  description: "Eine organische Vase mit ruhigem Wellenprofil.",
  images: ["/me_square.jpg"],
  materials: ["PLA Matte"],
  fromPriceCents: 3400,
  leadTime: "3-5 Werktage",
  heightMm: 180,
  volumeMl: 600,
  watertight: false,
  variants: [
    { id: "matt", label: "Matt", priceCents: 3400, attributes: {} },
  ],
  channels: [],
  createdAt: 0,
  updatedAt: 0,
};

const config: EtsySyncConfig = {
  shopId: "12345678",
  apiKey: "key",
  oauthToken: "token",
  taxonomyId: "1",
  shippingProfileId: "6722757781",
  readinessStateId: "18201076875",
};

Deno.test("buildEtsyDraftListingBody maps product data to Etsy fields", () => {
  const body = buildEtsyDraftListingBody(product, config);
  assertEquals(body.get("title"), product.name);
  assertEquals(body.get("description"), product.description);
  assertEquals(body.get("price"), "34.00");
  assertEquals(body.get("who_made"), "i_did");
  assertEquals(body.get("when_made"), "made_to_order");
  assertEquals(body.get("taxonomy_id"), config.taxonomyId);
  assertEquals(body.get("shipping_profile_id"), config.shippingProfileId);
  assertEquals(body.get("readiness_state_id"), config.readinessStateId);
});

Deno.test("createEtsyDraftListing posts to Etsy draft listing endpoint", async () => {
  let requestedUrl = "";
  let requestedBody = "";
  const result = await createEtsyDraftListing(
    product,
    config,
    (url, init) => {
      requestedUrl = String(url);
      requestedBody = String(init?.body);
      assertEquals(init?.method, "POST");
      assertEquals(
        (init?.headers as Record<string, string>)["x-api-key"],
        "key",
      );
      return Promise.resolve(
        Response.json({ listing_id: 987, state: "draft" }),
      );
    },
  );

  assertEquals(
    requestedUrl,
    "https://api.etsy.com/v3/application/shops/12345678/listings",
  );
  assertEquals(requestedBody.includes("title=Ripple+Vase"), true);
  assertEquals(result, {
    channel: "etsy",
    listingId: "987",
    state: "draft",
  });
});
