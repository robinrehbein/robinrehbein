# Katalog + Design + Datenschicht + Admin (Teilprojekt A + B)

Datum: 2026-05-26
Status: Design genehmigt — bereit für Implementierungsplan

## Kontext

[Phase 1](2026-05-26-storefront-redesign-design.md) hat die Startseite zu einer
produktorientierten Storefront umgebaut (Kategorie-Filter-Insel, verkaufs-
orientierte `ProductCard`, `/shop` → `/`). Produkte liegen aktuell statisch in
`lib/content.ts` (3 Demo-Produkte mit Platzhalterbildern), das
`Product.marketplace`-Feld ist Etsy-spezifisch.

Ziel dieses Teilprojekts: **echte Produktvielfalt** (Vasen, Planter,
**Keycaps für Choc-LP-Switches** als neue Kategorie), **Design-Politur**
(Editorial-Look) und gleich die **richtige Datenschicht** (Deno KV) plus
**Admin-UI**, damit später kein Umbau nötig ist. Das fasst die ursprünglich
getrennten Phasen 1-Erweiterung und Phase 2 (Admin/KV) zu einem Zyklus zusammen.

Nicht Teil dieser Spec (eigene spätere Zyklen):

- Teilprojekt C: Warenkorb + Stripe-Checkout (Testmodus)
- Teilprojekt D: Etsy-/Multi-Channel-Sync (Listing-Abgleich)

## Designentscheidungen (aus dem Brainstorming)

- **Produktdaten:** realistische **Demo-Daten** mit Platzhalterbildern; später
  übers Admin ersetzbar.
- **Datenmodell:** **typisierte Felder pro Kategorie** (diskriminierte Union),
  nicht freie Specs. Neue Kategorie = kleine Code-Änderung (akzeptiert).
- **Varianten:** **volle Variantenunterstützung pro Produkt** (Farbe, Set-Größe
  o. ä.) mit eigenem Preis/Bild/Bestand — zukunftssicher für den Warenkorb.
- **Channels:** generische `channels`-Liste statt Etsy-spezifischer Felder.
- **Preise:** intern als **Zahl (Cent)**, Anzeige formatiert (z. B. „ab 34 €") —
  Voraussetzung für den Preisfilter.
- **Filter:** **Kategorie · Material · Preisspanne** (Verfügbarkeit nicht).
- **Admin-Auth:** **Passwort + signiertes Session-Cookie**, Session in Deno KV.
- **Bilder:** **Datei-Upload nach `static/`** → Deployment-Annahme: Docker/VPS
  mit beschreibbarem Dateisystem, **nicht** Deno Deploy.
- **Design-Richtung:** **„Editorial Maker"** — Featured-Produkt-Band +
  kuratierte/gefilterte Produktabschnitte, baut auf dem bestehenden Design-System
  auf (Papier/Clay/ClashDisplay, `.card`, `.pill`, `.eyebrow`).

## Datenmodell

`lib/content.ts` verliert die statische `products`-Konstante (wandert in KV).
Das `Product`-Typmodell wird in ein eigenes Modul gezogen (z. B. `lib/types.ts`
oder weiterhin `lib/content.ts`) und ersetzt das alte `marketplace`-Feld:

```ts
type Channel = {
  channel: "etsy" | "avocadostore" | "kaufland" | "instagram" | "direct";
  externalId: string;
  url: string;
  enabled: boolean;
};

type Variant = {
  id: string;            // stabil, z. B. "charcoal-36"
  label: string;         // "Charcoal · 36er Set"
  priceCents: number;
  image?: string;
  stock?: number | null; // null = auf Bestellung gefertigt
  attributes: Record<string, string>; // { Farbe: "Charcoal", Set: "36er" }
};

type BaseProduct = {
  slug: string;
  name: string;
  description: string;
  images: string[];        // Galerie, [0] = Hauptbild
  materials: string[];     // filterbar
  fromPriceCents: number;  // günstigste Variante (für Listen/Preisfilter)
  leadTime: string;
  variants: Variant[];
  channels: Channel[];
  createdAt: number;
  updatedAt: number;
};

type VaseProduct       = BaseProduct & { category: "vase";    heightMm: number; volumeMl: number; watertight: boolean };
type PlanterProduct    = BaseProduct & { category: "planter"; diameterMm: number; drainage: boolean };
type KeycapProduct     = BaseProduct & { category: "keycap";  profile: string; switchCompat: string; legends: "blank" | "legends" };
type OrganisationProduct = BaseProduct & { category: "organisation"; dimensions: string };

type Product = VaseProduct | PlanterProduct | KeycapProduct | OrganisationProduct;
```

- **Varianten** sind die kaufbaren Konfigurationen (Farbe × Set-Größe); die
  **kategoriespezifischen Felder** sind beschreibend (für Specs + Filter).
- `fromPriceCents` ist abgeleitet (Minimum der Variantenpreise) und wird beim
  Speichern aktualisiert, damit Listen-/Preisfilter ohne Varianten-Scan gehen.
- Eine Preis-Format-Hilfe (`formatPrice(cents): string`) liefert „ab X €" bzw.
  exakte Variantenpreise.

## Datenschicht (Deno KV)

- **`lib/products.ts`** — Repository mit async CRUD:
  `listProducts()`, `getProduct(slug)`, `createProduct(p)`, `updateProduct(p)`,
  `deleteProduct(slug)`. KV-Keys: `["product", slug]`. `updateProduct` setzt
  `updatedAt` und `fromPriceCents` neu.
- **`lib/seed.ts`** — idempotentes Seeding: legt die Demo-Produkte nur an, wenn
  KV leer ist. Mindestens 2 Vasen, 2 Planter, 2 Keycap-Sets (mit Farb- und
  Set-Varianten), 1 Organisationsteil. Platzhalterbilder in `static/`.
- Seeding läuft beim Serverstart (in `main.ts` oder via Init-Aufruf), bevor
  Routen Anfragen bedienen.
- Routen/Handler laden Produkte server-seitig aus KV und reichen sie
  **serialisierbar** an Inseln weiter (Product[] ist serialisierbar).
- `posts`, `navItems`, `materials` bleiben statisch in `lib/content.ts`.

## Admin-UI (Passwort + Session)

- **`routes/admin/_middleware.ts`** — liest signiertes Session-Cookie, prüft die
  Session in KV (`["session", id]`, mit TTL). Fehlt/ungültig → Redirect auf
  `/admin/login`. Gilt für `/admin` und alle Unterrouten.
- **`routes/admin/login.tsx`** — Passwortformular (POST). Vergleich gegen
  `ADMIN_PASSWORD` (Env, server-only). Bei Erfolg: Session in KV anlegen,
  signiertes Cookie setzen, Redirect auf `/admin`. Logout-Route räumt Session +
  Cookie ab.
- **`routes/admin/index.tsx`** — Produktliste mit Neu/Bearbeiten/Löschen.
- **`routes/admin/new.tsx`** und **`routes/admin/[slug].tsx`** — Formular über
  alle Felder inkl. **Varianten-Editor** (Liste hinzufügen/entfernen) und
  **Bild-Upload** (`multipart/form-data`, schreibt nach `static/uploads/`,
  speichert relativen Pfad in `images`/`variant.image`). Server-seitige
  Validierung; Post/Redirect/Get.
- Eine kleine Insel kann den Varianten-Editor interaktiv machen
  (Zeilen hinzufügen/entfernen); die Persistenz bleibt server-seitig per Form.

## Frontend / Design (Richtung „Editorial Maker")

- **`routes/index.tsx`** — Startseite lädt Produkte aus KV (Handler) und rendert:
  1. **Featured-Produkt-Band** (ein kuratiertes Produkt prominent).
  2. **Filterleiste**: Kategorie-Pills · Material · Preisspanne.
  3. **Produktbereich**: ohne aktiven Filter nach Kategorie gruppierte
     Abschnitte; bei aktivem Filter ein flaches gefiltertes Raster.
  4. Custom-Print-Streifen + About-Teaser (aus Phase 1) bleiben.
- **`islands/ShopFilter.tsx`** — erweitert auf Mehrdimensions-Filter
  (Kategorie + Material + Preisspanne) per Signals; rendert Filtersteuerung +
  Raster/Abschnitte.
- **`lib/shop.ts`** — reine, getestete Filterlogik erweitert: `categoriesOf`,
  `materialsOf`, `priceBounds`, `filterProducts(products, { category, material,
  maxPriceCents })`, `groupByCategory`.
- **`components/ProductCard.tsx`** — poliert: formatierter Preis aus
  `fromPriceCents`, Kategorie-Badge, dezente Farb-Dots der Varianten. Kein
  interner Channel/`externalId`-Leak.
- **`routes/shop/[slug].tsx`** — lädt Produkt aus KV; Detailseite im gezeigten
  Layout: Galerie links, rechts Titel/Preis, Varianten-Auswahl, typisierte
  Spec-Tabelle (Felder je nach `category`), „In den Warenkorb"-Platzhalter +
  „Ähnliches anfragen".
- **`islands/ProductDetail.tsx`** — Interaktivität: Thumbnail-Galerie-Wechsel,
  Varianten-Auswahl (Farbe/Set), aktualisiert angezeigten Preis + Hauptbild.

## Tests

- **`lib/shop_test.ts`** (erweitert) — Mehrdimensions-Filter: Kategorie,
  Material, Preisspanne, Kombinationen; `groupByCategory`.
- **`lib/products_test.ts`** — KV-CRUD gegen temporäre KV (z. B. `:memory:`):
  create→get, list, update aktualisiert `fromPriceCents`/`updatedAt`, delete.
- **Preisformatierung** — `formatPrice` rendert Cent korrekt.
- **`components/ProductCard_test.tsx`** (erweitert) — zeigt formatierten Preis,
  Name, Kategorie; leakt keinen Channel/`externalId`.
- **Session-Helfer** — Erstellen/Validieren/Ablauf einer Session (reine Logik,
  KV-gestützt).

## Deployment-Annahme

Docker/VPS mit beschreibbarem `static/` (für Bild-Upload). **Nicht** Deno Deploy
(read-only FS). Falls später Deno Deploy gewünscht ist, muss die Bildablage auf
externe URL oder Object-Store (R2/S3) umgestellt werden — out of scope hier.

## Explizit NICHT in diesem Teilprojekt

- Kein Warenkorb, kein Stripe, kein Checkout (Teilprojekt C).
- Kein echter Etsy-/Channel-Sync-Call (Teilprojekt D) — `channels` ist nur
  Datenhaltung/Anzeige, kein API-Abgleich.
- Keine Mehrbenutzer-/Rollenverwaltung im Admin (Single-Maker).

## Erfolgskriterien

- Startseite zeigt Featured-Band + funktionierende Filter (Kategorie · Material ·
  Preisspanne) im Editorial-Look.
- Detailseite mit Galerie, Varianten-Auswahl (Preis/Bild aktualisieren sich) und
  typisierter Spec-Tabelle.
- Produkte werden aus Deno KV geladen; Seeding füllt einen Demo-Katalog inkl.
  Keycaps für Choc LP mit Varianten.
- `/admin` ist ohne gültige Session nicht erreichbar; mit Login lassen sich
  Produkte inkl. Varianten anlegen/bearbeiten/löschen und Bilder hochladen.
- Kein Etsy-spezifisches `marketplace`-Feld mehr; generische `channels`-Liste.
- `deno task check`, `deno task test`, `deno lint`, `deno fmt` laufen sauber.
