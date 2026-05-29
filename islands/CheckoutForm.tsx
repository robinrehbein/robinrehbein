import { useEffect, useRef, useState } from "preact/hooks";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import { cartLines } from "@/lib/cart-store.ts";
import { formatEuro } from "@/lib/price.ts";

type Status = "loading" | "ready" | "processing" | "error" | "empty";

export default function CheckoutForm(
  { publishableKey }: { publishableKey: string },
) {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const paymentRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);

  useEffect(() => {
    const lines = cartLines.value;
    if (lines.length === 0) {
      setStatus("empty");
      return;
    }
    if (!publishableKey) {
      setStatus("error");
      setMessage("Zahlung ist noch nicht konfiguriert (Stripe-Key fehlt).");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/payment-intent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: lines.map((l) => ({
              slug: l.slug,
              variantId: l.variantId,
              qty: l.qty,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Fehler beim Checkout.");
        if (cancelled) return;
        setAmount(data.amountCents);

        const stripe = await loadStripe(publishableKey);
        if (!stripe) throw new Error("Stripe konnte nicht geladen werden.");
        stripeRef.current = stripe;
        const elements = stripe.elements({ clientSecret: data.clientSecret });
        elementsRef.current = elements;
        elements.create("address", { mode: "shipping" }).mount(
          addressRef.current!,
        );
        elements.create("payment").mount(paymentRef.current!);
        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage((err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publishableKey]);

  async function submit(e: Event) {
    e.preventDefault();
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) return;
    setStatus("processing");
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${globalThis.location.origin}/checkout/success`,
      },
    });
    if (error) {
      setStatus("ready");
      setMessage(error.message ?? "Zahlung fehlgeschlagen.");
    }
  }

  if (status === "empty") {
    return (
      <p class="text-[var(--muted)]">
        Dein Warenkorb ist leer.{" "}
        <a href="/" class="text-[var(--accent)]">Weiter shoppen →</a>
      </p>
    );
  }

  return (
    <form onSubmit={submit} class="grid gap-6">
      {amount > 0 && (
        <div class="flex items-center justify-between rounded-[12px] border border-[var(--line)] p-4">
          <span class="text-[var(--muted)]">Gesamt</span>
          <span class="text-xl font-semibold">{formatEuro(amount)}</span>
        </div>
      )}
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
          Lieferadresse
        </p>
        <div ref={addressRef} />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
          Zahlung
        </p>
        <div ref={paymentRef} />
      </div>
      {message && <p class="text-sm text-[var(--accent)]">{message}</p>}
      <button type="submit" class="button" disabled={status !== "ready"}>
        {status === "processing" ? "Wird verarbeitet…" : "Jetzt bezahlen"}
      </button>
      {status === "loading" && (
        <p class="text-sm text-[var(--muted)]">Checkout wird geladen…</p>
      )}
    </form>
  );
}
