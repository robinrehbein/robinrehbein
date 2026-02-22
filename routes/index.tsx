import H from "../components/atoms/H.tsx";
import Section from "../components/atoms/Section.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import {
  IconArrowDown,
  IconArtwerk,
  IconBike,
  IconCircle,
  IconCup,
  IconGithub,
  IconHeartedHands,
  IconKeyboard,
  IconMail,
  IconMimacom,
  IconPin,
  IconPlant,
  IconReact,
  IconSeparator,
} from "../components/Icons.tsx";
import { Button } from "../components/atoms/Button.tsx";
import ProjectCard from "../islands/ProjectCard.tsx";
import Expand from "../islands/Expand.tsx";
import { getProjects, getSettings, ProjectData, SiteSettings } from "../lib/site_data.ts";

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

const SCROLL_ANKER = "_01";

const Home = ({ data }: PageProps<Data>) => {
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
            <p class={"inline-flex items-center gap-2"}>
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
          <span>
            {settings.role.split("&").map((part, i, arr) => (
              <>
                {part}{i < arr.length - 1 && "&"}
                {i < arr.length - 1 && <br />}
              </>
            ))}
          </span>
        </H>
        <div
          class={"flex flex-col md:flex-row justify-between items-end gap-12"}
        >
          <div
            class={"flex flex-row w-full sticky left-8 bottom-8 gap-4"}
          >
            <a href={`#${SCROLL_ANKER}`}>
              <IconArrowDown class={"size-16 md:size-24 animate-bounce"} />
            </a>
            <div class={"inline-flex items-end"}>
              <p
                class={"text-base md:text-2xl font-zodiak"}
              >
                Turning people's ideas into{" "}
                <span
                  class={"font-medium text-mustard-yellow-950 hover:italic"}
                >
                  &#123;code&#125;
                </span>{" "}
                since 2015.
              </p>
            </div>
          </div>
          <img
            src="/me_square.jpg"
            alt="me"
            class={"object-cover object-top w-full md:w-1/2 aspect-square shadow"}
          />
        </div>
      </Section>

      <Section id={`${SCROLL_ANKER}`}>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            About me.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_01</p>
        </div>
        <div class={"font-zodiak mb-8 md:mb-16"}>
          <p class={"mb-4 md:mb-8 italic font-medium"}>
            What i like:
          </p>
          <ul
            className={"flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap"}
          >
            <li class={"flex items-center gap-2"}>
              <IconCup class={"size-6"} /> Coffee!
            </li>
            <li class={"flex items-center gap-2"}>
              <IconPlant class={"size-6"} />
              Plants.
            </li>
            <li class={"flex items-center gap-2"}>
              <IconBike class={"size-6"} /> Biking.
            </li>
            <li class={"flex items-center gap-2"}>
              <IconKeyboard class={"size-6"} /> Custom Keyboards.
            </li>
            <li class={"flex items-center gap-2 grow justify-end my-4 md:my-0"}>
              <Button>
                <a
                  href={"/about"}
                  class={"flex flex-row gap-2 items-center"}
                >
                  More about me
                  <IconArrowDown class={"-rotate-90 size-4"} />
                </a>
              </Button>
            </li>
          </ul>
          <p>
            {settings.aboutMeShort}
          </p>
        </div>
        <div>
          <p class={"mb-8 md:mb-16 italic font-medium"}>
            Current positions:
          </p>
          <ul class={"flex flex-col md:flex-row gap-8 md:gap-16"}>
            <li class="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconMimacom class={"size-12 min-w-12"} />
              <div>
                <p>
                  <strong>Software Engineer Senior{" "}</strong>
                  <br class={"md:hidden"} />
                  at{" "}
                  <a
                    href="https://mimacom.com"
                    class={"underline decoration-wavy decoration-[#FF0651] font-medium hover:text-[#FF0651]"}
                  >
                    mimacom
                  </a>
                </p>
                <p>01 - 01 - 2026 till today</p>
                <Expand>
                  I started a new journey at mimacom in the beginning of 2026. Mimacom is a software and consulting company dedicated to digital progress. By combining cutting-edge technology and market expertise with individual talent, I help drive our team's passion and ensure our customers' long-term success.
                  Stay ahead in a fast-changing digital world.
                </Expand>
              </div>
            </li>
            <li>
              <span
                class={"w-full h-px md:h-12 md:w-px bg-foreground block"}
              />
            </li>
            <li class="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconArtwerk class={"size-12 min-w-12"} />
              <div>
                <p>
                  <strong>Co-Founder{" "}</strong>
                  <br class={"md:hidden"} />at{" "}
                  <a
                    href="https://artwerk.store"
                    class={"underline decoration-wavy decoration-racing-green font-medium hover:text-racing-green"}
                  >
                    artwerk studios
                  </a>
                </p>
                <p>14 - 03 - 2023 till today</p>
                <Expand>
                  As a founding member of a startup, I played a pivotal role in
                  the development of a groundbreaking product and took on
                  responsibilities in areas such as marketing and project
                  management. Our venture is an exciting online shop where
                  customers can unleash their creativity and personalize their
                  posters in unique and captivating ways.
                </Expand>
              </div>
            </li>
          </ul>
        </div>
      </Section>
      <Section>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            Projects.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_02</p>
        </div>
        <Button class={"mb-16 mt-8 w-full"}>
          <a
            href={"/work"}
            class={"flex flex-row gap-2 items-center justify-end"}
          >
            More of my work
            <IconArrowDown class={"-rotate-90 size-4"} />
          </a>
        </Button>
        {projects.slice(0, 2).map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            href={project.href}
            images={project.images}
          />
        ))}
      </Section>
      <Section>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            Contact.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_03</p>
        </div>
        <div class={"flex md:flex-row flex-col gap-8 md:gap-16"}>
          <p
            class={"italic md:flex-1 font-medium"}
          >
            Get in touch!
          </p>
          <div class="md:flex-1">
            <p
              class={"mb-8 md:mb-16"}
            >
              I'd love to hear from you! Whether you have a question, a project
              proposal, or just want to say hello, feel free to reach out. You
              can contact me via email at{" "}
              <a
                class={"font-medium italic"}
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>. I look forward to connecting with you!
            </p>
            <ul
              class={"flex flex-row items-center gap-4 md:gap-8 flex-wrap"}
            >
              <li>
                <a
                  class={"font-medium italic"}
                  href={`mailto:${settings.contactEmail}`}
                >
                  <IconMail class={"size-6 inline-flex mr-2"} />{" "}
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a
                  class={"font-medium italic"}
                  href={`https://github.com/${settings.githubUsername}`}
                >
                  <IconGithub class={"size-6 inline-flex mr-2"} /> {settings.githubUsername}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Home;
