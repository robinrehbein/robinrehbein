import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import {
  IconArrowDown,
  IconCircle,
  IconHeartedHands,
  IconPin,
  IconReact,
  IconSeparator,
} from "../../components/Icons.tsx";
import { getProjects, getSettings, ProjectData, SiteSettings } from "../../lib/site_data.ts";
import ProjectCard from "../../islands/ProjectCard.tsx";

interface Data {
  settings: SiteSettings;
  projects: ProjectData[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const settings = await getSettings();
    const projects = await getProjects();
    return ctx.render({ settings, projects });
  },
};

const Work = ({ data }: PageProps<Data>) => {
  const { settings, projects } = data;
  return (
    <>
      <Section
        separator={false}
      >
        <div
          class={"flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8 md:gap-16"}
        >
          <H
            class={"inline-flex flex-wrap gap-2 text-md font-medium font-zodiak"}
            variant={"h1"}
          >
            <span>
              <IconHeartedHands class={"size-6"} />
            </span>
            <p>{settings.name} Portfolio</p>

            <span class={"hidden md:inline"}>
              <IconSeparator class={"size-6"} />
            </span>
            <p
              class={"inline-flex items-center gap-2"}
            >
              <span class="relative w-6 h-6 inline-flex items-center justify-center">
                <IconCircle
                    class={`size-3 absolute ${settings.available ? "text-racing-green" : "text-red-800"}`}
                  />
                  <IconCircle
                    class={`size-3 animate-ping ${settings.available ? "text-racing-green" : "text-red-800"}`}
                  />
                </span>
                {settings.available ? "Available" : <span class="line-through">Unavailable</span>} for projects
            </p>
          </H>
          <div class={"font-zodiak font-medium flex flex-col gap-1"}>
            <p className={"inline-flex items-center gap-2"}>
                <span>
                  <IconReact class={"size-6"}/>
                </span>
              Currently coding at
              <a
                  href={settings.codingAt.url}
                  className={"underline decoration-wavy decoration-[#FF0651]"}
              >
                {settings.codingAt.name}
              </a>
            </p>
            <p className={"inline-flex items-center gap-2"}>
              <span>
                <IconPin class={"size-6"}/>
              </span>
              Based in {settings.location}
            </p>
          </div>
        </div>
        <H
            class={"font-clash-display uppercase font-medium text-[clamp(3rem,8vw,8rem)] leading-none mb-24"}
            variant={"h2"}
        >
          <span>Work.</span>
        </H>
        <ul
            className={"flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap"}
        >
          <li class={"flex items-center gap-2 grow justify-end my-4 md:my-0"}>
            <Button>
              <a
                href={"/"}
                class={"flex flex-row gap-2 items-center"}
              >
                Back
                <IconArrowDown class={"rotate-90 size-4"} />
              </a>
            </Button>
          </li>
        </ul>
      </Section>
      <Section>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            href={project.href}
            images={project.images}
          />
        ))}
      </Section>
    </>
  );
};

export default Work;
