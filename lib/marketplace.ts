import type { Product } from "@/lib/catalog.ts";

type Fetcher = typeof fetch;

export type EtsySyncConfig = {
  shopId: string;
  apiKey: string;
  oauthToken: string;
  taxonomyId: string;
  shippingProfileId: string;
  readinessStateId: string;
};

export type MarketplaceSyncResult = {
  channel: "etsy";
  listingId: string;
  state?: string;
};

export class MarketplaceSyncError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "MarketplaceSyncError";
  }
}

export function getEtsySyncConfig(): EtsySyncConfig | null {
  const shopId = Deno.env.get("ETSY_SHOP_ID");
  const apiKey = Deno.env.get("ETSY_API_KEY");
  const oauthToken = Deno.env.get("ETSY_OAUTH_TOKEN");
  const taxonomyId = Deno.env.get("ETSY_TAXONOMY_ID");
  const shippingProfileId = Deno.env.get("ETSY_SHIPPING_PROFILE_ID");
  const readinessStateId = Deno.env.get("ETSY_READINESS_STATE_ID");

  if (
    !shopId || !apiKey || !oauthToken || !taxonomyId || !shippingProfileId ||
    !readinessStateId
  ) {
    return null;
  }

  return {
    shopId,
    apiKey,
    oauthToken,
    taxonomyId,
    shippingProfileId,
    readinessStateId,
  };
}

export function buildEtsyDraftListingBody(
  product: Product,
  config: EtsySyncConfig,
): URLSearchParams {
  const body = new URLSearchParams();
  body.set("quantity", "1");
  body.set("title", product.name);
  body.set("description", product.description);
  body.set("price", (product.fromPriceCents / 100).toFixed(2));
  body.set("who_made", "i_did");
  body.set("when_made", "made_to_order");
  body.set("taxonomy_id", config.taxonomyId);
  body.set("shipping_profile_id", config.shippingProfileId);
  body.set("readiness_state_id", config.readinessStateId);
  return body;
}

export async function createEtsyDraftListing(
  product: Product,
  config: EtsySyncConfig,
  fetcher: Fetcher = fetch,
): Promise<MarketplaceSyncResult> {
  const response = await fetcher(
    `https://api.etsy.com/v3/application/shops/${config.shopId}/listings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": config.apiKey,
        "Authorization": `Bearer ${config.oauthToken}`,
      },
      body: buildEtsyDraftListingBody(product, config),
    },
  );

  if (!response.ok) {
    throw new MarketplaceSyncError(
      `Etsy sync failed with status ${response.status}.`,
      response.status,
    );
  }

  const data = await response.json() as {
    listing_id?: number | string;
    state?: string;
  };
  if (!data.listing_id) {
    throw new MarketplaceSyncError("Etsy response did not include listing_id.");
  }

  return {
    channel: "etsy",
    listingId: String(data.listing_id),
    state: data.state,
  };
}

export async function syncProductToMarketplaces(
  product: Product,
  fetcher: Fetcher = fetch,
): Promise<MarketplaceSyncResult[]> {
  const etsy = getEtsySyncConfig();
  if (!etsy) return [];
  return [await createEtsyDraftListing(product, etsy, fetcher)];
}
