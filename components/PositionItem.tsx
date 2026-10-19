import { brandStyle, type Position } from "@/lib/site.ts";

export function PositionItem(props: { position: Position }) {
  const p = props.position;
  return (
    <li className="border-t border-line py-6 first:border-t-0 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
      <p className="eyebrow text-mustard-deep mb-2 md:mb-0 pt-1">{p.period}</p>
      <div>
        <p className="font-serif text-lg">
          <strong className="font-semibold">{p.role}</strong> at{" "}
          <a
            href={p.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-wavy link-wavy-brand font-medium"
            style={brandStyle(p.brandColor, p.brandText)}
          >
            {p.company}
          </a>
        </p>
        <details className="expander mt-2" open={p.current}>
          <summary>Details</summary>
          <p className="mt-3 max-w-prose text-[0.95rem]">{p.description}</p>
        </details>
      </div>
    </li>
  );
}
