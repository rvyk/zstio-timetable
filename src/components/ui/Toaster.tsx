"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { TOAST_DURATION, useToasts } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useToasts((state) => state.toasts);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, icon: Icon, ...props }) => {
        const isError = props.variant === "error";

        return (
          <Toast
            key={id}
            className={cn(!description && "items-center")}
            {...props}
          >
            {Icon && (
              <Icon
                className={cn(
                  "size-4.5 shrink-0",
                  description && "mt-0.5",
                  isError ? "text-accent-table" : "text-accent-success",
                )}
                strokeWidth={2}
              />
            )}
            <div className="min-w-0 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
            <span
              aria-hidden
              className={cn(
                "animate-toast-countdown group-focus-within:paused group-hover:paused absolute inset-x-0 bottom-0 h-0.5 origin-left motion-reduce:hidden",
                isError ? "bg-accent-table/70" : "bg-accent-success/70",
              )}
              style={
                {
                  "--toast-duration": `${props.duration ?? TOAST_DURATION}ms`,
                } as React.CSSProperties
              }
            />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
