import Stripe from "stripe";

let client: Stripe | undefined;

/** Lazily build the Stripe client; throws if the secret key is missing. */
export function getStripe(): Stripe {
  if (client) return client;
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  client = new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  return client;
}

/** Verify and parse a Stripe webhook event using async SubtleCrypto. */
export function constructWebhookEvent(
  payload: string,
  signature: string,
): Promise<Stripe.Event> {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET ist nicht gesetzt.");
  return getStripe().webhooks.constructEventAsync(
    payload,
    signature,
    secret,
    undefined,
    Stripe.createSubtleCryptoProvider(),
  );
}
