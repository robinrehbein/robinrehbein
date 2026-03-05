import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { Button } from "../components/atoms/Button.tsx";
import { IconArrowDown } from "../components/Icons.tsx";
import { cn } from "../lib/utils.ts";
import H from "../components/atoms/H.tsx";

interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  images: string[];
}

const ProjectCard = (
  { title, description, href, images }: ProjectCardProps,
): JSX.Element => {
  const isElapsed = useSignal(false);

  const safeImages = images.length > 0 ? images : ["/logo.svg"];
  const desktopImage = safeImages[0] ?? "/logo.svg";
  const mobileImage = safeImages[1] ?? desktopImage;
  const galleryImages = safeImages.length > 2
    ? safeImages.slice(2)
    : [desktopImage];

  return (
    <div class="relative flex flex-col md:flex-row even:md:flex-row-reverse not-first:border-t not-first:pt-16 not-first:mt-16 border-foreground gap-8 md:gap-16">
      <div class="md:flex-1 md:h-fit md:sticky md:top-1/4">
        <H variant="h3" class="mb-4 text-base md:text-2xl font-zodiak">
          {title}
        </H>
        <p class="mb-8">
          {description}
        </p>
      </div>
      <div class="md:flex-1">
        <div class="flex flex-row md:flex-row-reverse sticky top-14 inset-x-4 mb-8 justify-between">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium"
          >
            Visit
          </a>
          <Button
            class="flex flex-row gap-2 items-center justify-end"
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
        <div class="shadow">
          <img
            src={desktopImage}
            alt="Mockup"
            class="object-cover w-full aspect-square hidden md:block"
          />
          <img
            src={mobileImage}
            alt="Mockup"
            class="object-cover w-full aspect-square md:hidden"
          />
          <div class="flex flex-row flex-wrap">
            {galleryImages.map((image) => (
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
    </div>
  );
};
export default ProjectCard;
