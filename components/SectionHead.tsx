export function SectionHead(
  props: { index: string; title: string; id?: string },
) {
  return (
    <div
      id={props.id}
      class="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3 mb-10 md:mb-16 scroll-mt-24"
    >
      <h2 class="display text-[clamp(2.2rem,6vw,4.5rem)] font-medium">
        {props.title}
      </h2>
      <p class="section-index text-xl md:text-2xl">_{props.index}</p>
    </div>
  );
}
