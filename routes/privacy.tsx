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

const Privacy = () => {
  return (
    <>
      <Section separator={false}>
        <div class="flex flex-col md:flex-row items-start justify-between mb-24 md:mb-64 gap-8 md:gap-16">
          <H
            class="inline-flex flex-wrap gap-2 text-md font-medium font-zodiak"
            variant="h1"
          >
            <span>
              <IconHeartedHands class="size-6" />
            </span>
            <p>Robin Rehbein Portfolio</p>

            <span class="hidden md:inline">
              <IconSeparator class="size-6" />
            </span>
            <p class="inline-flex items-center gap-2">
              <span class="relative w-6 h-6 inline-flex items-center justify-center">
                <IconCircle class="size-3 absolute text-red-800" />
                <IconCircle class="size-3 animate-ping text-red-800" />
              </span>
              <span class="line-through">Unavailable</span> for projects
            </p>
          </H>
          <div class="font-zodiak font-medium flex flex-col gap-1">
            <p className="inline-flex items-center gap-2">
              <span>
                <IconReact class="size-6" />
              </span>
              Currently coding at
              <a
                href="https://mimacom.com"
                className="underline decoration-wavy decoration-[#FF0651]"
              >
                mimacom
              </a>
            </p>
            <p class="inline-flex items-center gap-2">
              <span>
                <IconPin class="size-6" />
              </span>
              Based in Stuttgart, Germany
            </p>
          </div>
        </div>

        <H
          class="font-clash-display uppercase font-medium text-[clamp(3rem,8vw,8rem)] leading-none mb-24"
          variant="h2"
        >
          <span>Privacy.</span>
        </H>

        <ul className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap">
          <li class="flex items-center gap-2 grow justify-end my-4 md:my-0">
            <a href="/" class="flex flex-row gap-2 items-center">
              Back
              <IconArrowDown class="rotate-90 size-4" />
            </a>
          </li>
        </ul>
      </Section>

      <Section>
        <div class="font-zodiak max-w-3xl">
          <H
            variant="h3"
            class="text-2xl font-medium mb-8 uppercase font-clash-display"
          >
            Datenschutz­erklärung
          </H>
          <H
            variant="h4"
            class="text-xl font-medium mb-4 uppercase font-clash-display"
          >
            1. Datenschutz auf einen Blick
          </H>
          <p class="mb-8 font-medium italic">Allgemeine Hinweise</p>
          <p class="mb-12">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können. Ausführliche Informationen
            zum Thema Datenschutz entnehmen Sie unserer unter diesem Text
            aufgeführten Datenschutzerklärung.
          </p>

          <H
            variant="h4"
            class="text-xl font-medium mb-4 uppercase font-clash-display"
          >
            2. Datenerfassung auf dieser Website
          </H>
          <p class="mb-8 font-medium italic">
            Wer ist verantwortlich für die Datenerfassung auf dieser Website?
          </p>
          <p class="mb-12">
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
            „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung
            entnehmen.
          </p>

          <p class="mb-8 font-medium italic">Wie erfassen wir Ihre Daten?</p>
          <p class="mb-12">
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
            mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in
            ein Kontaktformular eingeben. Andere Daten werden automatisch oder
            nach Ihrer Einwilligung beim Besuch der Website durch unsere
            IT-Systeme erfasst. Das sind vor allem technische Daten (z. B.
            Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die
            Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website
            betreten.
          </p>
        </div>
      </Section>
    </>
  );
};

export default Privacy;
