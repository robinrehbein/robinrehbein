import H from "../components/atoms/H.tsx";
import Section from "../components/atoms/Section.tsx";
import {
  IconArrowDown,
  IconCircle,
  IconHeartedHands,
  IconPin,
  IconReact,
  IconSeparator,
} from "../components/Icons.tsx";
import { Button } from "../components/atoms/Button.tsx";

const Imprint = () => {
  return (
    <>
      <Section separator={false}>
        <div class={"flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8 md:gap-16"}>
          <H class={"inline-flex flex-wrap gap-2 text-md font-medium font-zodiak"} variant={"h1"}>
            <span>
              <IconHeartedHands class={"size-6"} />
            </span>
            <p>Robin Rehbein Portfolio</p>

            <span class={"hidden md:inline"}>
              <IconSeparator class={"size-6"} />
            </span>
            <p class={"inline-flex items-center gap-2"}>
              <span class="relative w-6 h-6 inline-flex items-center justify-center">
                <IconCircle class={"size-3 absolute text-red-800"} />
                <IconCircle class={"size-3 animate-ping text-red-800"} />
              </span>
              <span class="line-through">Unavailable</span> for projects
            </p>
          </H>
          <div class={"font-zodiak font-medium flex flex-col gap-1"}>
            <p className={"inline-flex items-center gap-2"}>
              <span>
                <IconReact class={"size-6"} />
              </span>
              Currently coding at
              <a href="https://mimacom.com" className={"underline decoration-wavy decoration-[#FF0651]"}>
                mimacom
              </a>
            </p>
            <p class={"inline-flex items-center gap-2"}>
              <span>
                <IconPin class={"size-6"} />
              </span>
              Based in Stuttgart, Germany
            </p>
          </div>
        </div>

        <H class={"font-clash-display uppercase font-medium text-[clamp(3rem,8vw,8rem)] leading-none mb-24"} variant={"h2"}>
          <span>Imprint.</span>
        </H>

        <ul className={"flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap"}>
          <li class={"flex items-center gap-2 grow justify-end my-4 md:my-0"}>
            <Button>
              <a href={"/"} class={"flex flex-row gap-2 items-center"}>
                Back
                <IconArrowDown class={"rotate-90 size-4"} />
              </a>
            </Button>
          </li>
        </ul>
      </Section>

      <Section>
        <div class="font-zodiak max-w-3xl">
          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Angaben gemäß § 5 TMG</H>
          <p class="mb-12">
            Robin Rehbein<br />
            [Straße und Hausnummer]<br />
            [PLZ und Ort]
          </p>

          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Kontakt</H>
          <p class="mb-12">
            E-Mail: <a href="mailto:hello@robinrehbein.de" class="underline decoration-wavy decoration-mustard-yellow-950">hello@robinrehbein.de</a>
          </p>

          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Umsatzsteuer-ID</H>
          <p class="mb-12">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            [Umsatzsteuer-ID]
          </p>

          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</H>
          <p class="mb-12">
            Robin Rehbein<br />
            [Straße und Hausnummer]<br />
            [PLZ und Ort]
          </p>
        </div>
      </Section>
    </>
  );
};

export default Imprint;
