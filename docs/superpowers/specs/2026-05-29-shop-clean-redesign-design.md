# Shop: Clean-Modern Redesign + Commerce (Cart & Stripe-Checkout)

Datum: 2026-05-29
Status: Design genehmigt (Gesamtvision + Phasen) — Phase 1 bereit für Implementierungsplan

## Kontext

Die Seite ist technisch bereits ein Shop und seit dem letzten Storefront-Redesign
(`2026-05-26-storefront-redesign-design.md`) **produkt-first** aufgebaut:
`routes/index.tsx` zeigt kompakten Header, Featured-Produkt, Kategorie-Filter
(`islands/ShopFilter.tsx`) und Produkt-Raster.

Trotzdem fühlt sie sich für den Nutzer **nicht wie ein Shop** an. Die verbleibenden
Lücken sind:

1. **Visuelle Sprache** — warme Papier-Textur, Noise-Overlay, Grid-Hintergrund und
   editoriale Display-Typo lesen sich wie Portfolio/Studio, nicht wie ein
   kommerzieller Shop.
2. **Kein Kauf** — `In den Warenkorb` ist deaktiviert; Bestellung läuft nur über
   das Anfrage-Formular (`/printauftrag`).
3. **Navigation nicht shop-fokussiert** — Portfolio/Blog/About stehen gleichrangig
   neben dem Shop.

Vom Nutzer bestätigte Richtung: **voller Storefront-Umbau**, Shop wird das Zentrum,
**echter Warenkorb + Checkout inkl. Zahlung (Stripe, eingebettetes Payment
Element)**, **clean & moderner** Look.

## Gesamtvision (alle Phasen)

- **Clean, modern, produktfokussiert.** Neutrale helle Basis, viel Weißraum,
  dezente Borders/Schatten, schwarze Primary-CTAs, ein zurückhaltender Clay-Akzent
  als Markenrest.
- **Shop-first IA.** Navigation und Startseite drehen sich um Produkte; Portfolio/
  Blog/About werden zu Nebenseiten (Footer + „Mehr"-Menü).
- **Echter Kauf-Flow.** Client-Warenkorb (Signals + `localStorage`) → Checkout mit
  Adresse + Stripe Payment Element → KV-Bestellung, serverseitig verifiziert.

## Fundament (bleibt unverändert nutzbar)

- Deno KV als Speicher; Produkt-Datenmodell mit Varianten (`lib/catalog.ts`):
  `Variant = { id, label, priceCents, image?, stock?, attributes }`.
- Filter/Gruppierung (`lib/shop.ts`), Preis-Formatierung (`lib/price.ts`),
  Admin-Bereich, Druck-Viewer, Blog, About.
- Tailwind v4, `class-variance-authority`, `@nick/clsx`, `tailwind-merge` — Basis
  für ein konsistentes UI-Primitive-System.

---

# Phase 1 — Clean-Modern Design-System + Restyle (reines Frontend, kein Bezahlteil)

Ziel: Die Seite sieht und fühlt sich nach diesem Schritt wie ein moderner Shop an.
Keine neue Geschäftslogik; rein präsentational. Bestehende Tests müssen grün
bleiben.

## 1. Design-Tokens (`assets/styles.css`)

Ersetzt die erdig-editoriale Palette und entfernt die Texturen.

**Entfällt:** `body::before` Noise-Overlay, Grid-Linien-Hintergrund, radialer
Lime-Gradient, Papier-Hintergrund.

**Neue Tokens (Vorschlag, im Review final justierbar):**

| Token | Wert | Zweck |
| --- | --- | --- |
| `--bg` | `#ffffff` | Seiten-Hintergrund (clean, texturfrei) |
| `--surface` | `#ffffff` | Karten/Flächen |
| `--surface-muted` | `#f6f6f4` | abgesetzte Bänder/Felder |
| `--ink` | `#171717` | Primärtext, Primary-CTA-Hintergrund |
| `--muted` | `#6b7280` | Sekundärtext |
| `--line` | `#e5e5e5` | Borders |
| `--accent` | `#b55732` (Clay) | Akzent: Links, Sale-/Highlight-Badges |
| `--radius` | `12px` Karten / `8px` Buttons | konsistente Rundung |
| Schatten | weich: `0 1px 2px rgba(0,0,0,.04)`, Hover `0 8px 24px rgba(0,0,0,.06)` | dezent modern |

**Typografie:** `Anaheim` als Body-Sans (vorhanden). `ClashDisplay` nur für große
Headlines, zurückhaltender als heute (kein `line-height: 0.9`-Editorial). Keine
neuen Font-Assets.

> Offene Mini-Entscheidung fürs Review: Clay-Akzent behalten (Default) oder komplett
> neutral (Akzent = Ink). Aktuell: Clay behalten.

## 2. UI-Primitives (neu, `components/ui/`)

Wiederverwendbare, mit `cva` + `tailwind-merge` typisierte Server-Komponenten
(kein JS, kein Hook):

- `Button.tsx` — Varianten `primary` (Ink/Weiß), `secondary` (outline),
  `ghost`; Größen `sm|md|lg`. Ersetzt die `.button`-Utility schrittweise.
- `Badge.tsx` — Varianten `category`, `accent` (Sale/Neu), `muted`, `stock`.
- `Price.tsx` — kapselt `formatEuro`/`formatFrom`; Prop `from?: boolean`.
- `Container.tsx` / `Section.tsx` (optional) — kapselt `.shell`/`.section` als
  Komponente für konsistente Abstände.

Diese Primitives sind die einzige Stelle, an der CTA-/Badge-/Preis-Stil definiert
wird (eine Quelle der Wahrheit).

## 3. Restyle der Seiten & Komponenten

Struktur bleibt; nur Optik/Markup-Klassen werden auf das neue System gehoben.

- **`components/SiteNav.tsx`** — Shop-first: Logo · Kategorie-/Shop-Links ·
  „Mehr"-Bereich für `Druckauftrag`/`Blog`/`About` (Footer-tauglich, in der Nav
  dezent) · Primary-CTA. **Warenkorb-Slot reserviert** (Icon + Zähler erst in
  Phase 2 verdrahtet). Sticky, heller, dünne Border statt blur-Glas.
- **`components/SiteFooter.tsx`** — clean, hier landen Portfolio/Blog/About/Impressum
  prominent.
- **`components/ProductCard.tsx`** — moderne Karte: ruhiges Bild, Kategorie-Badge,
  prominenter Preis (`Price`), dezente Lieferzeit, Farb-Swatches beibehalten.
- **`routes/index.tsx`** — Storefront: schlanker Hero (Claim + Trust-Strip
  „Versand 2–5 Tage · sichere Zahlung · kleine Serien"), Kategorie-Schnellnav,
  Produkt-Raster prominent, Druckauftrag-Streifen restyled, Trust-Band.
- **`routes/shop/index.tsx`** — voller Katalog im neuen Look.
- **`routes/shop/[slug].tsx`** + **`islands/ProductDetail.tsx`** — Detailseite mit
  prominentem Preis, Varianten-Auswahl, Lager/„auf Bestellung"-Hinweis, Versand-/
  Material-Infos. `In den Warenkorb` bleibt in Phase 1 **deaktiviert** (aktiviert in
  Phase 2), aber im neuen Stil.
- **`islands/ShopFilter.tsx`** — Filter-Chips im neuen Stil.
- **`routes/printauftrag`, `routes/blog`, `routes/about`** + zugehörige Komponenten
  — leichter Restyle, damit nichts visuell aus dem Rahmen fällt.

## 4. Nicht in Phase 1

- Warenkorb-Logik/-State, Add-to-Cart-Funktion (Phase 2).
- Checkout, Stripe, Bestellungen (Phase 3).
- Änderungen am Datenmodell, an Admin oder am 3D-Viewer-Verhalten.

## 5. Architektur / Isolation

- UI-Primitives in `components/ui/` sind in sich abgeschlossen, ohne Abhängigkeit
  zu Routen oder State — testbar/austauschbar.
- Restyle ändert keine Handler/Datenflüsse; Props und Routen bleiben gleich.

## 6. Fehlerfälle

- Phase 1 fügt keine neuen Fehlerpfade hinzu. Bestehende `_error.tsx`/404 werden
  lediglich auf das neue Design gehoben.

## 7. Testing

- `deno task check` (fmt + lint + type) muss grün sein.
- `deno test` muss grün bleiben — insbesondere `components/ProductCard_test.tsx`,
  `routes/shop/index_test.ts`, `lib/*_test.ts`. Da Phase 1 präsentational ist,
  dürfen sich Logik-Tests nicht ändern; ggf. brüchige Selektor-/Text-Assertions in
  `ProductCard_test.tsx` werden minimal angepasst, wenn Markup-Struktur sich ändert.
- Manuelle Sichtprüfung der Haupt-Routen (`/`, `/shop`, `/shop/[slug]`,
  `/printauftrag`, `/blog`, `/about`) im Dev-Server.

---

# Phase 2 — Warenkorb (Ausblick, eigenes Spec/Plan folgt)

- `lib/cart.ts` — reine, testbare Warenkorb-Rechnung (Zeilen, Summen, Mengen).
- Cart-State als Signal + `localStorage`-Persistenz; Zeile `{slug, variantId, qty}`,
  aufgelöst gegen Produktdaten.
- `islands/CartDrawer.tsx` (Slide-over) + Warenkorb-Zähler-Badge in der Nav.
- „In den Warenkorb" auf Detailseite aktivieren; optional Quick-Add auf Karten.
- Warenkorb-Seite/-Übersicht.

# Phase 3 — Checkout + Stripe Payment Element (Ausblick, eigenes Spec/Plan folgt)

- `lib/orders.ts` — Bestellungen in KV.
- `POST /api/checkout/payment-intent` — **Summe serverseitig aus KV-Preisen neu
  berechnen** (Client-Preise nie vertrauen), Stripe PaymentIntent erstellen,
  `client_secret` zurückgeben.
- `/checkout` — Bestellübersicht + Adressformular + **Stripe Payment Element
  (eingebettet)** via `@stripe/stripe-js`.
- `/checkout/success` — Bestätigung.
- `POST /api/stripe/webhook` — Signatur verifizieren, Bestellstatus persistieren.
- Env: `STRIPE_SECRET_KEY` (Server), `FRESH_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Client),
  `STRIPE_WEBHOOK_SECRET`.
- **Abhängigkeit:** Stripe-Account + (Test-)API-Keys vom Nutzer nötig, um live zu
  testen.
