import { count, openCart } from "@/lib/cart-store.ts";

export default function CartButton() {
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Warenkorb öffnen"
      class="relative grid size-10 place-items-center rounded-lg border border-[var(--line)] text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
    >
      <span aria-hidden="true">🛒</span>
      {count.value > 0 && (
        <span class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-xs font-bold text-white">
          {count.value}
        </span>
      )}
    </button>
  );
}
