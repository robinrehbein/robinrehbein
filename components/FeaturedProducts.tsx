import { Project } from "../lib/types.ts";
import H from "./H.tsx";

const FeaturedProjects = ({ projects }: { projects: Array<Project> }) => {
  return (
    <div>
      <H variant={"h2"} class={"font-semibold"}>Featured Products</H>
      <ul>
        {projects.map((projects) => (
          <li key={projects.title}>{projects.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default FeaturedProjects;
