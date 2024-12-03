import { Button } from "./Button.tsx";
import { IconGithub, IconHamburger, IconLogo, IconMail } from "./Icons.tsx";

const Navbar = () => {
  return (
    // ToDo: Opacity not working currently, check how to add to custom colors in tailwind
    <nav class="flex flex-row items-center justify-between backdrop-blur bg-background/50 border border-background px-8 py-4 shadow rounded-full w-fit m-auto gap-12">
      <ul
        class={"text-foreground flex flex-row items-center gap-4"}
      >
        <li>
          <IconLogo />
        </li>
        <li>
          <a href="/" class="text-foreground font-semibold">
            Robin Rehbein
          </a>
        </li>
      </ul>
      <ul
        class={"text-foreground md:flex flex-row items-center gap-4 hidden text-sm"}
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
        <li>
          hub.
        </li>
        {
          /* <li>
          blog.
        </li> */
        }
      </ul>
      <ul
        class={"text-racing-green hidden md:flex flex-row items-center gap-4"}
      >
        <li>
          <IconMail />
        </li>
        <li>
          <IconGithub />
        </li>
      </ul>
      <Button class={"md:hidden text-racing-green"}>
        <IconHamburger />
      </Button>
    </nav>
  );
};

export default Navbar;
