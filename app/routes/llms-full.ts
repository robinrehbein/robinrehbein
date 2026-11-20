import { certifications, positions, projects, sideProjects, site } from "@/lib/site.ts";
import { projectPath } from "@/lib/seo.ts";

// llms-full.txt: everything on the site as one Markdown document, so an AI assistant needs no further fetches.
export function loader() {
  const md = [
    `# ${site.name} — ${site.role}`,
    "",
    `> ${site.role} based in ${site.location}, turning people's ideas into code since ${site.codingSince}. Contact: ${site.email} · GitHub: ${site.github} · Site: ${site.url}`,
    "",
    "## Positions",
    ...positions.flatMap((p) => ["", `### ${p.role} at ${p.company} (${p.period})`, p.description, `Company: ${p.companyUrl}`]),
    "",
    "## Projects",
    ...projects.flatMap((p) => ["", `### ${p.title}`, `Page: ${site.url}${projectPath(p.slug)} · Live: ${p.href}`, `Role: ${p.role}${p.status ? ` (${p.status})` : ""}`, `Tech: ${p.tech}`, "", p.description]),
    "",
    "## Lab apps and side projects",
    ...sideProjects.flatMap((p) => ["", `### ${p.title}`, `Page: ${site.url}${projectPath(p.slug)}${p.href ? ` · Source: ${p.href}` : ""}`, `Tagline: ${p.tagline}`, `Tech: ${p.tech}`, "", p.description]),
    "",
    "## Certifications",
    ...certifications.map((c) => `- ${c.title}${c.issuer ? ` (${c.issuer}${c.year ? `, ${c.year}` : ""})` : ""}`),
    "",
  ].join("\n");
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
