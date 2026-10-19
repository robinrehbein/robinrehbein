export function meta() { return [{ title: `Work — ${site.name}` }, { name: "description", content: `A selection of projects ${site.name} has designed, built, or co-founded, plus open-source side projects.` }, { tagName: "link", rel: "canonical", href: `${site.url}/work` }]; }
import { projects, sideProjects, site } from "@/lib/site.ts";
import { SectionHead } from "@/components/SectionHead.tsx";
import { sizeOf } from "@/lib/imageSizes.ts";
import { TechLine } from "@/components/TechLine.tsx";

export default function Work() {
  const labIndex = String(projects.length + 1).padStart(2, "0");
  return (
    <>
      <section className="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <h1 className="reveal reveal-1 display font-medium text-[clamp(3rem,10vw,8rem)] mb-6">
          Work.
        </h1>
        <p className="reveal reveal-2 serif-lede max-w-xl">
          A selection of projects I have designed, built, or co-founded — from
          custom poster shops to digital presences for the construction
          industry.
        </p>
      </section>

      {projects.map((project) => (
        <section
          key={project.title}
          className="shell py-16 md:py-24 border-t-2 border-ink"
        >
          <SectionHead index={project.index} title={project.title} />
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-10">
            <p className="font-serif italic text-lg text-green">
              {project.summary}
            </p>
            <div>
              <TechLine tech={project.tech} className="mb-3" />
              <p className="max-w-prose mb-6">{project.description}</p>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-wavy"
              >
                Visit site ↗
              </a>
            </div>
          </div>
          <div className="strip">
            {project.images.map((image, i) => (
              <img
                key={image}
                src={image}
                {...sizeOf(image)}
                alt={`${project.title} — impression ${i + 1}`}
                loading="lazy"
                className="photo print-shadow h-64 md:h-96 w-auto object-cover bg-paper-warm"
              />
            ))}
          </div>
        </section>
      ))}

      <section className="shell py-16 md:py-24 border-t-2 border-ink">
        <SectionHead index={labIndex} title="From the lab." id="lab" />
        <p className="max-w-prose mb-12">
          Smaller things I build for myself — mostly open experiments living on
          GitHub.
        </p>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {sideProjects.map((sp) => (
            <article
              key={sp.title}
              id={sp.slug}
              className="scroll-mt-24 relative border-2 border-ink bg-paper-warm p-8 print-shadow-green"
            >
              <img
                src={sp.icon}
                {...sizeOf(sp.icon)}
                alt={`${sp.title} app icon`}
                loading="lazy"
                className="absolute -top-5 -right-4 w-16 md:w-20 rotate-3 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]"
              />
              <TechLine tech={sp.tech} className="mb-3 pr-14" />
              <h3 className="display text-3xl font-semibold mb-3">{sp.title}</h3>
              <p className="font-serif italic text-green mb-4">{sp.tagline}</p>
              <p className="mb-6">{sp.description}</p>
              {sp.images && (
                <div className="strip mb-6">
                  {sp.images.map((image, i) => (
                    <img
                      key={image}
                      src={image}
                      {...sizeOf(image)}
                      alt={`${sp.title} — screenshot ${i + 1}`}
                      loading="lazy"
                      className="photo print-shadow h-72 md:h-80 w-auto"
                    />
                  ))}
                </div>
              )}
              {sp.href
                ? (
                  <a
                    href={sp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow link-wavy"
                  >
                    View on GitHub ↗
                  </a>
                )
                : <p className="eyebrow text-green">{sp.note}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
