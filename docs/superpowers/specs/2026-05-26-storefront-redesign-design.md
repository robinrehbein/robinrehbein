# Storefront-Redesign (Phase 1)

Datum: 2026-05-26
Status: Design genehmigt — bereit für Implementierungsplan

## Kontext

Die heutige Startseite (`routes/index.tsx`) ist primär Selbstvermarktung: ein
bildschirmfüllender „Architect & Develop“-Hero mit Porträt, Karriere-Stats, ein
langer About-Block und eine `Marketplace Ready`-Marketingkarte. Der Shop ist nur
ein Abschnitt weiter unten, sodass die Produkte untergehen.

Ziel: Die Seite soll sich wie ein **echter Shop** anfühlen — Produkte im
Vordergrund, Person/Portfolio als Beiwerk.

Dieses Dokument beschreibt **nur Phase 1** (Storefront-Redesign, reines
Frontend). Drei Folgephasen sind geplant, aber NICHT Teil dieser Spec:

- Phase 2: Admin-Oberfläche + Produktspeicherung in Deno KV
- Phase 3: Eigener Warenkorb + Stripe-Checkout (Testmodus)
- Phase 4: Etsy-Sync-Modul (Stub-/Live-Schalter)

## Umfang Phase 1

### 1. Startseite wird Storefront (`routes/index.tsx`)

Neue Reihenfolge, ersetzt die bestehende Struktur:

1. **Kompakter Shop-Header** statt Mega-Hero. Schmales Band mit Marke und
   einem produktorientierten Claim (z. B. „3D-gedruckte Objekte — kleine Serien
   aus Stuttgart“) plus `Druckauftrag`-CTA. Kein bildschirmfüllendes Porträt.
2. **Kategorie-Filter-Leiste** (Insel): Pills `Alle` + je Kategorie, abgeleitet
   aus `products[].category`. Filtert das Produktraster client-seitig live.
3. **Produkt-Raster** als Hauptbühne, prominent und direkt oben sichtbar.
4. **Custom-Print-CTA** als kompakter Streifen (echtes Feature, bleibt erhalten).
5. **Schmaler Footer-Teaser**: dezenter Link „Mehr über Robin → /about“.

Entfällt ersatzlos von der Startseite (Inhalte sind auf `/about` bereits
abgedeckt — keine Migration nötig):

- Großer „Architect & Develop“-Hero + Porträt
- Stats-Grid (2015 / Stuttgart / mimacom / artwerk)
- Langer About-Abschnitt
- `Custom Print` + `Marketplace Ready` Doppelkarte (der Custom-Print-Teil wird
  als kompakter Streifen neu aufgenommen, die `Marketplace Ready`-Karte fällt
  komplett weg)
- Der bestehende große Blog-Abschnitt entfällt von der Startseite; Blog bleibt
  über die Navigation und ggf. den schmalen Footer-Teaser erreichbar
  (Produktfokus)

### 2. ProductCard verkaufsorientiert (`components/ProductCard.tsx`)

- **SKU entfernen** aus der öffentlichen Karte (interne Lagernummer).
- Preis prominenter darstellen.
- Kategorie als Badge auf dem Produktbild.
- Lieferzeit dezent beibehalten.
- Karte verlinkt weiter auf `/shop/[slug]` (Warenkorb-Button erst Phase 3).

### 3. Kategorie-Filter-Insel (neu, z. B. `islands/ShopFilter.tsx`)

- Erhält die Produktliste als serialisierbare Props (Product[] ist serialisierbar).
- Rendert die Filter-Pills und das Produktraster.
- Filtert client-seitig nach gewählter Kategorie (Signal-basiert).
- „Alle“ als Default.

### 4. `/shop` → Redirect auf `/` (`routes/shop/index.tsx`)

- Die Startseite ist die einzige Storefront-Quelle.
- `/shop` antwortet mit dauerhaftem Redirect (301/308) auf `/`.
- Der bisherige `/shop`-Inhalt inkl. „Distribution / Bereit für Etsy“-Abschnitt
  entfällt.

### 5. Navigation (`components/SiteNav.tsx`, `lib/content.ts`)

- `navItems`: „Home“ wird zu „Shop“; kein separater doppelter Shop-Eintrag.
- Reihenfolge: Shop · Druckauftrag · Blog · About.

### 6. Content-Aufräumen (`lib/content.ts`)

- `marketplaceChannels` wird in der UI nicht mehr verwendet. Konstante kann
  entfernt werden, sofern keine anderen Referenzen bestehen (vor dem Löschen
  prüfen). Das `Product.marketplace`-Feld (etsyListingId/sku/embedUrl) BLEIBT —
  es wird in späteren Phasen gebraucht.

## Explizit NICHT in Phase 1

- Keine Admin-Seite, kein Deno KV, keine Produkterstellung.
- Kein Warenkorb, kein Stripe, kein Checkout.
- Kein Etsy-API-Call.
- Keine sichtbaren Marketplace-/Distribution-/„Etsy kann andocken“-Texte.

## Design-System

Bestehende Tokens und Klassen aus `assets/styles.css` weiterverwenden
(`.shell`, `.section`, `.card`, `.display`, `.eyebrow`, `.pill`, `.button`,
Farbtokens `--ink/--paper/--clay/--lime/--steel`). Keine neuen Fonts/Tokens
nötig; visueller Stil bleibt konsistent.

## Erfolgskriterien

- Beim Öffnen von `/` sind Produkte ohne Scrollen das dominante Element.
- Kein Selbstvermarktungs-Hero, keine Stats, keine `Marketplace Ready`-Karte.
- Kategorie-Filter funktioniert client-seitig.
- `/shop` leitet auf `/` um.
- `/about` enthält weiterhin das Portfolio/Bio (unverändert vorhanden).
- `deno task build`, `deno check`, `deno lint`, `deno fmt` laufen sauber.
