/** @jsxImportSource preact */
/** @jsxRuntime automatic */
// deno-lint-ignore-file react-no-danger
import { PageProps } from "fresh";
import { BlogPost, getPostBySlug } from "../../lib/blog.ts";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import { IconArrowDown } from "../../components/Icons.tsx";
import { CSS, render } from "gfm";
import { define } from "@/utils.ts";
import { HttpError } from "fresh";

export const handler = define.handlers({
  async GET(ctx) {
    const { slug } = ctx.params;
    const post = await getPostBySlug(slug);
    if (!post) {
      throw new HttpError(404);
    }
    return { data: post };
  },
});

export default function BlogPostPage({ data }: PageProps<BlogPost>) {
  const html = render(data.content);

  return (
    <>
      <head>
        <title>{`${data.title} | Robin Rehbein`}</title>
        <style>{CSS}</style>
        <style>
          {`
          .markdown-body {
            background-color: transparent !important;
            color: currentColor !important;
            font-family: inherit !important;
          }
          .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
            font-family: 'Clash Display', sans-serif !important;
            text-transform: uppercase;
            border-bottom: 1px solid currentColor;
            padding-bottom: 0.5rem;
            margin-top: 2rem;
          }
        `}
        </style>
      </head>
      <Section separator={false}>
        <div class="mb-16">
          <Button>
            <a href="/blog" class="flex flex-row gap-2 items-center">
              <IconArrowDown class="rotate-90 size-4" />
              Back to Blog
            </a>
          </Button>
        </div>

        <div class="flex flex-col gap-8 mb-16">
          <span class="font-zodiak opacity-60 text-lg">
            {new Date(data.createdAt).toLocaleDateString("de-DE")}
          </span>
          <H
            class="font-clash-display uppercase font-medium text-[clamp(2.5rem,6vw,5rem)] leading-none"
            variant="h1"
          >
            {data.title}
          </H>
        </div>
      </Section>

      <Section>
        <div
          class="markdown-body font-zodiak text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Section>

      <Section>
        <div class="mt-16 pt-8 border-t border-foreground">
          <Button>
            <a href="/blog" class="flex flex-row gap-2 items-center">
              <IconArrowDown class="rotate-90 size-4" />
              Back to Blog
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
