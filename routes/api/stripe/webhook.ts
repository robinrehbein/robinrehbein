import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { markOrderPaid } from "@/lib/orders.ts";
import { constructWebhookEvent } from "@/lib/stripe.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const signature = ctx.req.headers.get("stripe-signature");
    if (!signature) return new Response("Missing signature", { status: 400 });

    const payload = await ctx.req.text();
    let event;
    try {
      event = await constructWebhookEvent(payload, signature);
    } catch (err) {
      console.error("Webhook-Signatur ungültig:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as { id: string };
      await markOrderPaid(await getKv(), intent.id);
    }

    return new Response("ok", { status: 200 });
  },
});
