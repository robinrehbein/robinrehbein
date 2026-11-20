import type { CSSProperties } from "react";
import { formatDay, monthLabel, weekday, type ContributionDay } from "@/lib/contributions.ts";

// GitHub's contribution grid in the site's palette: one column per week (Monday on top), one square per
// day, five shades from empty to racing green. Without days it draws an empty grid of `weeks` weeks.
export function PushCalendar(props: { days: ContributionDay[] | null; weeks: number }) {
  const { days, weeks } = props;
  const lead = days?.length ? weekday(days[0].date) : 0;

  // A month label over the week in which the month starts; a partial first month gives way if the next is too close.
  const months: { col: number; label: string }[] = [];
  days?.forEach((d, i) => {
    const label = monthLabel(d.date);
    if (i > 0 && monthLabel(days[i - 1].date) === label) return;
    const col = Math.floor((lead + i) / 7);
    if (col > weeks - 3) return;
    if (months.length && col - months[months.length - 1].col < 3) months.pop();
    months.push({ col, label });
  });

  return (
    <div className="push-calendar" style={{ "--weeks": weeks } as CSSProperties}>
      <div className="push-months" aria-hidden="true">
        {months.map((m) => <span key={`${m.col}-${m.label}`} style={{ gridColumn: `${m.col + 1} / span 3` }}>{m.label}</span>)}
      </div>
      <div className="push-grid" role="img" aria-label={days ? `GitHub contributions over the last ${weeks} weeks` : "Loading GitHub contributions"}>
        {Array.from({ length: lead }, (_, i) => <span key={`pad-${i}`} className="push-cell push-pad" />)}
        {days
          ? days.map((d) => (
            <span key={d.date} className="push-cell" data-level={d.level} title={`${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${formatDay(d.date)}`} />
          ))
          : Array.from({ length: weeks * 7 }, (_, i) => <span key={i} className="push-cell" data-level={0} />)}
      </div>
    </div>
  );
}
