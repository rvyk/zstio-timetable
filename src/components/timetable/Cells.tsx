"use client";

import { useT } from "@/components/common/LocaleProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { MAX_LESSONS } from "@/constants/settings";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { MinusIcon, PlusIcon } from "lucide-react";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";

const MIN_ADJUST_INDEX = 5;

const LESSON_MODES = [
  { value: "normal", label: "45'" },
  { value: "short", label: "30'" },
  { value: "custom", label: null },
] as const;

export const ShortLessonSwitcherCell: FC<{ className?: string }> = ({
  className,
}) => {
  const translate = useT();
  const isClient = useIsClient();
  const {
    lessonType,
    setLessonType,
    hoursAdjustIndex,
    enableCustomLessonsLength,
  } = useSettingsStore();

  const isCustom = lessonType === "custom";
  const { isMounted, presenceProps } = usePresence(isCustom);

  if (!isClient) {
    return (
      <div className={cn("px-3 py-2", className)}>
        <Skeleton className="rounded-lg max-md:h-11 max-md:w-full md:h-9 md:w-37.5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 px-3 py-2 max-md:flex-col-reverse max-md:items-stretch md:items-center",
        className,
      )}
    >
      {isMounted && (
        <div
          {...presenceProps}
          inert={!isCustom}
          className="border-lines bg-accent data-[state=open]:animate-rise data-[state=closed]:animate-fall flex shrink-0 items-center justify-between rounded-lg border px-1 max-md:h-11 md:h-9 md:justify-start"
        >
          <button
            aria-label={translate("lessons.earlier")}
            disabled={hoursAdjustIndex <= MIN_ADJUST_INDEX}
            onClick={() => enableCustomLessonsLength(hoursAdjustIndex - 1)}
            className="text-primary/50 hover:text-primary active:bg-primary/5 grid place-content-center rounded-md transition duration-150 active:scale-90 disabled:opacity-30 max-md:h-full max-md:w-12 md:size-7"
          >
            <MinusIcon
              className="max-md:size-4.5 md:size-3.5"
              strokeWidth={2}
            />
          </button>
          <span className="tabular text-primary w-20 text-center font-mono text-xs">
            {translate("lessons.from", { number: hoursAdjustIndex })}
          </span>
          <button
            aria-label={translate("lessons.later")}
            disabled={hoursAdjustIndex >= MAX_LESSONS}
            onClick={() => enableCustomLessonsLength(hoursAdjustIndex + 1)}
            className="text-primary/50 hover:text-primary active:bg-primary/5 grid place-content-center rounded-md transition duration-150 active:scale-90 disabled:opacity-30 max-md:h-full max-md:w-12 md:size-7"
          >
            <PlusIcon className="max-md:size-4.5 md:size-3.5" strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="border-lines bg-accent relative grid min-w-0 grid-cols-3 rounded-lg border p-0.75 max-md:h-11 max-md:w-full md:h-9 md:w-auto">
        <span
          aria-hidden
          className="ease-out-quint pointer-events-none absolute inset-y-0.75 left-0.75 flex transition-transform duration-300"
          style={{
            width: `calc((100% - 0.375rem) / 3)`,
            transform: `translateX(${LESSON_MODES.findIndex(({ value }) => value === lessonType) * 100}%)`,
          }}
        >
          <span className="bg-foreground flex-1 rounded-md shadow-(--shadow-soft)" />
        </span>

        {LESSON_MODES.map(({ value, label: rawLabel }) => {
          const label = rawLabel ?? translate("lessons.mode.custom");
          const active = lessonType === value;
          return (
            <button
              key={value}
              aria-label={translate("lessons.mode.aria", { label })}
              aria-pressed={active}
              onClick={() =>
                value === "custom"
                  ? enableCustomLessonsLength(hoursAdjustIndex)
                  : setLessonType(value)
              }
              className={cn(
                active
                  ? "text-primary"
                  : "text-primary/50 hover:text-primary/80",
                "tabular relative rounded-md px-2.5 font-mono text-xs font-medium whitespace-nowrap transition-colors",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
