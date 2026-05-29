import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { getKv } from "@/lib/kv.ts";
import { getOrder } from "@/lib/orders.ts";
import { formatEuro } from "@/lib/price.ts";
import ClearCart from "@/islands/ClearCart.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const id = ctx.url.searchParams.get("payment_intent");
    const order = id ? await getOrder(await getKv(), id) : null;
    return { data: { order } };
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <Head>
      <title>Bestellung bestätigt - Robin Rehbein Shop</title>
      <meta name="robots" content="noindex" />
    </Head>
    <ClearCart />
    <section class="shell max-w-2xl py-16 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
        Danke!
      </p>
      <h1 class="display mt-3 text-4xl font-semibold md:text-5xl">
        Bestellung eingegangen.
      </h1>
      <p class="mt-4 text-[var(--muted)]">
        Du erhältst eine Bestätigung per E-Mail. Druck und Versand starten in
        Kürze.
      </p>
      {data.order && (
        <div class="mt-8 overflow-hidden rounded-[12px] border border-[var(--line)] text-left">
          {data.order.items.map((item, i) => (
            <div
              key={`${item.slug}-${item.variantId}`}
              class={`flex items-center justify-between p-4 ${
                i < data.order!.items.length - 1
                  ? "border-b border-[var(--line)]"
                  : ""
              }`}
            >
              <span>
                {item.qty}× {item.name} · {item.variantLabel}
              </span>
              <span class="font-semibold">
                {formatEuro(item.priceCents * item.qty)}
              </span>
            </div>
          ))}
          <div class="flex items-center justify-between bg-[var(--surface-muted)] p-4 font-semibold">
            <span>Gesamt</span>
            <span>{formatEuro(data.order.amountCents)}</span>
          </div>
        </div>
      )}
      <a href="/" class="button mt-8">Weiter shoppen</a>
    </section>
  </>
));
