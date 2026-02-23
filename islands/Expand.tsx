import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { cn } from "../lib/utils.ts";
import { IS_BROWSER } from "fresh/runtime";

const Expand = (
  { children, ...props }: JSX.HTMLAttributes<HTMLDetailsElement>,
) => {
  const isOpen = useSignal(false);

  if (!IS_BROWSER) {
    return (
      <details
        class={cn("w-full")}
        {...props}
      >
        <summary class="my-2">
          Expand
        </summary>
        {children}
      </details>
    );
  }

  return (
    <details
      class={cn("w-full cursor-pointer")}
      {...props}
      onClick={() => isOpen.value = !isOpen.value}
    >
      <summary class="my-2">
        {isOpen.value ? "Collapse" : "Expand"}
      </summary>
      {children}
    </details>
  );
};

export default Expand;
