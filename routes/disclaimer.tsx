import { Head } from "fresh/runtime";

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer - Robin Rehbein</title>
      </Head>
      <section class="shell max-w-3xl py-16">
        <p class="eyebrow text-[var(--clay)]">Legal</p>
        <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
          Disclaimer.
        </h1>
        <div class="mt-10 grid gap-8 text-lg leading-8">
          <section>
            <h2 class="display text-3xl font-semibold">Haftung fuer Inhalte</h2>
            <p class="mt-3">
              Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Fuer
              Richtigkeit, Vollstaendigkeit und Aktualitaet kann jedoch keine
              Gewaehr uebernommen werden.
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Haftung fuer Links</h2>
            <p class="mt-3">
              Diese Website kann Links zu externen Websites enthalten. Fuer
              deren Inhalte sind ausschliesslich die jeweiligen Betreiber
              verantwortlich.
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Urheberrecht</h2>
            <p class="mt-3">
              Texte, Gestaltung und Inhalte dieser Seite unterliegen dem
              deutschen Urheberrecht, sofern nicht anders gekennzeichnet.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
