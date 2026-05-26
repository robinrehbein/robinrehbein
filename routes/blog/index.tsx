import { Head } from "fresh/runtime";
import { posts } from "@/lib/content.ts";

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Blog - Robin Rehbein</title>
      </Head>
      <section class="shell py-16">
        <p class="eyebrow text-[var(--clay)]">Blog</p>
        <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
          Gedanken aus Code und Werkstatt.
        </h1>
        <div class="mt-12 grid gap-5">
          {posts.map((post) => (
            <a
              href={`/blog/${post.slug}`}
              class="card grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr_auto] md:items-center"
            >
              <div>
                <p class="eyebrow text-[var(--clay)]">{post.tag}</p>
                <p class="mt-2 opacity-70">{post.date} · {post.readTime}</p>
              </div>
              <div>
                <h2 class="display text-4xl font-semibold">{post.title}</h2>
                <p class="mt-3 opacity-75">{post.excerpt}</p>
              </div>
              <span class="button secondary">Lesen</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
