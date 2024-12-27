import { useSignal } from "@preact/signals";
import TimelineFilter from "../islands/TimelineFilter.tsx";
import { TimetableItem } from "../lib/types.ts";
import { cn } from "../lib/utils.ts";
import H from "./H.tsx";

const Timeline = (
  { items }: { items?: Array<TimetableItem> },
) => {
  const isStructured = useSignal(false);
  return (
    <>
      <H variant={"h2"} class={cn("font-semibold")}>Timeline</H>
      <TimelineFilter isStructured={isStructured} />
      <ul class={cn("max-w-screen-md")}>
        {items?.map((item) => (
          <li
            class={cn(
              "mb-4 p-4 bg-gradient-to-br from-background via-mustard-yellow-50 to-mustard-yellow-100 border px-8 py-4 shadow shadow-mustard-yellow-200 border-mustard-yellow-100 rounded-3xl",
            )}
          >
            <H class={"text-left"} variant={"h3"}>{item.job_title}</H>
            <p class={"text-left"}>
              <span class="text-mustard-yellow-950 mr-1 font-semibold text-sm">
                {item.position}
              </span>
              <br />
              {item.description}
            </p>
            {
              /* <p class={"text-left"}>
              <span class="text-mustard-yellow-950 font-bold">
                {new Date(item.started_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })} - {new Date(item.started_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p> */
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default Timeline;
