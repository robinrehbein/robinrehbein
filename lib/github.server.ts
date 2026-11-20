import { site } from "@/lib/site.ts";
import type { ContributionCalendar, ContributionLevel } from "@/lib/contributions.ts";

// Server only (the .server suffix makes the build fail if a browser bundle imports it): reads
// GITHUB_TOKEN and asks GitHub's GraphQL API for the contribution calendar behind the green grid on
// the profile. The answer is kept in memory for six hours; when GitHub is slow or down, the last good
// answer is served instead. A token without any repository permissions is enough.

const QUERY = `query($login: String!) {
  user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions
    weeks { contributionDays { date contributionCount contributionLevel } }
  } } }
}`;

const LEVEL: Record<string, ContributionLevel> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const TTL = 6 * 60 * 60 * 1000;
const LOGIN = new URL(site.github).pathname.replace(/\//g, "");

type GraphQLDay = { date: string; contributionCount: number; contributionLevel: string };
type GraphQLResponse = {
  data?: { user?: { contributionsCollection: { contributionCalendar: { totalContributions: number; weeks: { contributionDays: GraphQLDay[] }[] } } } };
};

let cache: { at: number; data: ContributionCalendar } | undefined;
let pending: Promise<ContributionCalendar | null> | undefined;

async function fetchCalendar(token: string): Promise<ContributionCalendar> {
  const response = await fetch(process.env.GITHUB_GRAPHQL_URL ?? "https://api.github.com/graphql", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "robinrehbein.de" },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
  const calendar = ((await response.json()) as GraphQLResponse).data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) throw new Error("GitHub sent no contribution calendar");
  return {
    total: calendar.totalContributions,
    days: calendar.weeks.flatMap((w) => w.contributionDays).map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL[d.contributionLevel] ?? 0,
    })),
    fetchedAt: new Date().toISOString(),
  };
}

/** The contribution calendar for the past year, or null when there is no token and nothing cached. */
export async function getContributionCalendar(): Promise<ContributionCalendar | null> {
  if (cache && Date.now() - cache.at < TTL) return cache.data;
  const token = process.env.GITHUB_TOKEN;
  if (!token) return cache?.data ?? null;
  // Concurrent requests share one call to GitHub.
  pending ??= fetchCalendar(token)
    .then((data) => { cache = { at: Date.now(), data }; return data; })
    .catch((error) => { console.error("Contribution calendar:", error instanceof Error ? error.message : error); return cache?.data ?? null; })
    .finally(() => { pending = undefined; });
  return pending;
}
