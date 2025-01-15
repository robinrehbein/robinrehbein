import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { cn } from "../lib/utils.ts";

const Expand = (
  { children, ...props }: JSX.HTMLAttributes<HTMLDetailsElement>,
) => {
  const isOpen = useSignal(false);

  return (
    <details
      class={cn("w-full")}
      {...props}
    >
      <summary class={"my-2"}>
        {isOpen.value ? "Collapse" : "Expand"}
      </summary>
      {children}
    </details>
  );
};

export default Expand;
