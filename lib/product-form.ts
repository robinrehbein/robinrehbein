import type { Product, Variant } from "@/lib/catalog.ts";

export type FormFields = Record<string, string>;

function list(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Normalise a user-supplied slug to a safe, URL/KV-friendly form. */
export function slugify(value: string): string {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Build a typed Product from flat form field strings. Variants arrive as JSON. */
export function buildProduct(f: FormFields): Product {
  const variants = JSON.parse(f.variants || "[]") as Variant[];
  const base = {
    slug: slugify(f.slug),
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
