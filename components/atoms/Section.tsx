import { JSX } from "preact";
import { cn } from "../../lib/utils.ts";

const Section = (
  { separator = true, ...props }: JSX.HTMLAttributes<HTMLElement> & {
    separator?: boolean;
  },
) => {
  return (
    <section
      {...props}
      class={cn("max-w-screen-2xl mx-auto px-8 font-zodiak", props.class)}
    >
      {separator && <hr class={"my-16 border-foreground"} />}
      {props.children}
    </section>
  );
};

export default Section;
