import { Handlers, PageProps } from "$fresh/server.ts";
import FeaturedProjects from "../components/FeaturedProducts.tsx";
import H from "../components/H.tsx";
import Section from "../components/Section.tsx";
import Timeline from "../components/Timeline.tsx";
import PgClient from "../lib/pg.ts";
import { Project, TimetableItem } from "../lib/types.ts";

interface Data {
  items: Array<TimetableItem>;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const pgClient = new PgClient();
    const timelineItems = await pgClient.queryObject<Array<TimetableItem>>(
      "SELECT * FROM timetable_items",
    );
    const projects = await pgClient.queryObject<Array<Project>>(
      "SELECT p.id, p.title, p.url, pc.image_url, pc.description FROM projects p LEFT JOIN project_contents pc ON p.id = pc.fk_project WHERE featured = true",
    );
    return ctx.render({
      timelineItems,
      projects,
    });
  },
};

const Home = (
  { data }: PageProps<
    { timelineItems: Array<TimetableItem>; projects: Array<Project> }
  >,
) => {
  const { timelineItems, projects } = data;
  console.log(timelineItems, projects);
  return (
    <>
      <Section class="text-center min-h-[calc(100dvh-8rem)] flex flex-col items-center justify-center">
        <div>
          <H class={"font-circular"} variant={"h1"}>Robin Rehbein</H>
          <H variant={"h2"}>Senior Developer @ neosfer GmbH</H>
        </div>
        {/* <Synthwave /> */}
      </Section>
      <Section>
        <Timeline items={timelineItems} />
      </Section>
      <Section>
        <FeaturedProjects projects={projects} />
      </Section>
    </>
  );
};

export default Home;
