/** A single line in the cart — a snapshot taken at add-time for display. */
export type CartLine = {
  slug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  image: string;
  qty: number;
};

const keyOf = (slug: string, variantId: string) => `${slug}::${variantId}`;

/** Total number of items (sum of quantities). */
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

/** Sum of price * quantity across all lines, in cents. */
export function cartTotalCents(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.priceCents * l.qty, 0);
}

/** Add a line, merging into an existing slug+variant by incrementing qty. */
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const key = keyOf(line.slug, line.variantId);
  if (lines.some((l) => keyOf(l.slug, l.variantId) === key)) {
    return lines.map((l) =>
      keyOf(l.slug, l.variantId) === key ? { ...l, qty: l.qty + line.qty } : l
    );
  }
  return [...lines, line];
}

/** Set a line's quantity; a qty <= 0 removes the line. */
export function setQty(
  lines: CartLine[],
  slug: string,
  variantId: string,
  qty: number,
): CartLine[] {
  if (qty <= 0) return removeLine(lines, slug, variantId);
  const key = keyOf(slug, variantId);
  return lines.map((l) =>
    keyOf(l.slug, l.variantId) === key ? { ...l, qty } : l
  );
}

/** Remove the line matching slug+variant. */
export function removeLine(
  lines: CartLine[],
  slug: string,
  variantId: string,
): CartLine[] {
  const key = keyOf(slug, variantId);
  return lines.filter((l) => keyOf(l.slug, l.variantId) !== key);
}
