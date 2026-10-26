import { certifications, positions, projects, sideProjects, site } from "@/lib/site.ts";

// llms.txt: a plain Markdown summary of the site for AI assistants, built from the same data as the pages.
export function loader() {
  const md = [
    `# ${site.name}`,
    "",
    `> ${site.role} based in ${site.location}, turning people's ideas into code since ${site.codingSince}. Co-founder of Noah and Senior Software Engineer at Mimacom. Contact: ${site.email}`,
    "",
    "## Pages",
    `- [Home](${site.url}/): introduction, current positions and selected work`,
    `- [Work](${site.url}/work): client and co-founded projects in detail, plus open-source side projects`,
    `- [About](${site.url}/about): bio, career history and certifications`,
    "",
    "## Positions",
    ...positions.map((p) => `- ${p.role} at ${p.company} (${p.period}): ${p.description}`),
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.title}](${site.url}/work#${p.slug}) — ${p.role}. ${p.description} Tech: ${p.tech}. Live: ${p.href}`),
    "",
    "## Side projects",
    ...sideProjects.map((p) => `- [${p.title}](${p.href ?? `${site.url}/work#${p.slug}`}): ${p.tagline}`),
    "",
    "## Certifications",
    ...certifications.map((c) => `- ${c.title}${c.issuer ? ` (${c.issuer}${c.year ? `, ${c.year}` : ""})` : ""}`),
    "",
    "## Links",
    `- GitHub: ${site.github}`,
    `- Email: ${site.email}`,
    "",
  ].join("\n");
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
