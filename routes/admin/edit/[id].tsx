import { HttpError, PageProps } from "fresh";
import { getCookies } from "@std/http/cookie";
import { BlogPost, getPostById, savePost } from "../../../lib/blog.ts";
import { Button } from "../../../components/atoms/Button.tsx";
import H from "../../../components/atoms/H.tsx";
import Section from "../../../components/atoms/Section.tsx";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("", {
        status: 303,
        headers: { Location: "/admin/login" },
      });
    }
    const { id } = ctx.params;
    const post = await getPostById(id, true); // raw = true
    if (!post) throw new HttpError(404);
    return { data: post };
  },
  async POST(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = ctx.params;
    const existingPost = await getPostById(id);
    if (!existingPost) return new Response("Post not found", { status: 404 });

    const form = await req.formData();
    const title = form.get("title")?.toString() || "";
    const slug = form.get("slug")?.toString() || existingPost.slug;
    const excerpt = form.get("excerpt")?.toString() || "";
    const content = form.get("content")?.toString() || "";
    const isFilePath = form.get("isFilePath") === "on";
    const published = form.get("published") === "on";

    const updatedPost: BlogPost = {
      ...existingPost,
      title,
      slug,
      excerpt,
      content,
      isFilePath,
      published,
      updatedAt: Date.now(),
    };

    await savePost(updatedPost);

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
});

export default function EditPostPage({ data }: PageProps<BlogPost>) {
  return (
    <Section separator={false}>
      <div class="mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase mb-8">
          Edit Post
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
              value={data.title}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="slug" class="uppercase text-sm font-medium">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={data.slug}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
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
              {data.excerpt}
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
              required
            >
              {data.content}
            </textarea>
          </div>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              id="isFilePath"
              name="isFilePath"
              checked={data.isFilePath}
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
              checked={data.published}
              class="size-5 accent-racing-green-800"
            />
            <label for="published" class="uppercase text-sm font-medium">
              Published
            </label>
          </div>
          <div class="flex gap-4">
            <Button type="submit">Save Changes</Button>
            <Button>
              <a href="/admin">Cancel</a>
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
