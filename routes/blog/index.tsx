import { Head } from "fresh/runtime";
import { posts } from "@/lib/content.ts";

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Blog - Robin Rehbein</title>
      </Head>
      <section class="shell py-16">
        <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          Blog
        </p>
        <h1 class="display mt-4 text-4xl font-semibold md:text-6xl">
          Gedanken aus Code und Werkstatt.
        </h1>
        <div class="mt-12 grid gap-5">
          {posts.map((post) => (
            <a
              href={`/blog/${post.slug}`}
              class="card grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr_auto] md:items-center"
            >
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
                  {post.tag}
                </p>
                <p class="mt-2 text-sm text-[var(--muted)]">
                  {post.date} · {post.readTime}
                </p>
              </div>
              <div>
                <h2 class="text-2xl font-semibold tracking-tight">
                  {post.title}
                </h2>
                <p class="mt-2 text-[var(--muted)]">{post.excerpt}</p>
              </div>
              <span class="button secondary">Lesen</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
