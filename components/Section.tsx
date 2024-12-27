import { JSX } from "preact";
import { cn } from "../lib/utils.ts";

const Section = (props: JSX.HTMLAttributes<HTMLElement>) => {
  return (
    <section class={cn("max-w-screen-lg mx-auto", props.class)}>
      <hr class={"my-8"} />
      {props.children}
    </section>
  );
};

export default Section;
