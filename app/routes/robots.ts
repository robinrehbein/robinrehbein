import { site } from "@/lib/site.ts";

// Every crawler is welcome, AI search and assistant bots included, so the site can be cited.
// The dev deployment asks all of them to stay away.
export function loader({ request }: { request: Request }) {
  const dev = new URL(request.url).hostname.startsWith("dev.");
  const body = dev
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
