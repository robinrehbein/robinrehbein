import { join } from "$std/path/mod.ts";
import { extractYaml } from "@std/front-matter";
import { Project } from "./types.ts";

const getProject = async (slug: string): Promise<Project | null> => {
  const text = await Deno.readTextFile(join("./projects", `${slug}.md`));
  const { attrs, body } = extractYaml<Project>(text);
  return {
    slug,
    title: attrs.title,
    publishedAt: new Date(attrs.publishedAt),
    content: body,
    snippet: attrs.snippet,
  };
};

const getProjectList = async (): Promise<Project[]> => {
  const files = Deno.readDir("./projects");
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getProject(slug));
  }
  const projects = await Promise.all(promises) as Project[];
  projects.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return projects;
};

export { getProject, getProjectList };
