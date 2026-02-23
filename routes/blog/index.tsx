import { PageProps } from "fresh";
import { BlogPost, getPublishedPosts } from "../../lib/blog.ts";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import {
  IconArrowDown,
  IconCircle,
  IconHeartedHands,
  IconPin,
  IconReact,
  IconSeparator,
} from "../../components/Icons.tsx";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const posts = await getPublishedPosts();
    return { data: posts };
  },
});

export default function Blog({ data }: PageProps<BlogPost[]>) {
  return (
    <>
      <Section separator={false}>
        <div class="flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8 md:gap-16">
          <H
            class="inline-flex flex-wrap gap-2 text-md font-medium font-zodiak"
            variant="h1"
          >
            <span>
              <IconHeartedHands class="size-6" />
            </span>
            <p>Robin Rehbein Portfolio</p>

            <span class="hidden md:inline">
              <IconSeparator class="size-6" />
            </span>
            <p class="inline-flex items-center gap-2">
              <span class="relative w-6 h-6 inline-flex items-center justify-center">
                <IconCircle class="size-3 absolute text-red-800" />
                <IconCircle class="size-3 animate-ping text-red-800" />
              </span>
              <span class="line-through">Unavailable</span> for projects
            </p>
          </H>
          <div class="font-zodiak font-medium flex flex-col gap-1">
            <p class="inline-flex items-center gap-2">
              <span>
                <IconReact class="size-6" />
              </span>
              Currently coding at
              <a
                href="https://mimacom.com"
                class="underline decoration-wavy decoration-[#FF0651]"
              >
                mimacom
              </a>
            </p>
            <p class="inline-flex items-center gap-2">
              <span>
                <IconPin class="size-6" />
              </span>
              Based in Stuttgart, Germany
            </p>
          </div>
        </div>
        <H
          class="font-clash-display uppercase font-medium text-[clamp(3rem,8vw,8rem)] leading-none mb-24"
          variant="h2"
        >
          <span>Blog.</span>
        </H>
        <ul class="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap">
          <li class="flex items-center gap-2 grow justify-end my-4 md:my-0">
            <Button>
              <a href="/" class="flex flex-row gap-2 items-center">
                Back
                <IconArrowDown class="rotate-90 size-4" />
              </a>
            </Button>
          </li>
        </ul>
      </Section>
      <Section>
        <div class="flex flex-col gap-16">
          {data.length === 0
            ? <p class="italic opacity-70">No blog posts found.</p>
            : (
              data.map((post) => (
                <div
                  key={post.id}
                  class="group border-b border-foreground pb-8"
                >
                  <a href={`/blog/${post.slug}`} class="flex flex-col gap-4">
                    <div class="flex justify-between items-start">
                      <H
                        variant="h3"
                        class="text-3xl font-clash-display uppercase group-hover:italic transition-all"
                      >
                        {post.title}
                      </H>
                      <span class="font-zodiak opacity-60">
                        {new Date(post.createdAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                    <p class="font-zodiak text-lg line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div class="flex items-center gap-2 font-zodiak font-medium uppercase text-sm">
                      Read more <IconArrowDown class="-rotate-90 size-4" />
                    </div>
                  </a>
                </div>
              ))
            )}
        </div>
      </Section>
    </>
  );
}
