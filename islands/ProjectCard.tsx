import { effect, useSignal } from "@preact/signals";
import { Button } from "../components/atoms/Button.tsx";
import { IconArrowDown } from "../components/Icons.tsx";
import { cn } from "../lib/utils.ts";
import H from "../components/atoms/H.tsx";

const ProjectCard = (
  { title, description, href, images }: {
    title: string;
    description: string;
    href: string;
    images: [string, string, string, string, string];
  },
) => {
  const isElapsed = useSignal(false);

  return (
    <div class={"relative"}>
      <div class={"border-l border-foreground pl-4"}>
        <H variant="h3" class={"mb-4 italic font-zodiak font-medium text-base"}>
          {title}
        </H>
        <p class={"mb-8"}>
          {description}
        </p>
      </div>
      <div
        class={"flex flex-row sticky top-14 inset-x-4 mb-8 justify-between"}
      >
        <Button>
          <a href={href} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </Button>
        <Button
          class={"flex flex-row gap-2 items-center justify-end"}
          onClick={() => {
            isElapsed.value = !isElapsed.value;
          }}
        >
          <IconArrowDown
            class={cn("size-4", {
              "rotate-180": isElapsed.value,
            })}
          />
          {isElapsed.value ? "Collapse images" : "Expand images"}
        </Button>
      </div>
      <div class={"shadow"}>
        <img
          // src="/iphone_artwerk_landing.webp"
          src={images[0]}
          alt="Mockup"
          class={"object-cover w-full aspect-square hidden md:block"}
        />
        <img
          src={images[1]}
          alt="Mockup"
          class={"object-cover w-full aspect-square md:hidden"}
        />
        <div class={"flex flew-row flex-wrap"}>
          {images.slice(2).map((image) => (
            <img
              src={image}
              alt="Mockup"
              class={cn("object-cover w-1/3 aspect-square", {
                "w-full": isElapsed.value,
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;
