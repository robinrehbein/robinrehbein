import { cva, VariantProps } from "class-variance-authority";
import { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils.ts";

const headingVariants = cva(
  "font-clash-display w-fit",
  {
    variants: {
      variant: {
        h1: "text-4xl font-semibold",
        h2: "text-2xl font-medium",
        h3: "text-xl font-medium",
        h4: "text-lg",
        h5: "text-md",
        h6: "text-sm",
      },
    },
    //   defaultVariants: {
    //     variant: "h1",
    //   },
  },
);

type HeadingProps =
  & JSX.HTMLAttributes<HTMLHeadingElement>
  & VariantProps<typeof headingVariants>
  & {
    children: string | ComponentChildren | Array<string | ComponentChildren>;
  };

const H = (props: HeadingProps) => {
  const { variant, children, class: className } = props;
  const Tag = variant || "h1";

  return (
    <Tag className={cn(headingVariants({ variant, className }))}>
      {children}
    </Tag>
  );
};

export default H;
