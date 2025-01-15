import { useSignal } from "@preact/signals";
import { Button } from "../components/atoms/Button.tsx";
import { IconMore } from "../components/Icons.tsx";
import { cn } from "../lib/utils.ts";

const MobileMenu = () => {
  const isOpen = useSignal(false);

  return (
    <div class={"relative"}>
      <Button
        class={"md:hidden text-foreground"}
        onClick={() => isOpen.value = !isOpen.value}
      >
        <IconMore class={"size-5 rotate-90"} />
      </Button>
      <ul
        class={cn(
          "opacity-0 overflow-hidden transition-all absolute right-0 top-10 items-end pt-0.5 flex flex-col gap-4 z-10 font-zodiak",
          {
            "h-[188px] opacity-100": isOpen.value,
          },
        )}
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
          <a href="skills">
            skills.
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
    </div>
  );
};

export default MobileMenu;
