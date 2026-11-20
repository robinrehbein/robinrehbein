// The GitHub contribution calendar as the site serves it at /contributions.json. Safe for the browser:
// only the shape and small helpers live here, the GitHub request itself is in github.server.ts.

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;
export type ContributionDay = { date: string; count: number; level: ContributionLevel };
export type ContributionCalendar = { total: number; days: ContributionDay[]; fetchedAt: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Day of the week for an ISO date, Monday = 0. */
export function weekday(date: string) {
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** "Tue, Mar 4" for an ISO date. */
export function formatDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[weekday(date)]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function monthLabel(date: string) {
  return MONTHS[new Date(`${date}T00:00:00Z`).getUTCMonth()];
}

/** The last `weeks` calendar weeks (Monday to today), so the grid starts on a full week. */
export function lastWeeks(days: ContributionDay[], weeks: number) {
  if (days.length === 0) return days;
  const keep = (weeks - 1) * 7 + weekday(days[days.length - 1].date) + 1;
  return days.slice(-keep);
}

export function contributionTotal(days: ContributionDay[]) {
  return days.reduce((sum, d) => sum + d.count, 0);
}

/** The longest run of consecutive days with at least one contribution. */
export function longestStreak(days: ContributionDay[]) {
  let best = 0, run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}
