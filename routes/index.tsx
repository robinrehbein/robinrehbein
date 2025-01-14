import { Handlers, PageProps } from "$fresh/server.ts";
import FeaturedProjects from "../components/FeaturedProducts.tsx";
import H from "../components/atoms/H.tsx";
import Section from "../components/atoms/Section.tsx";
import Timeline from "../components/Timeline.tsx";
import PgClient from "../lib/pg.ts";
import { Project, TimetableItem } from "../lib/types.ts";
import {
  IconArrowDown,
  IconBike,
  IconCircle,
  IconCube,
  IconCup,
  IconHeartedHands,
  IconHtml,
  IconKeyboard,
  IconPin,
  IconPlant,
  IconReact,
  IconSeparator,
  IconThumbsUp,
} from "../components/Icons.tsx";
import Reveal from "../islands/Reveal.tsx";
import RevealTextOnMouseOver from "../islands/RevealTextOnMouseOver.tsx";
import { Button } from "../components/atoms/Button.tsx";

interface Data {
  items: Array<TimetableItem>;
}

// export const handler: Handlers = {
//   async GET(req, ctx) {
//     const pgClient = new PgClient();
//     const timelineItems = await pgClient.queryObject<Array<TimetableItem>>(
//       "SELECT * FROM timetable_items",
//     );
//     const projects = await pgClient.queryObject<Array<Project>>(
//       "SELECT p.id, p.title, p.url, pc.image_url, pc.description FROM projects p LEFT JOIN project_contents pc ON p.id = pc.fk_project WHERE featured = true",
//     );
//     return ctx.render({
//       timelineItems,
//       projects,
//     });
//   },
// };

const SCROLL_ANKER = "_01";

const Home = (
  // { data }: PageProps<
  //   { timelineItems: Array<TimetableItem>; projects: Array<Project> }
  // >,
) => {
  // const { timelineItems, projects } = data;
  // console.log(timelineItems, projects);
  return (
    <>
      <Section
        separator={false}
        // class="min-h-[calc(100dvh-8rem)] flex flex-col gap-12 relative"
      >
        {/* TODO Gradient */}
        {/* bg-gradient-to-br from-mustard-yellow-200 via-racing-green-500 to-racing-green-800 text-transparent bg-clip-text animate-gradient */}
        <div
          class={"flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8"}
        >
          <H
            class={"inline-flex flex-wrap gap-2 text-md font-medium font-zodiak"} // TODO check font  font-clash-display
            variant={"h1"}
          >
            <span>
              <IconHeartedHands class={"size-6"} />
            </span>
            <p>Robin Rehbein Portfolio</p>

            <span class={"hidden md:inline"}>
              <IconSeparator class={"size-6"} />
            </span>
            <p
              class={"inline-flex items-center gap-2"}
            >
              <span class="relative w-6 h-6 inline-flex items-center justify-center">
                <IconCircle
                  class={"size-3 absolute"}
                />
                <IconCircle
                  class={"size-3 animate-ping"}
                />
              </span>
              Available for projects
            </p>
          </H>
          <div class={"font-zodiak font-medium flex flex-col gap-1"}>
            {
              /* <p
              class={"inline-flex items-center gap-2"}
            >
              <span class="flex items-center justify-center h-6 w-6 relative">
                <IconCircle
                  class={"size-3 animate-bounce"}
                />
                <IconCircle
                  class={"size-3 absolute"}
                />
                <IconCircle
                  class={"size-3 animate-ping"}
                />
              </span>
              Available for projects
            </p> */
            }
            {/* TODO check font font-clash-display */}
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconReact class={"size-6"} />
                {/* <IconHtml slash class={"size-6"} /> */}
              </span>
              Currently coding at
              <a
                href="https://neosfer.de"
                // class={"text-[rgb(0,255,194)] underline decoration-wavy"}
                class={"underline decoration-wavy decoration-mustard-yellow-950"}
              >
                neosfer
              </a>
            </p>
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconPin class={"size-6"} />
              </span>
              Based in Stuttgart, Germany
            </p>
          </div>
        </div>
        <H
          // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight add fontsize clamp
          class={"font-clash-display uppercase font-medium text-[clamp(3rem,8vw,8rem)] leading-none mb-24"}
          variant={"h2"}
        >
          <span>
            {/* Seasoned Web */}
            Frontend
            {
              /* Front
            <span
              class={"font-zodiak lowercase italic font-light"}
            >
              end
            </span> */
            }
          </span>
          <br />
          <span>Developer.</span>
        </H>
        <div
          class={"flex flex-col md:flex-row justify-between items-end gap-24"}
        >
          <div
            // class={"flex flex-row gap-4 items-end absolute left-8 top-[calc(100dvh-16rem)]"}
            class={"flex flex-row w-full sticky left-8 bottom-8"}
          >
            <a href={`#${SCROLL_ANKER}`}>
              <IconArrowDown class={"size-16 md:size-24 animate-bounce"} />
            </a>
            <div>
              <p
                class={"text-base md:text-2xl font-zodiak"}
              >
                {/* Turning people's ideas into reality since 2015. */}
                Turning people's ideas into{" "}
                {/* <span class={"font-anaheim"}>&lt;&gt;web&lt;/&gt;</span> since 2015. */}
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
            class={"object-cover object-top w-full md:w-[55%] aspect-square"} // rounded-full
          />
        </div>
        {/* <Synthwave /> */}
      </Section>

      {
        /* <Reveal>Reveal</Reveal>
      <RevealTextOnMouseOver /> */
      }
      <Section id={`${SCROLL_ANKER}`}>
        <div class={"flex flex-row justify-between mb-4"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            About me.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_01</p>
        </div>
        <div class={"font-zodiak"}>
          <p class={"mb-4 flex items-center gap-2"}>
            <IconThumbsUp class={"size-6"} />
            What i like:
          </p>
          <ul className={"flex flex-row gap-4 mb-8 flex-wrap"}>
            <li class={"flex items-center gap-2"}>
              <IconCup class={"size-6"} /> Coffee!
            </li>
            {
              /* <li class={"flex items-center gap-2"}>
              <IconCube class={"size-6"} /> Games.
              </li> */
            }
            <li class={"flex items-center gap-2"}>
              <IconPlant class={"size-6"} />
              Plants.
            </li>
            {
              /* <li class={"flex items-center gap-2"}>
              <IconHtml class={"size-6"} /> Programming.
              </li> */
            }
            <li class={"flex items-center gap-2"}>
              <IconBike class={"size-6"} /> Biking.
            </li>
            <li class={"flex items-center gap-2"}>
              <IconKeyboard class={"size-6"} /> Custom Keyboards.
            </li>
            <li class={"flex items-center gap-2 grow justify-end"}>
              <a
                href={"/about"}
                class={"flex flex-row gap-2 items-center"}
              >
                More about me
                <IconArrowDown class={"-rotate-90 size-4"} />
              </a>
            </li>
          </ul>
        </div>
      </Section>
      <Section>
        <div class={"flex flex-row justify-between mb-4"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            Projects.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_02</p>
        </div>

        <img
          src="/iphone_artwerk_landing.webp"
          alt="iPhone Mockup"
          class={"object-cover w-full border border-foreground bg-gradient-to-br from-foreground/95 via-foreground/90 to-foreground rounded-md"}
        />

        <img
          src="/plastic_wrinkled_artwerk_landing_w_bg.webp"
          alt="iPhone Mockup"
          class={"object-cover w-full border border-foreground bg-gradient-to-br from-foreground/95 via-foreground/90 to-foreground rounded-md"}
        />
      </Section>
      <Section>
        <div class={"flex flex-row justify-between"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            Contact.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_03</p>
        </div>
      </Section>

      {
        /* <Section>
        <Timeline items={timelineItems} />
      </Section>
      <Section>
        <FeaturedProjects projects={projects} />
      </Section> */
      }
    </>
  );
};

export default Home;
