import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  getSettings,
  saveSettings,
  SiteSettings,
} from "../../lib/site_data.ts";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";

export const handler: Handlers<SiteSettings> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("", {
        status: 303,
        headers: { Location: "/admin/login" },
      });
    }
    const settings = await getSettings();
    return ctx.render(settings);
  },
  async POST(req, _ctx) {
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await req.formData();
    const settings: SiteSettings = {
      name: form.get("name")?.toString() || "",
      role: form.get("role")?.toString() || "",
      location: form.get("location")?.toString() || "",
      codingAt: {
        name: form.get("codingAtName")?.toString() || "",
        url: form.get("codingAtUrl")?.toString() || "",
      },
      available: form.get("available") === "on",
      aboutMeShort: form.get("aboutMeShort")?.toString() || "",
      contactEmail: form.get("contactEmail")?.toString() || "",
      githubUsername: form.get("githubUsername")?.toString() || "",
    };

    await saveSettings(settings);

    return new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
};

export default function SettingsPage({ data }: PageProps<SiteSettings>) {
  return (
    <Section separator={false}>
      <div class="mb-16">
        <H variant="h1" class="text-4xl font-clash-display uppercase mb-8">
          Site Settings
        </H>
        <form method="post" class="flex flex-col gap-8 max-w-4xl font-zodiak">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label for="name" class="uppercase text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="role" class="uppercase text-sm font-medium">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={data.role}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="location" class="uppercase text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={data.location}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label for="codingAtName" class="uppercase text-sm font-medium">
                Coding at (Name)
              </label>
              <input
                type="text"
                id="codingAtName"
                name="codingAtName"
                value={data.codingAt.name}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="codingAtUrl" class="uppercase text-sm font-medium">
                Coding at (URL)
              </label>
              <input
                type="url"
                id="codingAtUrl"
                name="codingAtUrl"
                value={data.codingAt.url}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={data.available}
              class="size-5 accent-racing-green-800"
            />
            <label for="available" class="uppercase text-sm font-medium">
              Available for projects
            </label>
          </div>

          <div class="flex flex-col gap-2">
            <label for="aboutMeShort" class="uppercase text-sm font-medium">
              About Me (Short)
            </label>
            <textarea
              id="aboutMeShort"
              name="aboutMeShort"
              rows={6}
              class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
              required
            >
              {data.aboutMeShort}
            </textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label for="contactEmail" class="uppercase text-sm font-medium">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={data.contactEmail}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="githubUsername" class="uppercase text-sm font-medium">
                Github Username
              </label>
              <input
                type="text"
                id="githubUsername"
                name="githubUsername"
                value={data.githubUsername}
                class="border border-foreground bg-transparent p-3 focus:outline-none focus:italic"
                required
              />
            </div>
          </div>

          <div class="flex gap-4">
            <Button type="submit">Save Settings</Button>
            <Button>
              <a href="/admin">Cancel</a>
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
