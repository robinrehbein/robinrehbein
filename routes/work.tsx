import { Head } from "fresh/runtime";
import { projects, sideProjects, site } from "@/lib/site.ts";
import { SectionHead } from "@/components/SectionHead.tsx";

export default function Work() {
  return (
    <>
      <Head>
        <title>{`Work — ${site.name}`}</title>
      </Head>
      <section class="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <h1 class="reveal reveal-1 display font-medium text-[clamp(3rem,10vw,8rem)] mb-6">
          Work.
        </h1>
        <p class="reveal reveal-2 serif-lede max-w-xl">
          A selection of projects I have designed, built, or co-founded — from
          custom poster shops to digital presences for the construction
          industry.
        </p>
      </section>

      {projects.map((project) => (
        <section
          key={project.title}
          class="shell py-16 md:py-24 border-t-2 border-ink"
        >
          <SectionHead index={project.index} title={project.title} />
          <div class="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-10">
            <p class="font-serif italic text-lg text-green">
              {project.summary}
            </p>
            <div>
              <p class="max-w-prose mb-6">{project.description}</p>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                class="eyebrow link-wavy"
              >
                Visit site ↗
              </a>
            </div>
          </div>
          <div class="strip">
            {project.images.map((image, i) => (
              <img
                key={image}
                src={image}
                alt={`${project.title} — impression ${i + 1}`}
                loading="lazy"
                class="photo print-shadow h-64 md:h-96 w-auto object-cover bg-paper-warm"
              />
            ))}
          </div>
        </section>
      ))}

      <section class="shell py-16 md:py-24 border-t-2 border-ink">
        <SectionHead index="03" title="From the lab." />
        <p class="max-w-prose mb-12">
          Smaller things I build for myself — open experiments living on GitHub.
        </p>
        <div class="grid md:grid-cols-2 gap-8 md:gap-12">
          {sideProjects.map((sp) => (
            <article
              key={sp.title}
              class="relative border-2 border-ink bg-paper-warm p-8 print-shadow-green"
            >
              <img
                src={sp.icon}
                alt={`${sp.title} app icon`}
                loading="lazy"
                class="absolute -top-5 -right-4 w-16 md:w-20 rotate-3 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]"
              />
              <p class="eyebrow text-mustard-deep mb-3 pr-14">{sp.tech}</p>
              <h3 class="display text-3xl font-semibold mb-3">{sp.title}</h3>
              <p class="font-serif italic text-green mb-4">{sp.tagline}</p>
              <p class="mb-6">{sp.description}</p>
              {sp.images && (
                <div class="strip mb-6">
                  {sp.images.map((image, i) => (
                    <img
                      key={image}
                      src={image}
                      alt={`${sp.title} — screenshot ${i + 1}`}
                      loading="lazy"
                      class="photo print-shadow h-72 md:h-80 w-auto"
                    />
                  ))}
                </div>
              )}
              <a
                href={sp.href}
                target="_blank"
                rel="noopener noreferrer"
                class="eyebrow link-wavy"
              >
                View on GitHub ↗
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
