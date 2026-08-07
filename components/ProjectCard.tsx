import type { Project } from "@/lib/site.ts";

export function ProjectCard(props: { project: Project; flip?: boolean }) {
  const { project, flip } = props;
  return (
    <article class="grid md:grid-cols-2 gap-8 md:gap-14 items-start mb-20 md:mb-32 last:mb-0">
      <div class={`relative ${flip ? "md:order-2" : ""}`}>
        <img
          src={project.images[0]}
          alt={`${project.title} — desktop view`}
          loading="lazy"
          class="photo print-shadow w-[88%] aspect-[4/3] object-cover object-top bg-paper-warm"
        />
        <img
          src={project.images[1]}
          alt={`${project.title} — mobile view`}
          loading="lazy"
          class="photo print-shadow-green absolute -bottom-8 right-0 w-[34%] aspect-[9/16] object-cover object-top bg-paper-warm rotate-2"
        />
      </div>
      <div class={flip ? "md:order-1" : ""}>
        <p class="section-index text-xl mb-2">({project.index})</p>
        <h3 class="display text-[clamp(1.9rem,4.5vw,3.2rem)] font-semibold mb-4">
          {project.title}
        </h3>
        <p class="font-serif italic text-lg text-green mb-5">
          {project.summary}
        </p>
        <p class="mb-8 max-w-prose">{project.description}</p>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          class="eyebrow link-wavy"
        >
          Visit site ↗
        </a>
      </div>
    </article>
  );
}
