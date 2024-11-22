import { IconGithub, IconLogo, IconMail } from "./Icons.tsx";

const Navbar = () => {
  return (
    <nav class="flex flex-row items-center justify-between bg-neutral-50/50 border border-neutral-50 px-8 py-4 shadow-sm rounded-full w-fit m-auto gap-8">
      <ul
        class={"text-neutral-700 flex flex-row items-center gap-2"}
      >
        <li>
          <IconLogo />
        </li>
        <li>
          <a href="/" class="text-neutral-700">
            Robin Rehbein
          </a>
        </li>
      </ul>
      <ul
        class={"text-neutral-700 flex flex-row items-center gap-2"}
      >
        <li>
          home.
        </li>
        <li>
          work.
        </li>
        <li>
          skills.
        </li>
        <li>
          about.
        </li>
        {
          /* <li>
          blog.
        </li> */
        }
      </ul>
      <ul
        class={"text-neutral-700 flex flex-row items-center gap-2"}
      >
        <li>
          <IconGithub />
        </li>
        <li>
          <IconMail />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
