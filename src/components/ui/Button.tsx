import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/90 dark:bg-accent border border-primary/10 text-accent/90 dark:text-primary/80 hover:dark:bg-primary/10 hover:text-accent/90 hover:dark:text-primary/90",
        primary:
          "bg-accent-table border border-accent-table/10 text-accent/90 dark:text-primary/90 hover:bg-accent-table/90",
        secondary:
          "text-primary/90 bg-primary/10 border border-primary/10 hover:bg-primary/20 dark:bg-accent hover:dark:bg-primary/10",
        icon: "bg-primary hover:bg-primary/90 dark:bg-accent border border-primary/10 text-accent/90 dark:text-primary/80 rounded-md hover:dark:bg-primary/10 hover:text-accent/90 hover:dark:text-primary/90",
        sidebarItem:
          "rounded-md border justify-start border-transparent py-3 pl-6 pr-3 text-left text-sm font-semibold text-primary/80 transition-all hover:border-primary/5 hover:bg-primary/5 dark:font-medium hover:dark:bg-primary/5",
        sidebarItemActive:
          "!border-primary/5 justify-start bg-primary/5 hover:border-primary/10 hover:!bg-primary/10 dark:!bg-primary/5 hover:dark:!bg-primary/10 font-semibold dark:font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        fit: "h-fit",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
