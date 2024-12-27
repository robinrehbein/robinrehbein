import { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { cn } from "../lib/utils.ts";

const TimelineFilter = (
  { isStructured }: { isStructured: Signal<boolean> },
) => {
  // const isStructured = useSignal(false);
  return (
    <div class={"flex justify-end my-8"}>
      <ul
        class={cn(
          "flex flex-row gap-1 items-center rounded-full border border-racing-green-800 bg-racing-green-700 p-1 shadow shadow-racing-green-700/50 text-xs",
        )}
      >
        <li>
          <Button
            class={cn(
              "px-4 py-2 border border-transparent rounded-full text-background",
              {
                "text-foreground bg-gradient-to-br from-background via-mustard-yellow-50 to-mustard-yellow-100 border border-mustard-yellow-100 shadow-mustard-yellow-200":
                  isStructured.value,
              },
            )}
            onClick={() => {
              isStructured.value = true;
            }}
          >
            Structured
          </Button>
        </li>
        <li>
          <Button
            class={cn(
              "px-4 py-2 border border-transparent rounded-full text-background",
              {
                "text-foreground bg-gradient-to-br from-background via-mustard-yellow-50 to-mustard-yellow-100 border border-mustard-yellow-100 shadow-mustard-yellow-200":
                  !isStructured.value,
              },
            )}
            onClick={() => {
              isStructured.value = false;
            }}
          >
            Unstructured
          </Button>
        </li>
      </ul>
    </div>
  );
};
export default TimelineFilter;
