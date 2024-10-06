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
    success: "text-green-500",
    error: "text-red-200",
  };

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        icon: LucideIcon,
        iconColor,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="inline-flex items-center gap-x-3">
              {LucideIcon && (
                <LucideIcon
                  color={iconColor}
                  className={cn(
                    "aspect-square h-5 min-w-5",
                    iconStyles[props.variant ?? "success"],
                  )}
                />
              )}
              <div className="grid">
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
