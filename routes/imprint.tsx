import { Head } from "fresh/runtime";
import { site } from "@/lib/site.ts";

export default function Imprint() {
  return (
    <>
      <Head>
        <title>{`Impressum — ${site.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section class="shell max-w-3xl pt-10 md:pt-16 pb-16 md:pb-24">
        <p class="eyebrow text-mustard-deep mb-4">Legal</p>
        <h1 class="display font-medium text-[clamp(2.5rem,8vw,6rem)] mb-12">
          Impressum.
        </h1>
        <div class="grid gap-10">
          <section>
            <h2 class="display text-2xl font-semibold mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Robin Rehbein<br />
              Stiegelstraße 26<br />
              71701 Schwieberdingen
            </p>
          </section>
          <section>
            <h2 class="display text-2xl font-semibold mb-3">Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a href={`mailto:${site.email}`} class="link-wavy">
                {site.email}
              </a>
            </p>
          </section>
          <section>
            <h2 class="display text-2xl font-semibold mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <p>
              Robin Rehbein (Anschrift wie oben)
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
