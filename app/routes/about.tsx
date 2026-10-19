export function meta() { return [{ title: `About — ${site.name}` }, { name: "description", content: `Bio, positions and certifications of ${site.name}, ${site.role} based in ${site.location}.` }, { tagName: "link", rel: "canonical", href: `${site.url}/about` }]; }
import { brandStyle, certifications, likes, positions, site } from "@/lib/site.ts";
import { PositionItem } from "@/components/PositionItem.tsx";
import { SectionHead } from "@/components/SectionHead.tsx";
import { sizeOf } from "@/lib/imageSizes.ts";

export default function About() {
  const current = positions.filter((p) => p.current);
  const previous = positions.filter((p) => !p.current);
  return (
    <>
      <section className="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <h1 className="reveal reveal-1 display font-medium text-[clamp(3rem,10vw,8rem)] mb-12 md:mb-20">
          About me.
        </h1>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <img
            src="/me.webp"
            {...sizeOf("/me.webp")}
            alt={`Portrait of ${site.name}`}
            className="reveal reveal-2 photo print-shadow w-full aspect-[4/5] object-cover object-top"
          />
          <div className="reveal reveal-3 md:sticky md:top-28">
            <p className="serif-lede mb-6">
              Hi — I'm <strong className="font-semibold">Robin</strong>,
            </p>
            <p className="mb-4 max-w-prose">
              a software engineer living in Stuttgart. I finished my studies in
              computer science and communications in 2018 and found my passion
              for web design and development along the way. Since then I have
              taught myself many new technologies and programming languages, and
              my excitement for learning never stops.
            </p>
            <p className="mb-8 max-w-prose">
              In my free time, I enjoy working on custom mechanical keyboards,
              making unique and personal typing experiences. During the
              pandemic, I discovered a love for indoor plants and turned my home
              into a green and peaceful space. I also love biking, which takes
              me on exciting adventures as I explore hidden trails. And my
              journey into the world of coffee as a barista has deepened my
              appreciation for every cup I make.
            </p>
            <ul className="flex flex-wrap gap-3">
              {likes.map((like) => (
                <li
                  key={like}
                  className="eyebrow border-2 border-ink px-4 py-2 bg-paper-warm"
                >
                  {like}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="01" title="Positions." />
        <p className="max-w-prose mb-12">
          From network architecture at Deutsche Telekom to IoT platforms for
          Porsche and{" "}
          <a
            href="https://impact-festival.earth"
            target="_blank"
            rel="noopener noreferrer"
            className="link-wavy link-wavy-brand"
            style={brandStyle("#d4f000", "#5f6b00")}
          >
            impact-driven web platforms
          </a>{" "}
          at neosfer: these are the places I have worked and what I built there.
        </p>
        <p className="font-serif italic font-medium text-lg mb-4">
          Current positions:
        </p>
        <ul className="mb-12">
          {current.map((p) => <PositionItem key={p.company} position={p} />)}
        </ul>
        <p className="font-serif italic font-medium text-lg mb-4">
          Previous positions:
        </p>
        <ul>
          {previous.map((p) => <PositionItem key={p.company} position={p} />)}
        </ul>
      </section>

      <section className="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="02" title="Certifications." />
        <ul className="flex flex-wrap gap-8">
          {certifications.map((c, i) => {
            const card = (
              <>
                {(c.issuer || c.year) && (
                  <p className="eyebrow text-mustard-deep mb-1">
                    {[c.issuer, c.year].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="display text-xl font-semibold">{c.title}</p>
                {c.href && (
                  <span className="eyebrow link-wavy mt-2 inline-block">
                    Verify ↗
                  </span>
                )}
              </>
            );
            const cardClass =
              `block h-full border-2 border-green bg-paper-warm px-6 py-4 print-shadow-green transition-transform ${
                i % 2 === 0 ? "-rotate-1" : "rotate-1"
              } hover:rotate-0`;
            return (
              <li key={c.title}>
                {c.href
                  ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClass}
                    >
                      {card}
                    </a>
                  )
                  : <div className={cardClass}>{card}</div>}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
