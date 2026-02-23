import { JSX } from "preact";
import { cn } from "../../lib/utils.ts";

export function Button(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      class={cn(props.class as string | undefined)}
    />
  );
}
