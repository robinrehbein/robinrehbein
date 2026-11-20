import { absoluteUrl, pageMeta, projects, sideProjects, site, snippet } from "@/lib/site.ts";
import { breadcrumbs, labSchema, projectPath, projectSchema } from "@/lib/seo.ts";
import { ProjectBody } from "@/components/ProjectBody.tsx";
import { LabCard } from "@/components/LabCard.tsx";
import NotFound from "./_404.tsx";

// One indexable page per project and lab app, so each can be found, cited and linked on its own.
function find(slug: string | undefined) {
  const project = projects.find((p) => p.slug === slug);
  if (project) return { project };
  const lab = sideProjects.find((p) => p.slug === slug);
  return lab ? { lab } : undefined;
}

export function loader({ params }: { params: { slug?: string } }) {
  if (!find(params.slug)) throw new Response("Not found", { status: 404 });
  return { slug: params.slug! };
}

export function meta({ loaderData }: { loaderData?: { slug: string } }) {
  const found = find(loaderData?.slug);
  if (!found) return [{ title: `404 — ${site.name}` }, { name: "robots", content: "noindex" }];
  if (found.project) {
    const p = found.project;
    return pageMeta(projectPath(p.slug), `${p.title} — ${p.role} | ${site.name}`, snippet(`${p.excerpt} ${p.tech.split(" · ").join(", ")}.`), [
      projectSchema(p),
      breadcrumbs([["Home", "/"], ["Work", "/work"], [p.title, projectPath(p.slug)]]),
    ]);
  }
  const l = found.lab!;
  return pageMeta(projectPath(l.slug), `${l.title} — ${l.tagline} | ${site.name}`, snippet(`${l.tagline} ${l.description}`), [
    labSchema(l),
    breadcrumbs([["Home", "/"], ["Work", "/work"], ["From the lab", "/work#lab"], [l.title, projectPath(l.slug)]]),
  ]);
}

export default function WorkDetail({ loaderData }: { loaderData: { slug: string } }) {
  const found = find(loaderData.slug)!;
  const others = [...projects, ...sideProjects].filter((p) => p.slug !== loaderData.slug);
  return (
    <>
      <section className="shell pt-10 md:pt-16 pb-10 md:pb-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <a href="/work" className="eyebrow link-wavy">← All work</a>
        </nav>
        {found.project
          ? (
            <>
              <h1 className="reveal reveal-1 display font-medium text-[clamp(3rem,10vw,8rem)] mb-10">{found.project.title}</h1>
              <ProjectBody project={found.project} />
            </>
          )
          : (
            <div className="max-w-3xl">
              <LabCard project={found.lab!} asHeading="h1" />
            </div>
          )}
      </section>
      <section className="shell py-16 md:py-24 border-t-2 border-ink">
        <h2 className="display text-[clamp(1.8rem,4vw,3rem)] font-medium mb-8">More work.</h2>
        <ul className="project-index" aria-label="More projects">
          {others.map((p) => (
            <li key={p.slug}><a href={projectPath(p.slug)} className="eyebrow link-wavy">{p.title}</a></li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function ErrorBoundary() {
  return <NotFound />;
}
