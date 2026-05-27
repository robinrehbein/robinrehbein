import type { Product } from "@/lib/catalog.ts";
import { listProducts, saveProduct } from "@/lib/products.ts";

const DEMO: Product[] = [
  {
    slug: "ripple-vase",
    name: "Ripple Vase",
    category: "vase",
    description:
      "Organische Vase mit ruhigem Wellenprofil für Trockenblumen und kleine Arrangements.",
    images: ["/me_square.jpg"],
    materials: ["PLA Matte", "PETG Transparent"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    heightMm: 180,
    volumeMl: 600,
    watertight: false,
    variants: [
      {
        id: "matte",
        label: "Matt",
        priceCents: 3400,
        attributes: { Finish: "Matt" },
      },
      {
        id: "trans",
        label: "Transparent",
        priceCents: 3900,
        attributes: { Finish: "Transparent" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "facet-vase",
    name: "Facet Vase",
    category: "vase",
    description:
      "Kantige, facettierte Vase mit mattem Korpus für einen grafischen Look.",
    images: ["/me.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    heightMm: 150,
    volumeMl: 400,
    watertight: false,
    variants: [
      {
        id: "bone",
        label: "Bone",
        priceCents: 2900,
        attributes: { Farbe: "Bone" },
      },
      {
        id: "charcoal",
        label: "Charcoal",
        priceCents: 2900,
        attributes: { Farbe: "Charcoal" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "ring-planter",
    name: "Ring Planter",
    category: "planter",
    description:
      "Selbstständiger Übertopf mit Wasserrille und abnehmbarem Untersetzer.",
    images: ["/me_square.jpg"],
    materials: ["PETG", "PETG Outdoor"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    diameterMm: 120,
    drainage: true,
    variants: [
      {
        id: "s",
        label: "Ø 10 cm",
        priceCents: 1900,
        attributes: { Größe: "10 cm" },
      },
      {
        id: "m",
        label: "Ø 14 cm",
        priceCents: 2600,
        attributes: { Größe: "14 cm" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "hanging-planter",
    name: "Hanging Planter",
    category: "planter",
    description:
      "Leichter Hängetopf mit drei Schnüren, ideal für Stecklinge und kleine Pflanzen.",
    images: ["/me.jpg"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    diameterMm: 100,
    drainage: false,
    variants: [
      {
        id: "sage",
        label: "Sage",
        priceCents: 2200,
        attributes: { Farbe: "Sage" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "mbk-blank-set",
    name: "MBK Blank Set",
    category: "keycap",
    description:
      "Gedruckte Low-Profile-Keycaps im MBK-Stil für Kailh Choc v1. Blank, seidenmatte Oberfläche, präziser Switch-Sitz.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte"],
    fromPriceCents: 0,
    leadTime: "3-5 Werktage",
    profile: "MBK (Low Profile)",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
    variants: [
      {
        id: "charcoal-single",
        label: "Charcoal · Einzeln",
        priceCents: 300,
        attributes: { Farbe: "Charcoal", Set: "Einzeln" },
      },
      {
        id: "charcoal-36",
        label: "Charcoal · 36er Set",
        priceCents: 1800,
        attributes: { Farbe: "Charcoal", Set: "36er" },
      },
      {
        id: "clay-36",
        label: "Clay · 36er Set",
        priceCents: 1800,
        attributes: { Farbe: "Clay", Set: "36er" },
      },
      {
        id: "charcoal-full",
        label: "Charcoal · Full",
        priceCents: 2800,
        attributes: { Farbe: "Charcoal", Set: "Full" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "choc-homing-pair",
    name: "Choc Homing Pair",
    category: "keycap",
    description:
      "Zwei Homing-Keycaps mit fühlbarem Steg für die Zeigefinger, kompatibel mit Choc LP.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte", "PETG Carbon Look"],
    fromPriceCents: 0,
    leadTime: "2-3 Werktage",
    profile: "MBK (Low Profile)",
    switchCompat: "Kailh Choc v1",
    legends: "blank",
    variants: [
      {
        id: "charcoal",
        label: "Charcoal",
        priceCents: 500,
        attributes: { Farbe: "Charcoal" },
      },
      {
        id: "clay",
        label: "Clay",
        priceCents: 500,
        attributes: { Farbe: "Clay" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    slug: "desk-grid-tray",
    name: "Desk Grid Tray",
    category: "organisation",
    description:
      "Flaches Ordnungssystem für Schreibtisch, Keyboard-Parts, Schrauben und Bits.",
    images: ["/macbook_artwerk_landing.webp"],
    materials: ["PLA Matte", "PETG Carbon Look"],
    fromPriceCents: 0,
    leadTime: "2-4 Werktage",
    dimensions: "180 × 120 × 18 mm",
    variants: [
      {
        id: "single",
        label: "Einzeltray",
        priceCents: 2200,
        attributes: { Umfang: "1 Tray" },
      },
      {
        id: "trio",
        label: "3er Modul",
        priceCents: 5400,
        attributes: { Umfang: "3 Trays" },
      },
    ],
    channels: [],
    createdAt: 0,
    updatedAt: 0,
  },
];

/** Seed the demo catalog only when KV holds no products yet. Idempotent. */
export async function seedIfEmpty(kv: Deno.Kv): Promise<void> {
  const existing = await listProducts(kv);
  if (existing.length > 0) return;
  for (const product of DEMO) {
    await saveProduct(kv, product);
  }
}
