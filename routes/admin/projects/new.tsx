import { getCookies } from "@std/http/cookie";
import { ProjectData, saveProject } from "../../../lib/site_data.ts";
import { Button } from "../../../components/atoms/Button.tsx";
import H from "../../../components/atoms/H.tsx";
import Section from "../../../components/atoms/Section.tsx";
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
    return { data: null };
  },
  async POST(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await req.formData();
    const project: ProjectData = {
      id: crypto.randomUUID(),
      title: form.get("title")?.toString() || "",
      description: form.get("description")?.toString() || "",
      href: form.get("href")?.toString() || "",
      images: form.get("images")?.toString().split("\n").filter(Boolean) || [],
      order: parseInt(form.get("order")?.toString() || "0"),
    };

    await saveProject(project);

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
});

export default function NewProjectPage() {
  return (
    <Section separator={false}>
      <div class="mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase mb-8">
          Create New Project
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
            <label for="description" class="uppercase text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            >
            </textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label for="href" class="uppercase text-sm font-medium">
              Link (URL)
            </label>
            <input
              type="url"
              id="href"
              name="href"
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="images" class="uppercase text-sm font-medium">
              Images (one URL per line)
            </label>
            <textarea
              id="images"
              name="images"
              rows={5}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic font-mono text-sm"
              placeholder="/images/project1.jpg"
            >
            </textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label for="order" class="uppercase text-sm font-medium">
              Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value="0"
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
          </div>
          <div class="flex gap-4">
            <Button type="submit">Create Project</Button>
            <Button>
              <a href="/admin">Cancel</a>
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
