import { formatEuro, formatFrom } from "@/lib/price.ts";
import { cn } from "@/components/ui/cn.ts";

export function Price(
  { cents, from = false, class: cls }: {
    cents: number;
    from?: boolean;
    class?: string;
  },
) {
  return (
    <span class={cn("font-semibold tracking-tight", cls)}>
      {from ? formatFrom(cents) : formatEuro(cents)}
    </span>
  );
}
