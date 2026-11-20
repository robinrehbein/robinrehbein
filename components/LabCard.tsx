import { sizeOf } from "@/lib/imageSizes.ts";
import { type SideProject } from "@/lib/site.ts";
import { Gallery } from "@/components/Gallery.tsx";
import { TechLine } from "@/components/TechLine.tsx";

/** A lab app card; shared by the work page and the app's own page (which makes the title the page's h1). */
export function LabCard({ project: sp, detailHref, asHeading = "h3" }: { project: SideProject; detailHref?: string; asHeading?: "h1" | "h3" }) {
  const Heading = asHeading;
  return (
    <article
      data-scroll-reveal
      id={sp.slug}
      className="lab-card scroll-mt-24 relative border-2 border-ink bg-paper-warm p-8 print-shadow-green"
    >
      <img
        src={sp.icon}
        {...sizeOf(sp.icon)}
        alt={`${sp.title} app icon`}
        loading="lazy"
        className="absolute -top-5 -right-4 w-16 md:w-20 rotate-3 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]"
      />
      <TechLine tech={sp.tech} className="mb-3 pr-14" />
      <Heading className="display text-3xl font-semibold mb-3">{sp.title}</Heading>
      <p className="font-serif italic text-green mb-4">{sp.tagline}</p>
      <p className="mb-6">{sp.description}</p>
      {sp.images && <Gallery images={sp.images} title={sp.title} compact />}
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {sp.href
          ? (
            <a href={sp.href} target="_blank" rel="noopener noreferrer" className="eyebrow link-wavy lab-card-action">
              View on GitHub ↗
            </a>
          )
          : <p className="eyebrow text-green">{sp.note}</p>}
        {detailHref && (
          <a href={detailHref} className="eyebrow link-wavy" aria-label={`${sp.title} project page`}>
            Project page →
          </a>
        )}
      </div>
    </article>
  );
}
