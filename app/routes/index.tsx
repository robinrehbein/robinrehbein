export function meta() { return [{ title: `${site.name} — ${site.role}` }, { name: "description", content: `${site.name}, ${site.role} based in ${site.location}. Turning people's ideas into code since ${site.codingSince}.` }, { tagName: "link", rel: "canonical", href: site.url }]; }
import { brandStyle, likes, positions, projects, sideProjects, site } from "@/lib/site.ts";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { PositionItem } from "@/components/PositionItem.tsx";
import { SectionHead } from "@/components/SectionHead.tsx";
import { sizeOf } from "@/lib/imageSizes.ts";
import { TechLine } from "@/components/TechLine.tsx";

const MARQUEE_ITEMS = [
  "Open to interesting side projects",
  "Stuttgart, Germany",
  `Turning ideas into code since ${site.codingSince}`,
  "Web architecture",
  "Design & development",
  "Claude certified",
];

function MarqueeContent() {
  return (
    <>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="eyebrow inline-flex items-center gap-12">
          {item} <span className="text-mustard" aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const current = positions.filter((p) => p.current);
  return (
    <>
      {/* Hero */}
      <section className="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="reveal reveal-1 flex flex-col md:flex-row justify-between gap-6 mb-16 md:mb-28">
          <p className="font-serif italic text-lg">
            ({site.name} — Portfolio)
          </p>
          <div className="flex flex-col gap-1 font-serif">
            <p>
              Currently coding at{" "}
              <a
                href="https://mimacom.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-wavy link-wavy-brand font-medium"
                style={brandStyle("#ff0651")}
              >
                mimacom
              </a>
            </p>
            <p>Based in {site.location}</p>
          </div>
        </div>

        <h1 className="reveal reveal-2 display font-medium text-[clamp(3.2rem,11vw,10rem)] mb-14 md:mb-20">
          Architect
          <br />
          <span className="text-green">& Develop.</span>
        </h1>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="reveal reveal-3 flex flex-col gap-8 md:self-stretch md:justify-between md:py-2">
            <p className="serif-lede max-w-md">
              Turning people's ideas into{" "}
              <strong className="font-semibold text-mustard-deep">
                &#123;code&#125;
              </strong>{" "}
              since {site.codingSince}.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <a href="/work" className="eyebrow link-wavy">Selected work →</a>
              <a href="/about" className="eyebrow link-wavy">About me →</a>
            </div>
          </div>
          <img
            src="/me_square.webp"
            {...sizeOf("/me_square.webp")}
            alt={`Portrait of ${site.name}`}
            fetchPriority="high"
            className="reveal reveal-4 photo print-shadow w-full md:w-2/5 aspect-square object-cover object-top"
          />
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee reveal reveal-5" aria-hidden="true">
        <div className="marquee-track">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* About */}
      <section className="shell py-16 md:py-28">
        <SectionHead index="01" title="About me." />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="serif-lede mb-6">
              Hi — I'm{" "}
              <strong className="font-semibold">Robin</strong>, a software engineer
              living in Stuttgart. I finished my studies in computer science and
              communications in 2018 and found my passion for web design and
              development along the way. My excitement for learning never stops.
            </p>
            <ul className="flex flex-wrap gap-3 mb-8">
              {likes.map((like) => (
                <li
                  key={like}
                  className="eyebrow border-2 border-ink px-4 py-2 bg-paper-warm"
                >
                  {like}
                </li>
              ))}
            </ul>
            <a href="/about" className="eyebrow link-wavy">
              More about me →
            </a>
          </div>
          <div>
            <p className="font-serif italic font-medium text-lg mb-4">
              Current positions:
            </p>
            <ul>
              {current.map((p) => (
                <PositionItem
                  key={p.company}
                  position={p}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="02" title="Selected work." />
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            flip={i % 2 === 1}
          />
        ))}
        <div className="mt-20 border-t border-line pt-10">
          <p className="font-serif italic font-medium text-lg mb-6">
            From the lab:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {sideProjects.filter((sp) => sp.featured).map((sp) => (
              <a
                key={sp.title}
                href={sp.href ?? `/work#${sp.slug}`}
                {...(sp.href
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group relative border-2 border-ink bg-paper-warm p-6 print-shadow-green transition-transform hover:-translate-y-1"
              >
                <img
                  src={sp.icon}
                  {...sizeOf(sp.icon)}
                  alt=""
                  loading="lazy"
                  className="absolute -top-4 -right-3 w-14 md:w-16 rotate-3 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform group-hover:rotate-0"
                />
                <TechLine tech={sp.tech} className="mb-3 pr-12" />
                <h4 className="display text-2xl font-semibold mb-2">
                  {sp.title}
                </h4>
                <p className="font-serif italic text-green mb-4">{sp.tagline}</p>
                <span className="eyebrow link-wavy">
                  {sp.href ? "GitHub ↗" : "Details →"}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-end gap-x-8 gap-y-3">
          <a href="/work#lab" className="eyebrow link-wavy">
            All {sideProjects.length} lab projects →
          </a>
          <a href="/work" className="eyebrow link-wavy">
            More of my work →
          </a>
        </div>
      </section>

    </>
  );
}
