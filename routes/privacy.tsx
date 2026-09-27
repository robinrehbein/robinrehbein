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
        <h1 class="display font-medium text-[clamp(2.5rem,8vw,6rem)] mb-4">
          Datenschutz.
        </h1>
        <p class="eyebrow text-green mb-12">Stand: 27. September 2026</p>
        <div class="grid gap-10">
          <section>
            <h2 class="display text-2xl font-semibold mb-3">
              Datenschutz auf einen Blick
            </h2>
            <p class="max-w-prose">
              Diese Website ist eine statische Portfolio-Seite. Auf der Website
              selbst werden keine Cookies gesetzt und keine Tracking- oder
              Analyse-Dienste eingesetzt. Technisch notwendige Verbindungsdaten
              beim Seitenaufruf und Angaben aus E-Mail-Anfragen werden wie unten
              beschrieben verarbeitet. Die Android-App PocketPi verarbeitet
              zusätzlich die im Abschnitt{" "}
              <a href="#pocketpi" class="link-wavy">„PocketPi“</a>{" "}
              beschriebenen Daten. Die App verwendet keine Werbung und bietet
              keine In-App-Käufe.
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
          <section id="pocketpi" class="scroll-mt-24">
            <h2 class="display text-2xl font-semibold mb-3">
              PocketPi (Android-App)
            </h2>
            <div class="grid gap-4 max-w-prose">
              <p>
                Verantwortlich für PocketPi ist Robin Rehbein. Sie erreichen
                mich unter{" "}
                <a href={`mailto:${site.email}`} class="link-wavy">
                  {site.email}
                </a>; weitere Kontaktdaten stehen im{" "}
                <a href="/imprint" class="link-wavy">Impressum</a>. PocketPi ist
                eine Fernsteuerung für pi-Sitzungen auf einem von Ihnen
                gekoppelten Mac. Die App verwendet kein Noah-Konto. Für die
                Kopplung werden ein zeitlich begrenzter QR-Code oder
                Kopplungscode sowie eine Bestätigung am Mac benötigt.
              </p>
              <h3 class="font-semibold text-lg mt-2">
                Welche Daten verarbeitet die App?
              </h3>
              <ul class="grid gap-3 list-disc pl-5">
                <li>
                  <strong>Kopplung und Verbindung:</strong>{" "}
                  PocketPi speichert die Verbindungsadresse des Relay-Dienstes,
                  Kennungen des gekoppelten Macs und Geräts sowie Zugangsdaten
                  für die Kopplung verschlüsselt auf dem Android-Gerät. Der
                  Relay-Dienst erhält die für die Verbindung nötigen Kennungen
                  und leitet verschlüsselte Nachrichten zwischen App und Mac
                  weiter.
                </li>
                <li>
                  <strong>Sitzungen und Eingaben:</strong>{" "}
                  Die App zeigt vom Mac übermittelte Projekte, Sitzungen und
                  Chat-Inhalte an. Ihre Nachrichten, Antworten auf Rückfragen,
                  Befehle und gewählte Einstellungen werden an den gekoppelten
                  Mac übertragen und dort durch pi verarbeitet. Entwürfe,
                  Sitzungsübersichten und Teile des Chat-Verlaufs können
                  verschlüsselt auf dem Android-Gerät zwischengespeichert
                  werden, damit die App nach einem Neustart oder einer
                  Unterbrechung weiter funktioniert. Wenn Sie die Freigabe des
                  Gesprächskontexts für einen Advisor bestätigen, kann pi den
                  freigegebenen Kontext zusätzlich an das ausgewählte KI-Modell
                  übermitteln; ohne diese Bestätigung erhält der Advisor nur die
                  ihm gesendete Frage.
                </li>
                <li>
                  <strong>Fotos und Dateien:</strong>{" "}
                  Fotos und Dokumente werden nur verarbeitet, wenn Sie sie mit
                  dem System-Dateiauswahldialog auswählen. Die App legt eine
                  verschlüsselte lokale Kopie an und überträgt sie über die
                  verschlüsselte Verbindung an den Mac. Fotos werden für die
                  Übertragung verkleinert; Dokumente behalten ihren Inhalt.
                  Hochgeladene Dateien liegen in einem privaten Verzeichnis auf
                  dem Mac. Nicht abgesendete Uploads verfallen dort nach einer
                  Stunde, abgesendete nach sieben Tagen. Eine gespeicherte
                  Unterhaltung kann danach noch einen Verweis auf die Datei
                  enthalten. Lokale Kopien bleiben erhalten, solange ein Entwurf
                  oder ein unklarer Sendevorgang sie benötigt.
                </li>
                <li>
                  <strong>Kamera und Spracheingabe:</strong>{" "}
                  Die Kamera wird nur zum lokalen Scannen eines Kopplungscodes
                  verwendet. Bei einer von Ihnen gestarteten Diktierfunktion
                  erhält PocketPi den erkannten Text vom
                  Android-Spracherkennungsdienst. Die App speichert und
                  überträgt keine Mikrofonaufnahme. Je nach Gerät kann der vom
                  System bereitgestellte Spracherkennungsdienst eine
                  Netzwerkverbindung nutzen; die App weist vor dem Start der
                  Aufnahme darauf hin.
                </li>
                <li>
                  <strong>Optionale Benachrichtigungen:</strong>{" "}
                  Nach der Kopplung können Sie Benachrichtigungen erlauben. Dann
                  werden ein Firebase-Cloud-Messaging-Token und technische
                  Zielkennungen für die Zustellung verwendet. Google erhält für
                  die Zustellung das Token und eine Nachricht mit technischen
                  Kennungen und Ereignistyp. Der Push-Inhalt enthält keinen
                  Chat-Text; die App lädt benötigte Inhalte anschließend über
                  die verschlüsselte Verbindung. Benachrichtigungen sind für die
                  Fernsteuerung nicht erforderlich und lassen sich in den
                  Android-Einstellungen deaktivieren.
                </li>
                <li>
                  <strong>Technische Verbindungsdaten:</strong>{" "}
                  Beim Kontakt mit dem Relay-Dienst und mit Google-Diensten
                  fallen technisch notwendige Netzwerkdaten wie IP-Adresse und
                  Zeitpunkt der Verbindung an. PocketPi verwendet kein eigenes
                  Analyse- oder Werbe-SDK und verkauft keine Nutzerdaten.
                </li>
              </ul>
              <p>
                Die Verarbeitung der Kopplungs-, Sitzungs- und Datei-Daten ist
                für die von Ihnen angeforderte Fernsteuerung erforderlich (Art.
                6 Abs. 1 lit. b DSGVO). Technische Verbindungsdaten werden zum
                sicheren Betrieb verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).
                Optionale Push-Benachrichtigungen werden nach Ihrer Aktivierung
                verarbeitet (Art. 6 Abs. 1 lit. a DSGVO). Sie können die
                Android-Berechtigung jederzeit widerrufen. Soweit Sie selbst
                Inhalte an einen KI-Anbieter senden oder einen Advisor für
                Gesprächskontext freigeben, hängt dessen weitere Verarbeitung
                vom gewählten Anbieter und dessen Bedingungen ab.
              </p>
              <p>
                Die Daten werden auf dem Android-Gerät, dem gekoppelten Mac und
                während der Verbindung auf dem Relay-Dienst verarbeitet. Für
                Push-Nachrichten wird Google Firebase Cloud Messaging
                eingesetzt. Der Relay-Dienst leitet die Sitzungsdaten
                verschlüsselt weiter und speichert keinen dauerhaften
                Chat-Verlauf. Die lokale Speicherung auf dem Android-Gerät ist
                von Android-Cloud-Backups und Geräteübertragungen
                ausgeschlossen. Sie können eine Kopplung in der App entfernen;
                dadurch werden ihre lokalen Zugangsdaten und Entwürfe gelöscht.
                Um den Zugang zusätzlich am Mac zu sperren, müssen Sie das
                gekoppelte Gerät dort widerrufen. Bei Deinstallation entfernt
                Android die App-Daten. Für Auskunfts- und Löschanfragen können
                Sie sich an die oben genannte E-Mail-Adresse wenden;
                Sitzungsverläufe und Dateien auf Ihrem Mac bleiben unter Ihrer
                Kontrolle.
              </p>
              <p>
                Ihre Rechte und das Beschwerderecht sind im Abschnitt{" "}
                <a href="#rechte" class="link-wavy">„Ihre Rechte“</a>{" "}
                dieser Seite beschrieben.
              </p>
            </div>
          </section>
          <section id="rechte" class="scroll-mt-24">
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
