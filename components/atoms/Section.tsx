import { JSX } from "preact";
import { cn } from "../../lib/utils.ts";

const Section = (
  { separator = true, ...props }: JSX.HTMLAttributes<HTMLElement> & {
    separator?: boolean;
  },
) => {
  return (
    <section
      class={cn("max-w-screen-2xl mx-auto p-8", props.class)}
    >
      {separator && <hr class={"my-8 border-foreground"} />}
      {props.children}
    </section>
  );
};

export default Section;
