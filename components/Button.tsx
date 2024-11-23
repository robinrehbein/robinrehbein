import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { cn } from "../lib/utils.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={cn(props.class)}
    />
  );
}
