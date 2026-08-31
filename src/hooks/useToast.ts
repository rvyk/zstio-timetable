"use client";

import type { ToastProps } from "@/components/ui/Toast";
import { CircleCheck, CircleX, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { create } from "zustand";

const TOAST_LIMIT = 3;
export const TOAST_DURATION = 5000;
const REMOVE_DELAY = 400;

const ICONS = { success: CircleCheck, error: CircleX };

export type ToastItem = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
};

export const useToasts = create<{ toasts: ToastItem[] }>(() => ({
  toasts: [],
}));

const patch = (update: (toasts: ToastItem[]) => ToastItem[]) =>
  useToasts.setState((state) => ({ toasts: update(state.toasts) }));

let count = 0;

export const toast = ({
  variant,
  icon,
  ...props
}: Omit<ToastItem, "id" | "open" | "onOpenChange">) => {
  const id = (++count).toString();
  const kind = variant ?? "success";

  const close = () => {
    patch((toasts) =>
      toasts.map((item) => (item.id === id ? { ...item, open: false } : item)),
    );
    setTimeout(
      () => patch((toasts) => toasts.filter((item) => item.id !== id)),
      REMOVE_DELAY,
    );
  };

  useToasts.setState((state) => ({
    toasts: [
      {
        ...props,
        id,
        variant: kind,
        duration: props.duration ?? TOAST_DURATION,
        icon: icon ?? ICONS[kind],
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) close();
        },
      },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }));
};

export const showErrorToast = (title: string, description: string) =>
  toast({ title, description, variant: "error" });
