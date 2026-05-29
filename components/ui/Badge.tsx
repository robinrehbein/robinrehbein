import { type ComponentChildren } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn.ts";

const badge = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        category: "border border-[var(--line)] bg-white/90 text-[var(--ink)]",
        accent: "bg-[var(--accent)] text-white",
        muted: "bg-[var(--surface-muted)] text-[var(--muted)]",
        stock:
          "bg-[var(--surface-muted)] text-[var(--muted)] normal-case tracking-normal",
      },
    },
    defaultVariants: { variant: "category" },
  },
);

export function Badge(
  { variant, class: cls, children }: VariantProps<typeof badge> & {
    class?: string;
    children: ComponentChildren;
  },
) {
  return <span class={cn(badge({ variant }), cls)}>{children}</span>;
}
