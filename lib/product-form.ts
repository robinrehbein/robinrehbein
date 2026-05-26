import type { Product, Variant } from "@/lib/catalog.ts";

export type FormFields = Record<string, string>;

function list(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Build a typed Product from flat form field strings. Variants arrive as JSON. */
export function buildProduct(f: FormFields): Product {
  const variants = JSON.parse(f.variants || "[]") as Variant[];
  const base = {
    slug: f.slug,
    name: f.name,
    description: f.description ?? "",
    images: list(f.images),
    materials: list(f.materials),
    fromPriceCents: 0, // repo recomputes on save
    leadTime: f.leadTime ?? "",
    variants,
    channels: [] as Product["channels"],
    createdAt: 0,
    updatedAt: 0,
  };
  switch (f.category) {
    case "vase":
      return {
        ...base,
        category: "vase",
        heightMm: Number(f.heightMm) || 0,
        volumeMl: Number(f.volumeMl) || 0,
        watertight: f.watertight === "on",
      };
    case "planter":
      return {
        ...base,
        category: "planter",
        diameterMm: Number(f.diameterMm) || 0,
        drainage: f.drainage === "on",
      };
    case "keycap":
      return {
        ...base,
        category: "keycap",
        profile: f.profile ?? "",
        switchCompat: f.switchCompat ?? "",
        legends: f.legends === "legends" ? "legends" : "blank",
      };
    default:
      return {
        ...base,
        category: "organisation",
        dimensions: f.dimensions ?? "",
      };
  }
}
