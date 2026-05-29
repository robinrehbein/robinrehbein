import type { Product } from "@/lib/catalog.ts";
import ProductCard from "@/components/ProductCard.tsx";

// Island wrapper so the cards' quick-add buttons stay interactive when rendered
// outside the shop filter (e.g. the home "Neu im Shop" row).
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
