"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { useToasts } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useToasts((state) => state.toasts);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, icon: Icon, ...props }) => {
        const isError = props.variant === "error";

        return (
          <Toast key={id} {...props}>
            {Icon && (
              <Icon
                className={cn(
                  isError ? "text-accent-table" : "text-primary/45",
                  "mt-0.5 size-4 shrink-0",
                )}
                strokeWidth={1.75}
              />
            )}
            <div className="min-w-0 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
