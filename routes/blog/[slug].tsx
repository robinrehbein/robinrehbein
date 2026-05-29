import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { posts } from "@/lib/content.ts";

export const handler = define.handlers({
  GET(ctx) {
    const post = posts.find((item) => item.slug === ctx.params.slug);
    if (!post) {
      throw new HttpError(404, "Article not found");
    }
    return { data: { post } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { post } = data;

  return (
    <>
      <Head>
        <title>{post.title} - Robin Rehbein</title>
      </Head>
      <article class="shell max-w-3xl py-16">
        <a
          href="/blog"
          class="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          ← Zurück zum Blog
        </a>
        <h1 class="display mt-4 text-4xl font-semibold md:text-6xl">
          {post.title}
        </h1>
        <p class="mt-6 text-sm font-semibold text-[var(--muted)]">
          {post.date} · {post.tag} · {post.readTime}
        </p>
        <div class="mt-10 grid gap-6 text-xl leading-9">
          {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </>
  );
});
