import {
  cartLines,
  cartOpen,
  closeCart,
  removeFromCart,
  totalCents,
  updateQty,
} from "@/lib/cart-store.ts";
import { formatEuro } from "@/lib/price.ts";

export default function CartDrawer() {
  const open = cartOpen.value;
  const lines = cartLines.value;
  return (
    <div
      class={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={open ? "false" : "true"}
    >
      <div
        onClick={closeCart}
        class={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        class={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Warenkorb"
      >
        <header class="flex items-center justify-between border-b border-[var(--line)] p-5">
          <h2 class="text-lg font-semibold tracking-tight">Warenkorb</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Schließen"
            class="grid size-9 place-items-center rounded-lg hover:bg-[var(--surface-muted)]"
          >
            ✕
          </button>
        </header>

        <div class="flex-1 overflow-y-auto p-5">
          {lines.length === 0
            ? (
              <p class="mt-10 text-center text-[var(--muted)]">
                Dein Warenkorb ist leer.
              </p>
            )
            : (
              <ul class="flex flex-col gap-4">
                {lines.map((l) => (
                  <li
                    key={`${l.slug}::${l.variantId}`}
                    class="flex gap-3 border-b border-[var(--line)] pb-4"
                  >
                    <img
                      src={l.image}
                      alt=""
                      class="size-16 rounded-lg border border-[var(--line)] object-cover"
                    />
                    <div class="flex-1">
                      <p class="font-semibold leading-tight">{l.name}</p>
                      <p class="text-sm text-[var(--muted)]">
                        {l.variantLabel}
                      </p>
                      <div class="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Menge verringern"
                          onClick={() =>
                            updateQty(l.slug, l.variantId, l.qty - 1)}
                          class="grid size-7 place-items-center rounded border border-[var(--line)] hover:bg-[var(--surface-muted)]"
                        >
                          −
                        </button>
                        <span class="min-w-6 text-center text-sm font-semibold">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Menge erhöhen"
                          onClick={() =>
                            updateQty(l.slug, l.variantId, l.qty + 1)}
                          class="grid size-7 place-items-center rounded border border-[var(--line)] hover:bg-[var(--surface-muted)]"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(l.slug, l.variantId)}
                          class="ml-auto text-sm text-[var(--muted)] hover:text-[var(--accent)]"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                    <span class="font-semibold">
                      {formatEuro(l.priceCents * l.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <footer class="border-t border-[var(--line)] p-5">
          <div class="flex items-center justify-between">
            <span class="text-[var(--muted)]">Zwischensumme</span>
            <span class="text-lg font-semibold">
              {formatEuro(totalCents.value)}
            </span>
          </div>
          <p class="mt-1 text-xs text-[var(--muted)]">
            inkl. MwSt. · zzgl. Versand
          </p>
          <a
            href="/checkout"
            onClick={closeCart}
            class={`button mt-4 w-full ${
              lines.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={lines.length === 0 ? "true" : "false"}
          >
            Zur Kasse
          </a>
        </footer>
      </aside>
    </div>
  );
}
