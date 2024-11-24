import H from "../components/H.tsx";
import Timeline from "../components/Timeline.tsx";
import Synthwave from "../islands/Synthwave.tsx";

export default function Home() {
  return (
    <>
      <section class="text-center relative">
        <div
          class={"z-10 top-1/4 absolute left-1/2 -translate-x-1/2"}
        >
          <H variant={"h1"}>Robin Rehbein</H>
          <H variant={"h2"}>Fullstack Developer</H>
        </div>
        <Synthwave />
      </section>
      <section>
        <Timeline />
      </section>
    </>
  );
}
