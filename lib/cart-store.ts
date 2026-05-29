import { computed, effect, signal } from "@preact/signals";
import {
  addLine,
  cartCount,
  type CartLine,
  cartTotalCents,
  removeLine,
  setQty,
} from "@/lib/cart.ts";

const STORAGE_KEY = "rr3d-cart";

function load(): CartLine[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as CartLine[] : [];
  } catch (err) {
    console.warn("Cart konnte nicht aus localStorage gelesen werden:", err);
    return [];
  }
}

export const cartLines = signal<CartLine[]>(load());
export const cartOpen = signal(false);
export const count = computed(() => cartCount(cartLines.value));
export const totalCents = computed(() => cartTotalCents(cartLines.value));

// Persist on every change — client only.
if (typeof document !== "undefined") {
  effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartLines.value));
  });
}

export function addToCart(line: CartLine): void {
  cartLines.value = addLine(cartLines.value, line);
}

export function updateQty(slug: string, variantId: string, qty: number): void {
  cartLines.value = setQty(cartLines.value, slug, variantId, qty);
}

export function removeFromCart(slug: string, variantId: string): void {
  cartLines.value = removeLine(cartLines.value, slug, variantId);
}

export function openCart(): void {
  cartOpen.value = true;
}

export function closeCart(): void {
  cartOpen.value = false;
}
