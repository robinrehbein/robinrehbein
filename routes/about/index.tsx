// export const handler: Handlers<Post[]> = {
//   async GET(_req, ctx) {
//     const posts = await getPosts();
//     return ctx.render(posts);
//   },
// };

import { Button } from "../../components/atoms/Button.tsx";
import H from "../../components/atoms/H.tsx";
import Section from "../../components/atoms/Section.tsx";
import {
  IconArrowDown,
  IconArtwerk,
  IconBike,
  IconCircle,
  IconCup,
  IconHeartedHands,
  IconKeyboard,
  IconMhp, IconMimacom,
  IconNeosfer,
  IconPin,
  IconPlant,
  IconReact,
  IconSeparator,
  IconTelekom,
} from "../../components/Icons.tsx";
import Expand from "../../islands/Expand.tsx";

const Projects = () => {
  return (
    <>
      <Section
        separator={false}
      >
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
                  class={"size-3 absolute text-red-800"}
                />
                <IconCircle
                  class={"size-3 animate-ping text-red-800"}
                />
              </span>
              <span class="line-through">Unavailable</span> for projects
            </p>
          </H>
          <div class={"font-zodiak font-medium flex flex-col gap-1"}>
            <p className={"inline-flex items-center gap-2"}>
              <span>
                <IconReact class={"size-6"}/>
              </span>
              Currently coding at
              <a
                  href="https://mimacom.com"
                  className={"underline decoration-wavy decoration-[#FF0651]"}
                  /*decoration-mustard-yellow-950*/
              >
                mimacom
              </a>
            </p>
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconPin class={"size-6"}/>
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
          <span>About Me.</span>
        </H>
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
                href={"/"}
                class={"flex flex-row gap-2 items-center"}
              >
                Back
                <IconArrowDown class={"rotate-90 size-4"} />
              </a>
            </Button>
          </li>
        </ul>
        <div
          class={"flex flex-col md:flex-row gap-12 relative"}
        >
          <img
            src="/me.jpg"
            alt="me"
            class={"object-cover object-top w-full md:w-1/2 shadow"} // rounded-full
          />
          <div
            class={"sticky top-1/4 h-fit"}
          >
            <p class={"mb-4 text-base md:text-2xl font-zodiak"}>
              Hi - I'm <strong>Robin</strong>,
            </p>
            <p
              class={"mb-2"}
            >
              currently living in the vibrant locales of Stuttgart, Germany. I
              finished my studies in computer science and communications in
              2018. I love new technology and found my passion for web design
              and development during my studies. Since then, I have taught
              myself many new technologies and programming languages. My
              excitement for learning never stops.
            </p>
            <p>
              In my free time, I enjoy working on custom mechanical keyboards,
              making unique and personal typing experiences. During the
              pandemic, I discovered a love for indoor plants and turned my home
              into a green and peaceful space. I also love biking, which takes
              me on exciting adventures as I explore hidden trails.
              Additionally, I have learned a lot about coffee, which has
              deepened my appreciation for every cup I make.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <div class={"flex flex-row justify-between mb-4 md:mb-8"}>
          <H
            // TODO check tracking and leading and color text-racing-green-800 leading-[7rem] tracking-tight
            class={"font-clash-display uppercase font-medium text-[clamp(2.5rem,8vw,4.5rem)]"}
            variant={"h2"}
          >
            Positions.
          </H>
          <p class={"font-zodiak font-medium text-md"}>_01</p>
        </div>
        <div>
          <p class={"mb-y md:my-16"}>
            In my career, I have had the chance to work in many interesting
            places. Each job has taught me something new and helped me grow. I
            have learned a lot and seen many different things in the world of
            technology. Starting with web design and development, I learned how
            to make websites that people find easy to use. In other jobs, I
            picked up new skills and worked with different teams to solve
            problems and create projects that{" "}
            <a
              href="https://impact-festival.earth"
              class={"underline decoration-wavy decoration-emerald-400"}
            >
              create impact
            </a>.
          </p>
          <p class={"my-8 md:my-16 italic font-medium"}>
            Current positions:
          </p>
          <ul class={"flex flex-col md:flex-row gap-8 md:gap-16"}>
            <li class="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconMimacom class={"size-12 min-w-12"}/>
              <div>
                <p>
                  <strong>Software Engineer Senior{" "}</strong>
                  <br class={"md:hidden"}/>
                  at{" "}
                  <a
                      href="https://mimacom.com"
                      className={"underline decoration-wavy decoration-[#FF0651] font-medium hover:text-[#FF0651]"}
                  >
                    mimacom
                  </a>
                </p>
                <p>01 - 01 - 2026 till today</p>
                {/* TODO Expand infos and description */}
                <Expand>
                  I started a new journey at mimacom in the beginning of 2026. Mimacom is a software and consulting company dedicated to digital progress. By combining cutting-edge technology and market expertise with individual talent, I help drive our team's passion and ensure our customers' long-term success.
                  Stay ahead in a fast-changing digital world.
                </Expand>
              </div>
            </li>
            <li>
              <span class={"w-full h-px md:h-12 md:w-px bg-foreground block"} />
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
                <p>09-03-2023 till today</p>
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
          <p class={"my-8 md:my-16 italic font-medium"}>
            Previous positions:
          </p>

          <ul class={"flex flex-col flex-wrap md:flex-row gap-8 md:gap-16"}>
            <li className="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconNeosfer class={"size-12 min-w-12"}/>
              <div>
                <p>
                  <strong>Senior Developer{" "}</strong>
                  <br class={"md:hidden"}/>
                  at{" "}
                  <a
                      href="https://neosfer.de"
                      class={"underline decoration-wavy decoration-emerald-400 font-medium hover:text-emerald-400"} //decoration-mustard-yellow-950 text-mustard-yellow-950
                  >
                    neosfer
                  </a>
                </p>
                <p>01-11-2022 till 31-12-2025</p>
                {/* TODO Expand infos and description */}
                <Expand>
                  I started a new journey at neosfer in late 2022. neosfer is a
                  subsidiary of Commerzbank AG and deals with innovative
                  technologies of the future.
                </Expand>
              </div>
            </li>
            <li>
              <span className={"w-full h-px md:h-12 md:w-px bg-foreground block"}/>
            </li>
            <li class="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconMhp class={"size-12 min-w-12"}/>
              <div>
                <p>
                  <strong>Senior Consultant{" "}</strong>
                  <br class={"md:hidden"}/>
                  at{" "}
                  <a
                      href="https://mhp.com"
                      class={"underline decoration-wavy decoration-blue-700 font-medium hover:text-blue-700"}
                  >
                    MHP - A Porsche Company
                  </a>
                </p>
                <p>01-08-2019 till 31-12-2022</p>
                {/* TODO Expand infos and description */}
                <Expand>
                  At MHP - A Porsche Company, I initially worked as a
                  Consultant, developing a custom application for Porsche AG
                  using Java and Spring. I provided advice on implementing and
                  extending features. Later, as a Senior Consultant, I
                  transitioned to a fully AWS-based project, where I was part of
                  a team that developed two IoT applications to automate
                  logistics and monitoring for manufacturers.
                </Expand>
              </div>
            </li>
            <li>
              <span className={"w-full h-px md:h-12 md:w-px bg-foreground block"}/>
            </li>

            <li class="flex flex-row gap-8 md:gap-16 items-start md:flex-1">
              <IconTelekom class={"size-12 min-w-12"}/>
              <div>
                <p>
                  <strong>IT-Architekt{" "}</strong>
                  <br class={"md:hidden"}/>at{" "}
                  <a
                      href="https://t-systems.com"
                      class={"underline decoration-wavy decoration-pink-500 font-medium hover:text-pink-500"}
                  >
                    T-Systems / Deutsche Telekom
                  </a>
                </p>
                <p>01-10-2015 till 31-07-2021</p>
                <Expand>
                  At Deutsche Telekom, I worked in various roles where I was
                  involved in planning, consulting, and creating network
                  solutions and concepts for large customers, focusing on LAN
                  and WLAN using Cisco and Meraki technologies. Later, at
                  T-Systems International GmbH, I contributed to developing a
                  "digital twin" concept and implementing it using Scrum
                  methodologies. I also worked on an anomaly detection system
                  using Support Vector Machine and Neural Network techniques,
                  utilizing Thingworx Analytics, JavaScript, and Java. As an IT
                  Architect, I was responsible for creating and evaluating
                  prototypes and their architecture for new functionalities of
                  PLM software, as well as implementing new functions into
                  existing software using C#.
                </Expand>
              </div>
            </li>
          </ul>
        </div>
      </Section>
    </>
  );
};

export default Projects;
