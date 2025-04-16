import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer disabled:bg-nutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-700 border border-neutral-200 shadow-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-emerald-700 to-primary text-primary-foreground shadow-xs hover:to-primary hover:from-primary",
        destructive:
          "bg-gradient-to-b from-[#FF5630] to-[#DE350B] text-white shadow-xs hover:from-[#DE350B] hover:to-[#DE350B] ",
        outline:
          "border bg-background shadow-xs  hover:bg-[#F4F5F7] hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-[#FAFBFC] text-secondary-foreground shadow-xs hover:bg-[#F4F5F7] border-transparent shadow-none",
        ghost:
          " hover:bg-[#F4F5F7] hover:text-accent-foreground dark:hover:bg-accent/50 border-transparent border-transparent shadow-none",
        muted: "bg-[#EBECF0] text-neutral-600 hover:bg-[#EBECF0]/80",
        teritrary:
          "bg-violet-50 text-[#0052CC] hover:bg-violet-100 border-transparent shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
