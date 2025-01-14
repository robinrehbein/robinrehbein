import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { cn } from "../lib/utils.ts";
import { Button } from "../components/atoms/Button.tsx";
import { IconArrowDown } from "../components/Icons.tsx";

const Expand = (
  { children, ...props }: JSX.HTMLAttributes<HTMLDetailsElement>,
) => {
  const isOpen = useSignal(false);

  return (
    <details
      class={cn("w-full md:w-56 md:text-justify")}
      {...props}
    >
      <summary>{isOpen.value ? "Collapse" : "Expand"}</summary>
      {children}
    </details>
  );
};

export default Expand;
