import { type ComponentChildren, type JSX } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn.ts";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--ink)] text-white hover:bg-black",
        secondary:
          "border border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--surface-muted)]",
        ghost:
          "bg-transparent text-[var(--ink)] hover:bg-[var(--surface-muted)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps =
  & VariantProps<typeof button>
  & {
    children: ComponentChildren;
    class?: string;
  }
  & (
    | ({ as?: "button" } & JSX.IntrinsicElements["button"])
    | ({ as: "a" } & JSX.IntrinsicElements["a"])
  );

export function Button(props: ButtonProps) {
  const { variant, size, class: cls, children, as, ...rest } = props;
  const classes = cn(button({ variant, size }), cls);
  if (as === "a") {
    return (
      <a class={classes} {...rest as JSX.IntrinsicElements["a"]}>{children}</a>
    );
  }
  return (
    <button class={classes} {...rest as JSX.IntrinsicElements["button"]}>
      {children}
    </button>
  );
}
