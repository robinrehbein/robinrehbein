import H from "../components/H.tsx";
import Timeline from "../components/Timeline.tsx";
import Synthwave from "../islands/Synthwave.tsx";

export default function Home() {
  return (
    <>
      <section class="p-4 mx-auto text-center min-h-screen flex flex-col items-center justify-center">
        <H variant={"h1"}>Robin Rehbein</H>
        <H variant={"h2"}>Fullstack Developer</H>
        <Synthwave />
      </section>
      <section>
        <Timeline />
      </section>
    </>
  );
}
