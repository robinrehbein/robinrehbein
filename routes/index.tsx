import { Head } from "fresh/runtime";
import ProductCard from "@/components/ProductCard.tsx";
import { marketplaceChannels, posts, products } from "@/lib/content.ts";

const stats = [
  ["2015", "Turning people's ideas into code"],
  ["Stuttgart", "Based in Germany"],
  ["mimacom", "Software Engineer Senior"],
  ["artwerk", "Co-Founder"],
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Robin Rehbein - Code, Blog & 3D Print Studio</title>
      </Head>

      <section class="shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div class="flex flex-wrap gap-2">
            <span class="pill eyebrow">Unavailable for projects</span>
            <span class="pill eyebrow">3D Print Studio live</span>
          </div>
          <h1 class="display mt-8 max-w-4xl text-[clamp(4.4rem,13vw,10.5rem)] font-semibold">
            Architect & Develop.
          </h1>
          <p class="mt-8 max-w-2xl text-xl leading-8 md:text-2xl">
            Ich bin Robin Rehbein, Senior Software Engineer aus Stuttgart. Ich
            entwickle digitale Produkte, schreibe ueber Webtechnologie und
            bringe neue Ideen als 3D gedruckte Objekte auf den Tisch.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="/shop" class="button">Shop ansehen</a>
            <a href="/printauftrag" class="button secondary">
              STL/STEP hochladen
            </a>
          </div>
        </div>

        <div class="relative">
          <div class="maker-grid aspect-[4/5] overflow-hidden rounded-[8px] border border-[var(--ink)] bg-[var(--clay)] p-5">
            <img
              src="/me.jpg"
              alt="Robin Rehbein"
              class="h-full w-full rounded-[4px] object-cover grayscale-[0.15]"
            />
          </div>
          <div class="absolute -bottom-5 -left-4 max-w-xs rounded-[8px] border border-[var(--ink)] bg-[var(--lime)] p-4 shadow-xl">
            <p class="eyebrow">Since 2015</p>
            <p class="mt-2 text-lg font-semibold">
              Turning people's ideas into {"{code}"} and printable things.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell grid gap-4 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div class="border-t border-[var(--ink)] pt-4">
              <p class="display text-4xl font-semibold">{value}</p>
              <p class="mt-2 text-sm opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="section">
        <div class="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p class="eyebrow text-[var(--clay)]">About</p>
            <h2 class="display mt-4 text-6xl font-semibold md:text-7xl">
              Code, Kaffee, Pflanzen, Bikes und Custom Keyboards.
            </h2>
          </div>
          <div class="grid gap-5 text-lg leading-8">
            <p>
              Ich habe 2018 mein Studium in Computer Science und Communications
              abgeschlossen und seitdem in Beratung, Produktentwicklung und
              technischen Architekturen gearbeitet.
            </p>
            <p>
              Aktuell code ich bei mimacom. Als Co-Founder von artwerk studios
              verbinde ich Produkt, Design, Commerce und Umsetzung aus erster
              Hand. Diese Seite fuehrt genau diese Interessen zusammen.
            </p>
            <a href="/about" class="button secondary w-fit">Mehr ueber Robin</a>
          </div>
        </div>
      </section>

      <section class="section bg-[rgba(40,49,59,0.94)] text-[var(--paper)]">
        <div class="shell">
          <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p class="eyebrow text-[var(--lime)]">Shop</p>
              <h2 class="display mt-4 text-6xl font-semibold md:text-8xl">
                3D printed objects.
              </h2>
            </div>
            <a
              href="/shop"
              class="button border-[var(--paper)] bg-[var(--paper)] text-[var(--ink)]"
            >
              Alle Produkte
            </a>
          </div>
          <div class="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div class="card p-6 md:p-8">
            <p class="eyebrow text-[var(--clay)]">Custom Print</p>
            <h2 class="display mt-4 text-5xl font-semibold">
              Dein Modell, mein Druckprozess.
            </h2>
            <p class="mt-5 text-lg leading-8">
              Nutzer koennen STL- oder STEP-Dateien hochladen, Material und
              Finish waehlen und direkt technische Hinweise mitgeben. Der erste
              Schritt ist ein sauberer Anfrage-Flow statt ein blinder Checkout.
            </p>
            <a href="/printauftrag" class="button mt-6">Druckauftrag starten</a>
          </div>
          <div class="card p-6 md:p-8">
            <p class="eyebrow text-[var(--clay)]">Marketplace Ready</p>
            <h2 class="display mt-4 text-5xl font-semibold">
              Etsy und andere Kanaele koennen andocken.
            </h2>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              {marketplaceChannels.map((channel) => (
                <span class="rounded-[6px] border border-[var(--line)] bg-white/30 p-4 font-semibold">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell">
          <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p class="eyebrow text-[var(--clay)]">Blog</p>
              <h2 class="display mt-4 text-6xl font-semibold md:text-8xl">
                Werkstattnotizen.
              </h2>
            </div>
            <a href="/blog" class="button secondary">Alle Artikel</a>
          </div>
          <div class="mt-10 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <a href={`/blog/${post.slug}`} class="card block p-5">
                <p class="eyebrow text-[var(--clay)]">
                  {post.tag} · {post.readTime}
                </p>
                <h3 class="display mt-4 text-3xl font-semibold">
                  {post.title}
                </h3>
                <p class="mt-4 text-sm opacity-76">{post.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
