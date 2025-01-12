import { Handlers, PageProps } from "$fresh/server.ts";
import FeaturedProjects from "../components/FeaturedProducts.tsx";
import H from "../components/atoms/H.tsx";
import Section from "../components/atoms/Section.tsx";
import Timeline from "../components/Timeline.tsx";
import PgClient from "../lib/pg.ts";
import { Project, TimetableItem } from "../lib/types.ts";
import {
  IconArrowDown,
  IconHeartedHands,
  IconPin,
  IconReact,
} from "../components/Icons.tsx";

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
        class="h-[calc(100dvh-8rem)] flex flex-col gap-12"
      >
        {/* TODO Gradient */}
        {/* bg-gradient-to-br from-mustard-yellow-200 via-racing-green-500 to-racing-green-800 text-transparent bg-clip-text animate-gradient */}
        <div class={"flex flex-row items-start justify-between mb-8"}>
          <H
            class={"inline-flex gap-2 text-md font-clash-display font-medium"}
            variant={"h1"}
          >
            <span>
              <IconHeartedHands class={"size-6"} />
            </span>
            Robin Rehbein Portfolio
          </H>
          <div class={"font-clash-display font-medium"}>
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconReact class={"size-6"} />
              </span>
              Currently coding at
              <a
                href="https://neosfer.de"
                // class={"text-[rgb(0,255,194)] underline decoration-wavy"}
                class={"underline decoration-wavy"}
              >
                neosfer
              </a>
            </p>
            <br />
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconPin class={"size-6"} />
              </span>
              Based in Stuttgart in Germany
            </p>
          </div>
        </div>
        <H
          // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
          class={"font-clash-display uppercase font-medium text-9xl"}
          variant={"h2"}
        >
          <span>
            Front
            <span
              class={"font-zodiak lowercase italic font-light"}
            >
              end
            </span>
          </span>
          <br />
          <span>Developer</span>
        </H>
        <div class={"flex flex-row justify-between items-end"}>
          <div class={"flex flex-row items-end"}>
            <IconArrowDown class={"size-24"} />
            <p className={"text-2xl font-zodiak w-80"}>
              Turning people's ideas into reality since 2015.
            </p>
          </div>
          <img
            src="/me_square.jpg"
            alt="me"
            class={"object-cover object-top w-[55%] h-96"} // aspect-square
          />
        </div>
        {/* <Synthwave /> */}
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
