import ShowOnScroll from "../islands/ShowOnScroll.tsx";
import { Button } from "./atoms/Button.tsx";
import {
  IconCircle,
  IconGithub,
  IconHamburger,
  IconLogo,
  IconMail,
  IconSeparator,
} from "./Icons.tsx";

const Navbar = () => {
  return (
    // ToDo: Opacity not working currently, check how to add to custom colors in tailwind
    <nav class="flex flex-row justify-between px-8 py-4 w-full gap-12 z-10">
      <ul
        class={"text-foreground flex flex-row items-center gap-4"}
      >
        <li>
          <IconLogo />
        </li>
        <ShowOnScroll>
          <li>
            <a href="/" class="text-foreground font-zodiak flex flex-row gap-2">
              <p>Robin Rehbein Portfolio</p>
              <span>
                <IconSeparator class={"size-6"} />
              </span>
              <p
                class={"inline-flex items-center gap-2"}
              >
                <span class="relative">
                  <IconCircle
                    class={"size-3 absolute"}
                  />
                  <IconCircle
                    class={"size-3 animate-ping"}
                  />
                </span>
                Available for projects
              </p>
            </a>
          </li>
        </ShowOnScroll>
      </ul>
      <ul
        class={"text-foreground md:flex flex-row items-center gap-4 hidden text-sm font-zodiak"} // TODO add blend mode
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
      {
        /* <ul
        class={"text-racing-green hidden md:flex flex-row items-center gap-4"}
      >
        <li>
          <IconMail />
        </li>
        <li>
          <IconGithub />
        </li>
      </ul> */
      }
      <Button class={"md:hidden text-racing-green"}>
        <IconHamburger />
      </Button>
    </nav>
  );
};

export default Navbar;
