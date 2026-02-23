import { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

// ComponentProps<"button"> resolves to HTMLAttributes<HTMLButtonElement> in
// Preact 10.27.x which omits the button-specific `type` attribute. We
// intersect it back in explicitly so callers can write type="submit" etc.
type ButtonProps = JSX.IntrinsicElements["button"] & {
  type?: "button" | "reset" | "submit";
};

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={cn(props.class as string | undefined)}
    />
  );
}
