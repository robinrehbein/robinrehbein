import { Handlers, PageProps } from "$fresh/server.ts";
import FeaturedProjects from "../components/FeaturedProducts.tsx";
import H from "../components/atoms/H.tsx";
import Section from "../components/atoms/Section.tsx";
import Timeline from "../components/Timeline.tsx";
import PgClient from "../lib/pg.ts";
import { Project, TimetableItem } from "../lib/types.ts";
import {
  IconArrowDown,
  IconArtwerk,
  IconBike,
  IconCircle,
  IconCube,
  IconCup,
  IconGithub,
  IconHeartedHands,
  IconHtml,
  IconKeyboard,
  IconMail,
  IconNeosfer,
  IconPin,
  IconPlant,
  IconReact,
  IconSeparator,
  IconThumbsUp,
} from "../components/Icons.tsx";
import Reveal from "../islands/Reveal.tsx";
import RevealTextOnMouseOver from "../islands/RevealTextOnMouseOver.tsx";
import { Button } from "../components/atoms/Button.tsx";
import ProjectCard from "../islands/ProjectCard.tsx";
import Expand from "../islands/Expand.tsx";

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
          class={"flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8 md:gap-16"}
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
          class={"flex flex-col md:flex-row justify-between items-end gap-12"}
        >
          <div
            // class={"flex flex-row gap-4 items-end absolute left-8 top-[calc(100dvh-16rem)]"}
            class={"flex flex-row w-full sticky left-8 bottom-8 gap-4"}
          >
            <a href={`#${SCROLL_ANKER}`}>
              <IconArrowDown class={"size-16 md:size-24 animate-bounce"} />
            </a>
            <div class={"inline-flex items-end"}>
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
            class={"object-cover object-top w-full md:w-1/2 aspect-square shadow"} // rounded-full
          />
        </div>
        {/* <Synthwave /> */}
      </Section>

      {
        /* <Reveal>Reveal</Reveal>
      <RevealTextOnMouseOver /> */
      }
      <Section id={`${SCROLL_ANKER}`}>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            About me.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_01</p>
        </div>
        <div class={"font-zodiak mb-8 md:mb-16"}>
          {/* <p class={"mb-4 flex items-center gap-2 font-medium"}> */}
          <p class={"mb-4 md:mb-8 italic font-medium"}>
            {/* <IconThumbsUp class={"size-6"} /> */}
            What i like:
          </p>
          <ul
            className={"flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap"}
          >
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
            In my free time, I dive into the fascinating world of{" "}
            <em>
              <strong>
                custom mechanical keyboards
              </strong>
            </em>, crafting unique and{" "}
            personalized typing experiences that are as expressive as they are
            functional. The pandemic unlocked a newfound passion for{" "}
            <em>
              <strong>
                indoor plants
              </strong>
            </em>, transforming my living space into a lush sanctuary that
            breathes life and tranquility. My love for biking takes me on{" "}
            <em>
              <strong>
                thrilling adventures
              </strong>
            </em>, exploring hidden trails and embracing the thrill of the ride.
            Moreover, my journey into the realm of coffee as a barista has been
            transformative, immersing me in the{" "}
            <em>
              <strong>
                rich art of coffee-making
              </strong>
            </em>{" "}
            and deepening my appreciation for every aromatic brew.
          </p>
        </div>
        <div>
          <p class={"mb-8 md:mb-16 italic font-medium"}>
            Current positions:
          </p>
          <ul class={"flex flex-col md:flex-row gap-8 md:gap-16"}>
            <li class="flex flex-row gap-8 md:gap-16 items-start">
              <IconNeosfer class={"size-12 min-w-12"} />
              <div>
                <p>
                  <strong>Senior Developer{" "}</strong>
                  <br class={"md:hidden"} />
                  at{" "}
                  <a
                    href="https://neosfer.de"
                    class={"underline decoration-wavy decoration-mustard-yellow-950 font-medium hover:text-mustard-yellow-950"}
                  >
                    neosfer
                  </a>
                </p>
                <p>01 - 11 - 2022 till today</p>
                {/* TODO Expand infos and description */}
                <Expand>
                  I started a new journey at neosfer in late 2022. neosfer is a
                  subsidiary of Commerzbank AG and deals with innovative
                  technologies of the future.
                </Expand>
              </div>
            </li>
            <span class={"w-full h-px md:h-12 md:w-px bg-foreground block"} />
            <li class="flex flex-row gap-8 md:gap-16 items-start">
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
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
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
        <ProjectCard
          title="artwerk studios"
          description="artwerk is a passion project that I co-founded with two friends. Our
          mission is to transform your favorite songs into personalized posters,
          capturing the essence of music and memory in unique visual art. In
          just seconds, you can create your custom poster and see a preview. We
          prioritize high-quality printing and use only premium paper.
          Sustainability is also important to us, so our products are produced
          in an environmentally friendly manner. artwerk is the perfect blend of
          personal taste and design—a tribute to the tunes that move you. Dive
          into the art of music with artwerk."
          href="https://artwerk.store"
          images={[
            "/macbook_artwerk_landing_light.webp",
            "/iphone_artwerk_landing.webp",
            "/curved_3_artwerk_poster.webp",
            "/curved_1_artwerk_poster.webp",
            "/curved_2_artwerk_poster.webp",
          ]}
        />
        {/* <hr class={"my-16 border-foreground"} /> */}
        <ProjectCard
          title="Kirchmaier & Staudacher"
          description="Kirchmaier & Staudacher is a premier project management 
          company co-founded by a team dedicated to excellence in construction 
          and real estate development. Their passion drives them to deliver personalized 
          project solutions with precision and efficiency. They offer a seamless experience, 
          providing instant previews of project plans and ensuring top-tier quality with 
          every execution. Sustainability is at the core of their operations, as they 
          strive to implement environmentally friendly practices in all their projects. 
          Discover the perfect synergy of expertise and innovation with Kirchmaier & Staudacher, 
          where your vision is their blueprint for success."
          href="https://www.kirchmaier-staudacher.de/"
          images={[
            "/macbook_kirchmaier_landing_1.webp",
            "/iphone_kirchmaier_landing_1.webp",
            "/macbook_kirchmaier_landing_2.webp",
            "/iphone_kirchmaier_landing_2.webp",
            "/macbook_kirchmaier_landing_3.webp",
          ]}
        />
      </Section>
      <Section>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
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
            {/* <IconThumbsUp class={"size-6"} /> */}
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
                href={"mailto:hello@robinrehbein.de"}
              >
                hello@robinrehbein.de
              </a>. I look forward to connecting with you!
            </p>
            <ul
              class={"flex flex-row items-center gap-4 md:gap-8 flex-wrap"}
            >
              <li>
                <a
                  class={"font-medium italic"}
                  href={"mailto:hello@robinrehbein.de"}
                >
                  <IconMail class={"size-6 inline-flex mr-2"} />{" "}
                  hello@robinrehbein.de
                </a>
              </li>
              <li>
                <a
                  class={"font-medium italic"}
                  href={"https://github.com/robinrehbein"}
                >
                  <IconGithub class={"size-6 inline-flex mr-2"} /> robinrehbein
                </a>
              </li>
            </ul>
          </div>
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
