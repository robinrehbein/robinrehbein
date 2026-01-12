import MobileMenu from "../islands/MobileMenu.tsx";
import Reveal from "../islands/Reveal.tsx";
import { IconCircle, IconLogo, IconSeparator } from "./Icons.tsx";

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
        {/* TODO fix build error on reveal */}
        <Reveal>
          <a href="/" class="text-foreground font-zodiak flex flex-row gap-2">
            <p>R. Rehbein Portfolio</p>
            <p
              class={"hidden md:flex items-center gap-2"}
            >
              <span>
                <IconSeparator class={"size-6"} />
              </span>
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
          </a>
        </Reveal>
      </ul>
      <ul
        class={"text-foreground md:flex flex-row items-center gap-4 hidden text-sm font-zodiak"} // TODO add blend mode
      >
        <li>
          <a href="/">
            home.
          </a>
        </li>
        <li>
          <a href="work">
            work.
          </a>
        </li>
        <li>
          <a href="about">
            about.
          </a>
        </li>
        <li>
          <a href="hub">
            hub.
          </a>
        </li>
      </ul>
      <MobileMenu />
    </nav>
  );
};

export default Navbar;
