import { Head } from "fresh/runtime";
import ShopFilter from "@/islands/ShopFilter.tsx";
import { products } from "@/lib/content.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Robin Rehbein - 3D Print Studio Shop</title>
      </Head>

      <section class="shell py-12 md:py-16">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow text-[var(--clay)]">3D Print Studio</p>
            <h1 class="display mt-4 max-w-3xl text-5xl font-semibold md:text-7xl">
              3D-gedruckte Objekte, kleine Serien.
            </h1>
            <p class="mt-5 max-w-xl text-lg leading-8">
              Vasen, Ordnungsteile und Pflanzenhelfer aus Stuttgart. Klare
              Objekte, sauber gedruckt, in kleinen Auflagen.
            </p>
          </div>
          <a href="/printauftrag" class="button secondary w-fit shrink-0">
            Eigenes Modell drucken
          </a>
        </div>

        <div class="mt-10">
          <ShopFilter products={products} />
        </div>
      </section>

      <section class="section">
        <div class="shell card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p class="eyebrow text-[var(--clay)]">Custom Print</p>
            <h2 class="display mt-3 text-3xl font-semibold md:text-4xl">
              Dein Modell, mein Druckprozess.
            </h2>
            <p class="mt-3 max-w-2xl leading-8">
              STL- oder STEP-Datei hochladen, Material und Finish waehlen,
              technische Hinweise direkt mitgeben.
            </p>
          </div>
          <a href="/printauftrag" class="button shrink-0">
            Druckauftrag starten
          </a>
        </div>
      </section>

      <section class="section">
        <div class="shell flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-sm">
          <p class="opacity-70">
            Hinter dem Studio steht Robin Rehbein, Senior Software Engineer aus
            Stuttgart.
          </p>
          <a href="/about" class="button secondary">Mehr ueber Robin</a>
        </div>
      </section>
    </>
  );
}
