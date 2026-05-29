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
          <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
            {isNotFound ? "Nicht gefunden" : "Fehler"}
          </p>
          <h1 class="display mt-4 text-5xl font-semibold md:text-7xl">
            {isNotFound ? "404." : "Oh no."}
          </h1>
          <p class="mt-6 text-lg text-[var(--muted)]">
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
