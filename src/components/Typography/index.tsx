// typography.ts// typography.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, type ElementType } from "react";
import { Slot } from "@radix-ui/react-slot";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      subtle: "text-sm text-muted-foreground",
    },
    size: {
      default: "",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      default: "",
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    textColor: {
      default: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "p",
    size: "default",
    weight: "default",
    align: "left",
    textColor: "default",
  },
});

type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export interface TypographyProps extends TypographyVariantProps {
  asChild?: boolean;
  as?: ElementType;
  className?: string;
  children?: React.ReactNode;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      textColor,
      as: Tag = "p",
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : Tag;

    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({
            variant,
            size,
            weight,
            align,
            textColor,
            className,
          }),
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
