// export const handler: Handlers<Post[]> = {
//   async GET(_req, ctx) {
//     const posts = await getPosts();
//     return ctx.render(posts);
//   },
// };

import H from "../../components/atoms/H.tsx";

const Projects = () => {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <H variant={"h1"} class="text-4xl font-bold">Hello World!</H>
      </div>
    </div>
  );
};

export default Projects;
