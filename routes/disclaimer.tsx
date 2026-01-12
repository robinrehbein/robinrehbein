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

const Disclaimer = () => {
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
          <span>Disclaimer.</span>
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
          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Haftung für Inhalte</H>
          <p class="mb-12">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <H variant="h3" class="text-2xl font-medium mb-8 uppercase font-clash-display">Haftung für Links</H>
          <p class="mb-12">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </div>
      </Section>
    </>
  );
};

export default Disclaimer;
