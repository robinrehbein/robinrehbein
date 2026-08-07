import { Head } from "fresh/runtime";
import { site } from "@/lib/site.ts";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>{`Datenschutz — ${site.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section class="shell max-w-3xl pt-10 md:pt-16 pb-16 md:pb-24">
        <p class="eyebrow text-mustard-deep mb-4">Legal</p>
        <h1 class="display font-medium text-[clamp(2.5rem,8vw,6rem)] mb-12">
          Datenschutz.
        </h1>
        <div class="grid gap-10">
          <section>
            <h2 class="display text-2xl font-semibold mb-3">
              Datenschutz auf einen Blick
            </h2>
            <p class="max-w-prose">
              Diese Website ist eine rein statische Portfolio-Seite. Es werden
              keine Cookies gesetzt, keine Tracking- oder Analyse-Dienste
              eingesetzt und keine personenbezogenen Daten aktiv erhoben oder
              gespeichert.
            </p>
          </section>
          <section>
            <h2 class="display text-2xl font-semibold mb-3">Server-Logs</h2>
            <p class="max-w-prose">
              Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch
              notwendige Verbindungsdaten (z.&nbsp;B. IP-Adresse, Zeitpunkt des
              Zugriffs, aufgerufene Seite) in Server-Logfiles. Diese
              Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
              zum Zweck des sicheren und stabilen Betriebs der Website. Die
              Daten werden nicht mit anderen Datenquellen zusammengeführt.
            </p>
          </section>
          <section>
            <h2 class="display text-2xl font-semibold mb-3">Kontaktaufnahme</h2>
            <p class="max-w-prose">
              Wenn Sie mir per E-Mail schreiben, werden Ihre Angaben zur
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen
              gespeichert. Diese Daten gebe ich nicht ohne Ihre Einwilligung
              weiter.
            </p>
            <p class="mt-3">
              Verantwortlich: Robin Rehbein,{" "}
              <a href={`mailto:${site.email}`} class="link-wavy">
                {site.email}
              </a>
            </p>
          </section>
          <section>
            <h2 class="display text-2xl font-semibold mb-3">Ihre Rechte</h2>
            <p class="max-w-prose">
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung,
              Löschung, Einschränkung der Verarbeitung sowie Widerspruch und
              Datenübertragbarkeit im Rahmen der geltenden gesetzlichen
              Bestimmungen. Zudem steht Ihnen ein Beschwerderecht bei der
              zuständigen Aufsichtsbehörde zu.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
