import { Head } from "fresh/runtime";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Datenschutz - Robin Rehbein</title>
      </Head>
      <section class="shell max-w-3xl py-16">
        <p class="eyebrow text-[var(--clay)]">Legal</p>
        <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
          Datenschutz.
        </h1>
        <div class="mt-10 grid gap-8 text-lg leading-8">
          <p>
            Diese Seite verarbeitet personenbezogene Daten nur, wenn du sie
            aktiv uebermittelst, zum Beispiel ueber das Druckauftrag-Formular
            oder per E-Mail.
          </p>
          <section>
            <h2 class="display text-3xl font-semibold">Kontaktformular</h2>
            <p class="mt-3">
              Beim Absenden eines Druckauftrags werden Name, E-Mail-Adresse,
              Datei-Metadaten, Materialauswahl und Hinweise zur Bearbeitung der
              Anfrage verarbeitet.
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Serverdaten</h2>
            <p class="mt-3">
              Beim Besuch koennen technische Zugriffsdaten entstehen, etwa IP,
              Zeitpunkt, Browser und angefragte URL. Diese Daten dienen Betrieb,
              Sicherheit und Fehleranalyse.
            </p>
          </section>
          <section>
            <h2 class="display text-3xl font-semibold">Kontakt</h2>
            <p class="mt-3">
              Fragen zum Datenschutz:{" "}
              <a class="underline" href="mailto:hello@robinrehbein.de">
                hello@robinrehbein.de
              </a>
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
