import { HttpError } from "fresh";
import { Head } from "fresh/runtime";

export default function ErrorPage({ error }: { error: unknown }) {
  const isNotFound = error instanceof HttpError && error.status === 404;

  return (
    <>
      <Head>
        <title>{isNotFound ? "404" : "Fehler"} - Robin Rehbein</title>
      </Head>
      <section class="shell grid min-h-[70vh] place-items-center py-16 text-center">
        <div>
          <p class="eyebrow text-[var(--clay)]">
            {isNotFound ? "Nicht gefunden" : "Fehler"}
          </p>
          <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
            {isNotFound ? "404." : "Oh no."}
          </h1>
          <p class="mt-6 text-xl opacity-75">
            {isNotFound
              ? "Diese Seite existiert nicht oder wurde verschoben."
              : "Etwas ist schiefgelaufen."}
          </p>
          <a href="/" class="button mt-8">Zur Startseite</a>
        </div>
      </section>
    </>
  );
}
