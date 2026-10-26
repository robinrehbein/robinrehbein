import { site } from "@/lib/site.ts";

// The indexable pages; imprint and privacy are noindex and stay out.
const PAGES = [
  { path: "/", priority: "1.0" },
  { path: "/work", priority: "0.8" },
  { path: "/about", priority: "0.8" },
];

export function loader() {
  const urls = PAGES.map((p) => `  <url><loc>${site.url}${p.path === "/" ? "" : p.path}</loc><priority>${p.priority}</priority></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
