import { JSX } from "preact";
import { cn } from "../../lib/utils.ts";

const Section = (
  { separator = true, ...props }: JSX.HTMLAttributes<HTMLElement> & {
    separator?: boolean;
  },
) => {
  return (
    <section
      class={cn("max-w-screen-2xl mx-auto px-8", props.class)}
      {...props}
    >
      {separator && <hr class={"my-16 border-foreground"} />}
      {props.children}
    </section>
  );
};

export default Section;
