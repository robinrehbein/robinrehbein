import { likes, positions, projects, sideProjects, site } from "@/lib/site.ts";
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { PositionItem } from "@/components/PositionItem.tsx";
import { SectionHead } from "@/components/SectionHead.tsx";

const MARQUEE_ITEMS = [
  "Available for projects",
  "Stuttgart, Germany",
  `Turning ideas into code since ${site.codingSince}`,
  "Web architecture",
  "Design & development",
  "Claude Code certified",
];

function MarqueeContent() {
  return (
    <>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} class="eyebrow inline-flex items-center gap-12">
          {item} <span class="text-mustard" aria-hidden="true">✦</span>
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
      <section class="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <div class="reveal reveal-1 flex flex-col md:flex-row justify-between gap-6 mb-16 md:mb-28">
          <p class="font-serif italic text-lg">
            ({site.name} — Portfolio)
          </p>
          <div class="flex flex-col gap-1 font-serif">
            <p>
              Currently coding at{" "}
              <a
                href="https://mimacom.com"
                target="_blank"
                rel="noopener noreferrer"
                class="link-wavy font-medium"
              >
                mimacom
              </a>
            </p>
            <p>Based in {site.location}</p>
          </div>
        </div>

        <h1 class="reveal reveal-2 display font-medium text-[clamp(3.2rem,11vw,10rem)] mb-14 md:mb-20">
          Architect
          <br />
          <span class="text-green">& Develop.</span>
        </h1>

        <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <p class="reveal reveal-3 serif-lede max-w-md">
            Turning people's ideas into{" "}
            <strong class="font-semibold text-mustard-deep">
              &#123;code&#125;
            </strong>{" "}
            since {site.codingSince}.
          </p>
          <img
            src="/me_square.jpg"
            alt={`Portrait of ${site.name}`}
            class="reveal reveal-4 photo print-shadow w-full md:w-2/5 aspect-square object-cover object-top"
          />
        </div>
      </section>

      {/* Marquee */}
      <div class="marquee reveal reveal-5" aria-hidden="true">
        <div class="marquee-track">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* About */}
      <section class="shell py-16 md:py-28">
        <SectionHead index="01" title="About me." />
        <div class="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p class="serif-lede mb-6">
              Hi — I'm{" "}
              <strong class="font-semibold">Robin</strong>, a software engineer
              living in Stuttgart. I finished my studies in computer science and
              communications in 2018 and found my passion for web design and
              development along the way. My excitement for learning never stops.
            </p>
            <ul class="flex flex-wrap gap-3 mb-8">
              {likes.map((like) => (
                <li
                  key={like}
                  class="eyebrow border-2 border-ink px-4 py-2 bg-paper-warm"
                >
                  {like}
                </li>
              ))}
            </ul>
            <a href="/about" class="eyebrow link-wavy">
              More about me →
            </a>
          </div>
          <div>
            <p class="font-serif italic font-medium text-lg mb-4">
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
      <section class="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="02" title="Selected work." />
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            flip={i % 2 === 1}
          />
        ))}
        <div class="mt-20 border-t border-line pt-10">
          <p class="font-serif italic font-medium text-lg mb-6">
            From the lab:
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            {sideProjects.map((sp) => (
              <a
                key={sp.title}
                href={sp.href}
                target="_blank"
                rel="noopener noreferrer"
                class="group border-2 border-ink bg-paper-warm p-6 print-shadow-green transition-transform hover:-translate-y-1"
              >
                <p class="eyebrow text-mustard-deep mb-3">{sp.tech}</p>
                <h4 class="display text-2xl font-semibold mb-2">
                  {sp.title}
                </h4>
                <p class="font-serif italic text-green mb-4">{sp.tagline}</p>
                <span class="eyebrow link-wavy">GitHub ↗</span>
              </a>
            ))}
          </div>
        </div>
        <div class="mt-16 text-right">
          <a href="/work" class="eyebrow link-wavy">
            More of my work →
          </a>
        </div>
      </section>

      {/* Contact */}
      <section class="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="03" title="Contact." id="contact" />
        <div class="grid md:grid-cols-2 gap-10 md:gap-16">
          <p class="font-serif italic font-medium text-lg">Get in touch!</p>
          <div>
            <p class="mb-8 max-w-prose">
              I'd love to hear from you! Whether you have a question, a project
              proposal, or just want to say hello — feel free to reach out. I
              look forward to connecting with you.
            </p>
            <ul class="flex flex-col gap-3 font-serif italic text-lg">
              <li>
                <a href={`mailto:${site.email}`} class="link-wavy">
                  ✉ {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-wavy"
                >
                  ⌥ github.com/robinrehbein
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
