// Renders "A · B · C" as small wrapping tags, so a line break never leaves a dangling separator.
export function TechLine(props: { tech: string; className?: string }) {
  return (
    <ul
      className={`tech-tags flex flex-wrap gap-1.5 ${props.className ?? ""}`}
    >
      {props.tech.split(" · ").map((item) => (
        <li
          key={item}
          className="eyebrow text-mustard-deep whitespace-nowrap border border-mustard-deep/40 px-2 py-0.5"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
