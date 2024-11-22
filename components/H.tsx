import { cva, VariantProps } from "class-variance-authority";
import { JSX } from "preact";
import { cn } from "../lib/utils.ts";

const headingVariants = cva("font-semibold", {
  variants: {
    variant: {
      h1: "text-4xl",
      h2: "text-sm",
      h3: "text-xl",
    },
  },
  //   defaultVariants: {
  //     variant: "h1",
  //   },
});

type HeadingProps =
  & JSX.HTMLAttributes<HTMLHeadingElement>
  & VariantProps<typeof headingVariants>
  & {
    children: string;
  };

const H = (props: HeadingProps) => {
  const { variant, children } = props;
  const Tag = variant || "h1";

  return (
    <Tag className={cn(headingVariants({ variant }))}>
      {children}
    </Tag>
  );
};

export default H;
