import { Head } from "fresh/runtime";

const roles = [
  ["Software Engineer Senior", "mimacom", "01-01-2026 bis heute"],
  ["Co-Founder", "artwerk studios", "14-03-2023 bis heute"],
  ["Senior Consultant", "MHP - A Porsche Company", "2019 bis 2022"],
  ["IT-Architekt", "T-Systems / Deutsche Telekom", "2015 bis 2021"],
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Robin Rehbein</title>
      </Head>
      <section class="shell py-16">
        <p class="eyebrow text-[var(--clay)]">About Robin</p>
        <h1 class="display mt-5 max-w-5xl text-6xl font-semibold md:text-9xl">
          Software Engineer mit Produktblick und Werkstattenergie.
        </h1>
        <div class="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <img
            src="/me_square.jpg"
            alt="Robin Rehbein"
            class="aspect-square rounded-[8px] border border-[var(--ink)] object-cover"
          />
          <div class="grid content-start gap-6 text-lg leading-8">
            <p>
              Hi, ich bin Robin. Ich lebe in Stuttgart, habe 2018 Computer
              Science und Communications abgeschlossen und seit 2015 meine
              Leidenschaft fuer Webdesign, Entwicklung und neue Technologien
              weiter ausgebaut.
            </p>
            <p>
              Ich mag Kaffee, Pflanzen, Biking und Custom Mechanical Keyboards.
              Genau diese Mischung aus Praezision, Haptik und digitaler
              Produktentwicklung landet jetzt auch im 3D Print Studio dieser
              Seite.
            </p>
            <a href="mailto:hello@robinrehbein.de" class="button w-fit">
              hello@robinrehbein.de
            </a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="shell">
          <p class="eyebrow text-[var(--clay)]">Positions</p>
          <div class="mt-8 grid gap-4">
            {roles.map(([title, company, date], index) => (
              <article class="grid gap-3 border-t border-[var(--line)] py-5 md:grid-cols-[80px_1fr_1fr_1fr]">
                <p class="display text-3xl font-semibold">
                  {(index + 1).toString().padStart(2, "0")}
                </p>
                <h2 class="text-xl font-semibold">{title}</h2>
                <p>{company}</p>
                <p class="opacity-70">{date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
