import { PageProps } from "fresh";
import { BlogPost, deletePost, getPosts } from "@/lib/blog.ts";
import { deleteProject, getProjects, ProjectData } from "@/lib/site_data.ts";
import H from "@/components/atoms/H.tsx";
import Section from "@/components/atoms/Section.tsx";
import { define } from "@/utils.ts";

interface DashboardData {
  posts: BlogPost[];
  projects: ProjectData[];
}

export const handler = define.handlers({
  async GET(_ctx) {
    const posts = await getPosts();
    const projects = await getProjects();
    return { data: { posts, projects } };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const action = form.get("action")?.toString();
    const id = form.get("id")?.toString();
    const type = form.get("type")?.toString();

    if (action === "delete" && id) {
      if (type === "post") {
        await deletePost(id);
      } else if (type === "project") {
        await deleteProject(id);
      }
    }

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
});

export default function AdminDashboard({ data }: PageProps<DashboardData>) {
  return (
    <Section separator={false}>
      <div class="flex justify-between items-center mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase">
          Admin Dashboard
        </H>
        <div class="flex gap-4">
          <a href="/admin/settings">Site Settings</a>
          <a href="/api/logout">Logout</a>
        </div>
      </div>

      <div class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <H variant="h2" class="text-2xl font-clash-display uppercase">
            Blog Posts
          </H>
          <a href="/admin/new">New Post</a>
        </div>
        <div class="border border-foreground">
          <table class="w-full text-left font-zodiak">
            <thead>
              <tr class="border-b border-foreground uppercase text-sm">
                <th class="p-4">Title</th>
                <th class="p-4">Status</th>
                <th class="p-4">Created At</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((post) => (
                <tr
                  key={post.id}
                  class="border-b border-foreground last:border-0"
                >
                  <td class="p-4 font-medium">{post.title}</td>
                  <td class="p-4 text-sm">
                    {post.published
                      ? <span class="text-racing-green-800">Published</span>
                      : <span class="text-red-800 italic">Draft</span>}
                  </td>
                  <td class="p-4 text-sm">
                    {new Date(post.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-4">
                      <a
                        href={`/admin/edit/${post.id}`}
                        class="underline hover:italic"
                      >
                        Edit
                      </a>
                      <form method="post" class="inline">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="type" value="post" />
                        <button
                          type="submit"
                          class="underline text-red-800 hover:italic"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {data.posts.length === 0 && (
                <tr>
                  <td colspan={4} class="p-8 text-center italic opacity-60">
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-16">
        <div class="flex justify-between items-center mb-8">
          <H variant="h2" class="text-2xl font-clash-display uppercase">
            Projects
          </H>
          <a href="/admin/projects/new">New Project</a>
        </div>
        <div class="border border-foreground">
          <table class="w-full text-left font-zodiak">
            <thead>
              <tr class="border-b border-foreground uppercase text-sm">
                <th class="p-4">Title</th>
                <th class="p-4">Link</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((project) => (
                <tr
                  key={project.id}
                  class="border-b border-foreground last:border-0"
                >
                  <td class="p-4 font-medium">{project.title}</td>
                  <td class="p-4 text-sm">
                    <a href={project.href} target="_blank" class="underline">
                      {project.href}
                    </a>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex justify-end gap-4">
                      <a
                        href={`/admin/projects/edit/${project.id}`}
                        class="underline hover:italic"
                      >
                        Edit
                      </a>
                      <form method="post" class="inline">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="id" value={project.id} />
                        <input type="hidden" name="type" value="project" />
                        <button
                          type="submit"
                          class="underline text-red-800 hover:italic"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {data.projects.length === 0 && (
                <tr>
                  <td colspan={3} class="p-8 text-center italic opacity-60">
                    No projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
