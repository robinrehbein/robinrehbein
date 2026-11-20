import { getContributionCalendar } from "@/lib/github.server.ts";

// The GitHub contribution calendar for the easter egg at the footer's GitHub link. Lives outside /api,
// which server/index.ts answers with 410 Gone for the retired shop. Not linked anywhere, kept out of
// the sitemap and out of search results.
export async function loader() {
  const calendar = await getContributionCalendar();
  return Response.json(calendar ?? { error: "unavailable" }, {
    status: calendar ? 200 : 503,
    headers: {
      "Cache-Control": calendar ? "public, max-age=3600, stale-while-revalidate=86400" : "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
