import { absoluteUrl, projects, sideProjects, site } from "@/lib/site.ts";
import { projectPath } from "@/lib/seo.ts";

// The indexable pages: home, work, about and one page per project and lab app. Imprint and privacy are noindex and stay out.
// Project pages list their images too, so image search can find the screenshots.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
type Entry = { path: string; priority: string; images?: { src: string; title: string }[] };
const PAGES: Entry[] = [
  { path: "/", priority: "1.0", images: [{ src: "/me_square.webp", title: `Portrait of ${site.name}` }] },
  { path: "/work", priority: "0.9" },
  { path: "/about", priority: "0.8", images: [{ src: "/me.webp", title: `Portrait of ${site.name}` }] },
  ...projects.map((p) => ({ path: projectPath(p.slug), priority: "0.8", images: p.images.map((src) => ({ src, title: `${p.title} screenshot` })) })),
  ...sideProjects.map((p) => ({ path: projectPath(p.slug), priority: "0.7", images: [p.icon, ...(p.images ?? [])].map((src) => ({ src, title: `${p.title} screenshot` })) })),
];

export function loader() {
  const urls = PAGES.map((p) => {
    const images = (p.images ?? []).map((i) => `<image:image><image:loc>${esc(absoluteUrl(i.src))}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`).join("");
    return `  <url><loc>${esc(absoluteUrl(p.path))}</loc><priority>${p.priority}</priority>${images}</url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
