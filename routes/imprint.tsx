import { Head } from "fresh/runtime";

export default function Imprint() {
  return (
    <>
      <Head>
        <title>Impressum - Robin Rehbein</title>
      </Head>
      <section class="shell max-w-3xl py-16">
        <p class="eyebrow text-[var(--clay)]">Legal</p>
        <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
          Impressum.
        </h1>
        <div class="mt-10 grid gap-8 text-lg leading-8">
          <section>
            <h2 class="display text-3xl font-semibold">
              Angaben gemaess § 5 TMG
            </h2>
            <p class="mt-3">
              Robin Rehbein<br />
              [Strasse und Hausnummer]<br />
              [PLZ und Ort]
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Kontakt</h2>
            <p class="mt-3">
              E-Mail:{" "}
              <a class="underline" href="mailto:hello@robinrehbein.de">
                hello@robinrehbein.de
              </a>
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Umsatzsteuer-ID</h2>
            <p class="mt-3">
              Umsatzsteuer-Identifikationsnummer gemaess § 27 a
              Umsatzsteuergesetz: [Umsatzsteuer-ID]
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
