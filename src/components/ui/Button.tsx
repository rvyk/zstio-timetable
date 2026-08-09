import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background border border-primary/10 shadow-(--shadow-soft) hover:bg-primary/88 dark:bg-accent dark:text-primary/85 dark:hover:bg-accent-secondary dark:hover:text-primary",
        primary:
          "bg-accent-table border border-black/10 text-white shadow-(--shadow-soft) hover:brightness-110",
        secondary:
          "text-primary/90 bg-accent border border-lines hover:bg-primary/5 hover:text-primary",
        icon: "bg-accent text-primary/70 border border-lines hover:bg-primary/5 hover:text-primary dark:hover:bg-accent-secondary",
        sidebarItem:
          "rounded-md border justify-start border-transparent py-2.5 pl-4 pr-3 text-left text-xs sm:text-sm font-medium text-primary/70 hover:bg-primary/5 hover:text-primary",
        sidebarItemActive:
          "justify-start text-xs sm:text-sm font-semibold text-primary border-transparent! bg-primary/[0.07] hover:bg-primary/10! relative before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.75 before:-translate-y-1/2 before:rounded-r-full before:bg-accent-table",
      },
      size: {
        default: "h-10 px-4 py-2",
        fit: "h-fit",
        // 44px na dotyku, 40px pod myszą
        icon: "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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
