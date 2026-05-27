/** A sales channel a product is (or will be) listed on. Data only — no sync. */
export type Channel = {
  channel: "etsy" | "avocadostore" | "kaufland" | "instagram" | "direct";
  externalId: string;
  url: string;
  enabled: boolean;
};

/** A buyable configuration of a product (e.g. colour x set size). */
export type Variant = {
  id: string; // stable, e.g. "charcoal-36"
  label: string; // "Charcoal · 36er Set"
  priceCents: number;
  image?: string;
  stock?: number | null; // null = made to order
  attributes: Record<string, string>; // { Farbe: "Charcoal", Set: "36er" }
};

type BaseProduct = {
  slug: string;
  name: string;
  description: string;
  images: string[]; // gallery; [0] is the main image
  materials: string[]; // filterable
  fromPriceCents: number; // cheapest variant; derived on save
  leadTime: string;
  variants: Variant[];
  channels: Channel[];
  createdAt: number;
  updatedAt: number;
};

export type VaseProduct = BaseProduct & {
  category: "vase";
  heightMm: number;
  volumeMl: number;
  watertight: boolean;
};

export type PlanterProduct = BaseProduct & {
  category: "planter";
  diameterMm: number;
  drainage: boolean;
};

export type KeycapProduct = BaseProduct & {
  category: "keycap";
  profile: string;
  switchCompat: string;
  legends: "blank" | "legends";
};

export type OrganisationProduct = BaseProduct & {
  category: "organisation";
  dimensions: string;
};

export type Product =
  | VaseProduct
  | PlanterProduct
  | KeycapProduct
  | OrganisationProduct;

export type Category = Product["category"];

export const CATEGORY_LABELS: Record<Category, string> = {
  vase: "Vase",
  planter: "Planter",
  keycap: "Keycaps",
  organisation: "Organisation",
};

/** Human-readable German label for a category key. */
export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}
