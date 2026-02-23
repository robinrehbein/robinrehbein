import { getCookies } from "@std/http/cookie";
import { BlogPost, savePost } from "../../lib/blog.ts";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("", {
        status: 303,
        headers: { Location: "/admin/login" },
      });
    }
  },
  async POST(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await req.formData();
    const title = form.get("title")?.toString() || "";
    const slug = form.get("slug")?.toString() ||
      title.toLowerCase().replace(/\s+/g, "-");
    const excerpt = form.get("excerpt")?.toString() || "";
    const content = form.get("content")?.toString() || "";
    const isFilePath = form.get("isFilePath") === "on";
    const published = form.get("published") === "on";

    const post: BlogPost = {
      id: crypto.randomUUID(),
      title,
      slug,
      excerpt,
      content,
      isFilePath,
      published,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await savePost(post);

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
});

export default function NewPostPage() {
  return (
    <Section separator={false}>
      <div class="mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase mb-8">
          Create New Post
        </H>
        <form method="post" class="flex flex-col gap-8 max-w-4xl font-zodiak">
          <div class="flex flex-col gap-2">
            <label for="title" class="uppercase text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="slug" class="uppercase text-sm font-medium">
              Slug (optional)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              placeholder="my-post-slug"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="excerpt" class="uppercase text-sm font-medium">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            >
            </textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label for="content" class="uppercase text-sm font-medium">
              Content (Markdown oder Dateipfad)
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic font-mono text-sm"
              placeholder="Inhalt hier eingeben oder Pfad wie 'posts/mein-post.md'..."
              required
            >
            </textarea>
          </div>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              id="isFilePath"
              name="isFilePath"
              class="size-5 accent-racing-green-800"
            />
            <label for="isFilePath" class="uppercase text-sm font-medium">
              Inhalt ist ein Dateipfad
            </label>
          </div>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              id="published"
              name="published"
              class="size-5 accent-racing-green-800"
            />
            <label for="published" class="uppercase text-sm font-medium">
              Publish immediately
            </label>
          </div>
          <div class="flex gap-4">
            <Button type="submit">Create Post</Button>
            <Button>
              <a href="/admin">Cancel</a>
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
