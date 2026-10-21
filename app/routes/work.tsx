export function meta() { return [{ title: `Work — ${site.name}` }, { name: "description", content: `A selection of projects ${site.name} has designed, built, or co-founded, plus open-source side projects.` }, { tagName: "link", rel: "canonical", href: `${site.url}/work` }]; }
import { projects, sideProjects, site } from "@/lib/site.ts";
import { SectionHead } from "@/components/SectionHead.tsx";
import { sizeOf } from "@/lib/imageSizes.ts";
import { Gallery } from "@/components/Gallery.tsx";
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
        <nav aria-label="Project index" className="project-index mt-10">
          {projects.map(p => <a key={p.slug} href={`#${p.slug}`} className="eyebrow link-wavy">{p.title}</a>)}
          <a href="#lab" className="eyebrow link-wavy">From the lab</a>
        </nav>
      </section>

      {projects.map((project) => (
        <section
          data-scroll-reveal
          key={project.title}
          id={project.slug}
          className="shell scroll-mt-20 py-16 md:py-24 border-t-2 border-ink"
        >
          <SectionHead index={project.index} title={project.title} />
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-10">
            <p className="font-serif italic text-lg text-green">
              {project.summary}
            </p>
            <div>
              <p className="project-role mb-3">{project.role}{project.status && <span className="block mt-1">{project.status}</span>}</p>
              <TechLine tech={project.tech} className="mb-3" />
              <p className="max-w-prose mb-6">{project.description}</p>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-wavy"
              >
                Visit site <span className="link-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <Gallery images={project.images} title={project.title} />
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
              data-scroll-reveal
              key={sp.title}
              id={sp.slug}
              className="lab-card scroll-mt-24 relative border-2 border-ink bg-paper-warm p-8 print-shadow-green"
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
              {sp.images && <Gallery images={sp.images} title={sp.title} compact />}
              {sp.href
                ? (
                  <a
                    href={sp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow link-wavy lab-card-action"
                  >
                    View on GitHub <span className="link-arrow" aria-hidden="true">↗</span>
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
