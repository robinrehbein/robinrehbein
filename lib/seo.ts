import { absoluteUrl, certifications, projects, sideProjects, site, snippet, type Project, type SideProject } from "@/lib/site.ts";

// Structured data (schema.org JSON-LD) for search engines and AI assistants, built from the same data as the pages.
const PERSON = { "@id": `${site.url}/#person` };

export const projectPath = (slug: string) => `/work/${slug}`;

export function breadcrumbs(trail: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": trail.map(([name, path], i) => ({ "@type": "ListItem", "position": i + 1, "name": name, "item": absoluteUrl(path) })),
  };
}

export function projectSchema(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(projectPath(p.slug))}#project`,
    "name": p.title,
    "headline": p.summary,
    "description": p.description,
    "url": absoluteUrl(projectPath(p.slug)),
    "sameAs": p.href,
    "keywords": p.tech.split(" · ").join(", "),
    "image": p.images.map(absoluteUrl),
    "creator": PERSON,
    "author": PERSON,
    "inLanguage": "en",
  };
}

export function labSchema(p: SideProject) {
  const base = {
    "@context": "https://schema.org",
    "@id": `${absoluteUrl(projectPath(p.slug))}#project`,
    "name": p.title,
    "headline": p.tagline,
    "description": p.description,
    "url": absoluteUrl(projectPath(p.slug)),
    "keywords": p.tech.split(" · ").join(", "),
    "image": [p.icon, ...(p.images ?? [])].map(absoluteUrl),
    "creator": PERSON,
    "author": PERSON,
    "inLanguage": "en",
  };
  // Public repositories are source code; private projects are plain creative works.
  return p.href
    ? { ...base, "@type": "SoftwareSourceCode", "codeRepository": p.href, "sameAs": p.href, "programmingLanguage": p.tech.split(" · ")[0] }
    : { ...base, "@type": "CreativeWork" };
}

/** The work page: a collection listing every project and lab app with its own page. */
export function workSchema() {
  const items = [...projects.map((p) => [p.title, projectPath(p.slug)]), ...sideProjects.map((p) => [p.title, projectPath(p.slug)])];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Work — ${site.name}`,
    "url": absoluteUrl("/work"),
    "isPartOf": { "@type": "WebSite", "url": site.url },
    "author": PERSON,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map(([name, path], i) => ({ "@type": "ListItem", "position": i + 1, "name": name, "url": absoluteUrl(path) })),
    },
  };
}

export function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `About — ${site.name}`,
    "url": absoluteUrl("/about"),
    "mainEntity": {
      ...PERSON,
      "@type": "Person",
      "name": site.name,
      "hasCredential": certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        "name": c.title,
        ...(c.issuer ? { "recognizedBy": { "@type": "Organization", "name": c.issuer } } : {}),
        ...(c.href ? { "url": c.href } : {}),
      })),
    },
  };
}

export function homeSchema() {
  return { "@context": "https://schema.org", "@type": "ProfilePage", "name": `${site.name} — ${site.role}`, "url": site.url, "mainEntity": PERSON };
}

export { snippet };
