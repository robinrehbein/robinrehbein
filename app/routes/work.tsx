export function meta() {
  return pageMeta(
    "/work",
    `Work — ${site.name}: Projects, Apps & Open Source`,
    `Projects ${site.name} has designed, built or co-founded — Noah, artwerk studios, Kirchmaier & Staudacher and more — plus lab apps and open-source side projects like Trailscape, PocketPi and Birdy.`,
    [workSchema(), breadcrumbs([["Home", "/"], ["Work", "/work"]])],
  );
}
import { brandStyle, pageMeta, projects, sideProjects, site } from "@/lib/site.ts";
import { SectionHead } from "@/components/SectionHead.tsx";
import { ProjectBody } from "@/components/ProjectBody.tsx";
import { LabCard } from "@/components/LabCard.tsx";
import { breadcrumbs, projectPath, workSchema } from "@/lib/seo.ts";

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
          {projects.map(p => <a key={p.slug} href={`#${p.slug}`} className="eyebrow link-wavy link-wavy-brand" style={brandStyle(p.brandColor, p.brandText, p.brandDark)}>{p.title}</a>)}
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
          <ProjectBody project={project} detailHref={projectPath(project.slug)} />
        </section>
      ))}

      <section className="shell py-16 md:py-24 border-t-2 border-ink">
        <SectionHead index={labIndex} title="From the lab." id="lab" />
        <p className="max-w-prose mb-12">
          Smaller things I build for myself — mostly open experiments living on
          GitHub.
        </p>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {sideProjects.map((sp) => <LabCard key={sp.title} project={sp} detailHref={projectPath(sp.slug)} />)}
        </div>
      </section>
    </>
  );
}
