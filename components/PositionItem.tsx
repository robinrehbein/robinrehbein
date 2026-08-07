import type { Position } from "@/lib/site.ts";

export function PositionItem(props: { position: Position }) {
  const p = props.position;
  return (
    <li class="border-t border-line py-6 first:border-t-0 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
      <p class="eyebrow text-mustard-deep mb-2 md:mb-0 pt-1">{p.period}</p>
      <div>
        <p class="font-serif text-lg">
          <strong class="font-semibold">{p.role}</strong> at{" "}
          <a
            href={p.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="link-wavy-green link-wavy font-medium"
          >
            {p.company}
          </a>
        </p>
        <details class="expander mt-2">
          <summary>Details</summary>
          <p class="mt-3 max-w-prose text-[0.95rem]">{p.description}</p>
        </details>
      </div>
    </li>
  );
}
