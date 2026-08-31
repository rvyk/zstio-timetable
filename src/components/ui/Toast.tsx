"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-100 flex max-h-screen flex-col gap-y-2 p-3 md:right-0 md:bottom-0 md:left-auto md:w-95 md:p-4",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const TOAST_BASE =
  "group pointer-events-auto relative flex w-full items-start gap-x-3 overflow-hidden rounded-xl border p-3.5 shadow-(--shadow-raised) transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full";

const TOAST_VARIANTS = {
  success:
    "border-accent-success/30 bg-[color-mix(in_oklab,var(--color-accent-success)_7%,var(--color-foreground))]",
  error:
    "destructive border-accent-table/30 bg-[color-mix(in_oklab,var(--color-accent-table)_7%,var(--color-foreground))]",
};

export type ToastVariant = keyof typeof TOAST_VARIANTS;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: ToastVariant;
  }
>(({ className, variant = "success", ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(TOAST_BASE, TOAST_VARIANTS[variant], className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    aria-label="Zamknij powiadomienie"
    className={cn(
      "text-primary/60 hover:bg-primary/5 hover:text-primary -my-1 -mr-1 grid size-8 shrink-0 place-content-center rounded-md transition-colors",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" strokeWidth={2} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-primary text-sm leading-snug font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-primary/70 mt-0.5 text-xs leading-snug", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
};
