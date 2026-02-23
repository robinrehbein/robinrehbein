import { HttpError, PageProps } from "fresh";
import { getCookies } from "@std/http/cookie";
import {
  getProjectById,
  ProjectData,
  saveProject,
} from "../../../../lib/site_data.ts";
import { Button } from "../../../../components/atoms/Button.tsx";
import H from "../../../../components/atoms/H.tsx";
import Section from "../../../../components/atoms/Section.tsx";
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
    const project = await getProjectById(id);
    if (!project) throw new HttpError(404);
    return { data: project };
  },
  async POST(ctx) {
    const req = ctx.req;
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = ctx.params;
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return new Response("Project not found", { status: 404 });
    }

    const form = await req.formData();
    const updatedProject: ProjectData = {
      id,
      title: form.get("title")?.toString() || "",
      description: form.get("description")?.toString() || "",
      href: form.get("href")?.toString() || "",
      images: form.get("images")?.toString().split("\n").filter(Boolean) || [],
      order: parseInt(form.get("order")?.toString() || "0"),
    };

    await saveProject(updatedProject);

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
});

export default function EditProjectPage({ data }: PageProps<ProjectData>) {
  return (
    <Section separator={false}>
      <div class="mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase mb-8">
          Edit Project
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
              {data.description}
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
              value={data.href}
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
            >
              {data.images.join("\n")}
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
              value={data.order}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
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
