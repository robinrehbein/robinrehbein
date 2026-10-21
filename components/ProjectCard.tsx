import type { Project } from "@/lib/site.ts";
import { sizeOf } from "@/lib/imageSizes.ts";
import { TechLine } from "@/components/TechLine.tsx";

export function ProjectCard(props: { project: Project; flip?: boolean }) {
  const { project, flip } = props;
  return (
    <article data-scroll-reveal className="grid md:grid-cols-2 gap-8 md:gap-14 items-start mb-20 md:mb-32 last:mb-0">
      <div className={`relative mb-6 md:mb-0 ${flip ? "md:order-2" : ""}`}>
        {project.images[0] && (
          <img
            src={project.images[0]}
            {...sizeOf(project.images[0])}
            alt={`${project.title} — desktop view`}
            loading="lazy"
            className="photo print-shadow w-[88%] aspect-[4/3] object-cover object-top bg-paper-warm"
          />
        )}
        {project.images[1] && (
          <img
            src={project.images[1]}
            {...sizeOf(project.images[1])}
            alt={`${project.title} — mobile view`}
            loading="lazy"
            className="photo print-shadow-green absolute -bottom-8 right-0 w-[34%] aspect-[9/16] object-cover object-top bg-paper-warm rotate-2"
          />
        )}
      </div>
      <div className={flip ? "md:order-1" : ""}>
        <p className="section-index text-xl mb-2">({project.index})</p>
        <h3 className="display text-[clamp(1.9rem,4.5vw,3.2rem)] font-semibold mb-4">
          {project.title}
        </h3>
        <p className="font-serif italic text-lg text-green mb-5">
          {project.summary}
        </p>
        <p className="project-role mb-4">{project.role}</p>
        <TechLine tech={project.tech} className="mb-4" />
        <p className="mb-8 max-w-prose">{project.excerpt}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <a href={`/work#${project.slug}`} className="eyebrow link-wavy">
            Explore project →
          </a>
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="eyebrow link-wavy">
            Visit site ↗
          </a>
        </div>
      </div>
    </article>
  );
}
