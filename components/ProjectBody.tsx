import { brandStyle, type Project } from "@/lib/site.ts";
import { Gallery } from "@/components/Gallery.tsx";
import { TechLine } from "@/components/TechLine.tsx";

/** A project's summary, role, description, links and gallery; shared by the work page and the project's own page. */
export function ProjectBody({ project, detailHref }: { project: Project; detailHref?: string }) {
  const brand = brandStyle(project.brandColor, project.brandText, project.brandDark);
  return (
    <>
      <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-10">
        <p className="font-serif italic text-lg text-green">{project.summary}</p>
        <div>
          <p className="project-role mb-3">{project.role}{project.status && <span className="block mt-1">{project.status}</span>}</p>
          <TechLine tech={project.tech} className="mb-3" />
          <p className="max-w-prose mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="eyebrow link-wavy link-wavy-brand" style={brand}>
              Visit site ↗
            </a>
            {detailHref && (
              <a href={detailHref} className="eyebrow link-wavy" aria-label={`${project.title} project page`}>
                Project page →
              </a>
            )}
          </div>
        </div>
      </div>
      <Gallery images={project.images} title={project.title} />
    </>
  );
}
