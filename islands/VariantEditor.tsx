import { useSignal } from "@preact/signals";
import type { Variant } from "@/lib/catalog.ts";

// `orig` carries the original variant so non-edited fields (other attributes
// like "Set", plus image/stock) survive a round-trip through the editor.
type Row = {
  id: string;
  label: string;
  euro: string;
  color: string;
  orig?: Variant;
};

function toRows(variants: Variant[]): Row[] {
  return variants.map((v) => ({
    id: v.id,
    label: v.label,
    euro: (v.priceCents / 100).toFixed(2),
    color: v.attributes["Farbe"] ?? "",
    orig: v,
  }));
}

function toVariants(rows: Row[]): Variant[] {
  return rows.map((r) => {
    const attributes: Record<string, string> = {
      ...(r.orig?.attributes ?? {}),
    };
    if (r.color) attributes.Farbe = r.color;
    else delete attributes.Farbe;
    const variant: Variant = {
      id: r.id || r.label.toLowerCase().replace(/\s+/g, "-"),
      label: r.label,
      priceCents: Math.round(parseFloat(r.euro.replace(",", ".")) * 100) || 0,
      attributes,
    };
    if (r.orig?.image !== undefined) variant.image = r.orig.image;
    if (r.orig?.stock !== undefined) variant.stock = r.orig.stock;
    return variant;
  });
}

export default function VariantEditor(
  { initial }: { initial: Variant[] },
) {
  const rows = useSignal<Row[]>(
    initial.length
      ? toRows(initial)
      : [{ id: "", label: "", euro: "", color: "" }],
  );

  const update = (i: number, key: keyof Row, value: string) => {
    const next = [...rows.value];
    next[i] = { ...next[i], [key]: value };
    rows.value = next;
  };

  return (
    <div>
      <input
        type="hidden"
        name="variants"
        value={JSON.stringify(toVariants(rows.value))}
      />
      <div class="flex flex-col gap-3">
        {rows.value.map((row, i) => (
          <div key={i} class="grid grid-cols-[1fr_90px_1fr_auto] gap-2">
            <input
              class="field"
              placeholder="Label (z. B. Charcoal · 36er)"
              value={row.label}
              onInput={(e) =>
                update(i, "label", (e.target as HTMLInputElement).value)}
            />
            <input
              class="field"
              placeholder="€"
              inputMode="decimal"
              value={row.euro}
              onInput={(e) =>
                update(i, "euro", (e.target as HTMLInputElement).value)}
            />
            <input
              class="field"
              placeholder="Farbe (optional)"
              value={row.color}
              onInput={(e) =>
                update(i, "color", (e.target as HTMLInputElement).value)}
            />
            <button
              type="button"
              class="button secondary"
              onClick={() => (rows.value = rows.value.filter((_, j) =>
                j !== i
              ))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        class="button secondary mt-3"
        onClick={() => (rows.value = [...rows.value, {
          id: "",
          label: "",
          euro: "",
          color: "",
        }])}
      >
        Variante hinzufügen
      </button>
    </div>
  );
}
