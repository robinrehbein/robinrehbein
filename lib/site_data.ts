/// <reference lib="deno.unstable" />
import { projects as defaultProjects } from "./projects.ts";

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  href: string;
  images: string[];
  order: number;
}

export interface SiteSettings {
  name: string;
  role: string;
  location: string;
  codingAt: {
    name: string;
    url: string;
  };
  available: boolean;
  aboutMeShort: string;
  contactEmail: string;
  githubUsername: string;
}

const kv = await Deno.openKv();

const PROJECTS_KEY = "projects";
const SETTINGS_KEY = "site_settings";

// --- Projects ---

export async function getProjects(): Promise<ProjectData[]> {
  const iter = kv.list<ProjectData>({ prefix: [PROJECTS_KEY] });
  const projects: ProjectData[] = [];
  for await (const res of iter) {
    projects.push(res.value);
  }

  const fallbackProjects: ProjectData[] = defaultProjects.map((
    project,
    index,
  ) => ({
    id: `default-${index}`,
    title: project.title,
    description: project.description,
    href: project.href,
    images: project.images,
    order: index,
  }));

  const merged = new Map<string, ProjectData>();
  for (const project of fallbackProjects) {
    const key = `${project.title.toLowerCase()}::${project.href.toLowerCase()}`;
    merged.set(key, project);
  }
  for (const project of projects) {
    const key = `${project.title.toLowerCase()}::${project.href.toLowerCase()}`;
    merged.set(key, project);
  }

  return Array.from(merged.values()).sort((a, b) => a.order - b.order);
}

export async function getProjectById(id: string): Promise<ProjectData | null> {
  const res = await kv.get<ProjectData>([PROJECTS_KEY, id]);
  return res.value;
}

export async function saveProject(project: ProjectData): Promise<void> {
  await kv.set([PROJECTS_KEY, project.id], project);
}

export async function deleteProject(id: string): Promise<void> {
  await kv.delete([PROJECTS_KEY, id]);
}

// --- Settings ---

const defaultSettings: SiteSettings = {
  name: "Robin Rehbein",
  role: "Architect & Develop.",
  location: "Stuttgart, Germany",
  codingAt: {
    name: "mimacom",
    url: "https://mimacom.com",
  },
  available: false,
  aboutMeShort:
    "In my free time, I dive into the fascinating world of custom mechanical keyboards...",
  contactEmail: "hello@robinrehbein.de",
  githubUsername: "robinrehbein",
};

export async function getSettings(): Promise<SiteSettings> {
  const res = await kv.get<SiteSettings>([SETTINGS_KEY]);
  return res.value || defaultSettings;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await kv.set([SETTINGS_KEY], settings);
}
