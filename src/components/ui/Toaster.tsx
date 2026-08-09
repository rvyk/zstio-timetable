"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  const iconStyles = {
    success: "text-accent-success",
    error: "text-accent-table",
  };

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        icon: LucideIcon,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex min-w-0 items-start gap-x-2.5">
              {LucideIcon && (
                <LucideIcon
                  className={cn(
                    "mt-px size-4 shrink-0",
                    iconStyles[props.variant ?? "success"],
                  )}
                  strokeWidth={1.75}
                />
              )}
              <div className="min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
