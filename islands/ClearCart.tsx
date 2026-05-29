import { useEffect } from "preact/hooks";
import { clearCart } from "@/lib/cart-store.ts";

export default function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
