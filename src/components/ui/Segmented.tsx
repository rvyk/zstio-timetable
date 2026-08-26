"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
  lang?: string;
}

interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  inactiveClassName?: string;
  keepTransition?: boolean;
}

export const Segmented = <T extends string>({
  options,
  value,
  onSelect,
  className,
  buttonClassName,
  inactiveClassName = "text-primary/45 hover:text-primary",
  keepTransition,
}: SegmentedProps<T>) => {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      className={cn(
        "border-lines bg-accent relative grid rounded-lg border p-0.75",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      <span
        aria-hidden
        data-keep-transition={keepTransition ? "" : undefined}
        className="ease-out-quint pointer-events-none absolute inset-y-0.75 left-0.75 flex transition-transform duration-300"
        style={{
          width: `calc((100% - 0.375rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      >
        <span className="bg-foreground flex-1 rounded-md shadow-(--shadow-soft)" />
      </span>

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          aria-pressed={option.value === value}
          aria-label={option.ariaLabel}
          lang={option.lang}
          className={cn(
            option.value === value ? "text-primary" : inactiveClassName,
            "relative rounded-md transition-colors",
            buttonClassName,
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
