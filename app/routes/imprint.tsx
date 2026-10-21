export function meta() { return [{ title: `Impressum — ${site.name}` }, { name: "robots", content: "noindex" }]; }
import { site } from "@/lib/site.ts";

export default function Imprint() {
  return (
    <>
      <section lang="de" className="legal-page shell max-w-3xl pt-10 md:pt-16 pb-16 md:pb-24">
        <p className="eyebrow text-mustard-deep mb-4">Legal</p>
        <h1 className="display font-medium text-[clamp(2.5rem,8vw,6rem)] mb-12">
          Impressum.
        </h1>
        <div className="grid gap-10">
          <section>
            <h2 className="display text-2xl font-semibold mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Robin Rehbein<br />
              Stiegelstraße 26<br />
              71701 Schwieberdingen
            </p>
          </section>
          <section>
            <h2 className="display text-2xl font-semibold mb-3">Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a href={`mailto:${site.email}`} className="link-wavy">
                {site.email}
              </a>
            </p>
          </section>
          <section>
            <h2 className="display text-2xl font-semibold mb-3">
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
