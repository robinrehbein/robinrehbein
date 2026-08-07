import { Head } from "fresh/runtime";
import { likes, positions, site } from "@/lib/site.ts";
import { PositionItem } from "@/components/PositionItem.tsx";
import { SectionHead } from "@/components/SectionHead.tsx";

export default function About() {
  const current = positions.filter((p) => p.current);
  const previous = positions.filter((p) => !p.current);
  return (
    <>
      <Head>
        <title>{`About — ${site.name}`}</title>
      </Head>
      <section class="shell pt-10 md:pt-16 pb-16 md:pb-24">
        <h1 class="reveal reveal-1 display font-medium text-[clamp(3rem,10vw,8rem)] mb-12 md:mb-20">
          About me.
        </h1>

        <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <img
            src="/me.jpg"
            alt={`Portrait of ${site.name}`}
            class="reveal reveal-2 photo print-shadow w-full object-cover object-top"
          />
          <div class="reveal reveal-3 md:sticky md:top-28">
            <p class="serif-lede mb-6">
              Hi — I'm <strong class="font-semibold">Robin</strong>,
            </p>
            <p class="mb-4 max-w-prose">
              currently living in the vibrant locales of Stuttgart, Germany. I
              finished my studies in computer science and communications in
              2018. I love new technology and found my passion for web design
              and development during my studies. Since then, I have taught
              myself many new technologies and programming languages. My
              excitement for learning never stops.
            </p>
            <p class="mb-8 max-w-prose">
              In my free time, I enjoy working on custom mechanical keyboards,
              making unique and personal typing experiences. During the
              pandemic, I discovered a love for indoor plants and turned my home
              into a green and peaceful space. I also love biking, which takes
              me on exciting adventures as I explore hidden trails. And my
              journey into the world of coffee as a barista has deepened my
              appreciation for every cup I make.
            </p>
            <ul class="flex flex-wrap gap-3">
              {likes.map((like) => (
                <li
                  key={like}
                  class="eyebrow border-2 border-ink px-4 py-2 bg-paper-warm"
                >
                  {like}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section class="shell py-16 md:py-28 border-t-2 border-ink">
        <SectionHead index="01" title="Positions." />
        <p class="max-w-prose mb-12">
          In my career, I have had the chance to work in many interesting
          places. Each role has taught me something new and helped me grow.
          Starting with web design and development, I learned how to make
          websites that people find easy to use. In other roles, I picked up new
          skills and worked with different teams to solve problems and create
          projects that{" "}
          <a
            href="https://impact-festival.earth"
            target="_blank"
            rel="noopener noreferrer"
            class="link-wavy-green link-wavy"
          >
            create impact
          </a>.
        </p>
        <p class="font-serif italic font-medium text-lg mb-4">
          Current positions:
        </p>
        <ul class="mb-12">
          {current.map((p) => <PositionItem key={p.company} position={p} />)}
        </ul>
        <p class="font-serif italic font-medium text-lg mb-4">
          Previous positions:
        </p>
        <ul>
          {previous.map((p) => <PositionItem key={p.company} position={p} />)}
        </ul>
      </section>
    </>
  );
}
