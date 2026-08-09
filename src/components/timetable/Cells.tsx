"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { MAX_LESSONS } from "@/constants/settings";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { MinusIcon, PlusIcon } from "lucide-react";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";

/** Pierwsza lekcja nie ma od czego liczyć skrócenia — poprzedniej brak. */
const MIN_ADJUST_INDEX = 2;

const LESSON_MODES = [
  { value: "normal", label: "45'" },
  { value: "short", label: "30'" },
  { value: "custom", label: "Od lekcji" },
] as const;

/**
 * Trzeci tryb zastępuje dawny kalkulator w oknie modalnym: zamiast liczyć
 * godziny obok planu, skracamy je wprost w planie i widać efekt od razu.
 */
export const ShortLessonSwitcherCell: FC<{ className?: string }> = ({
  className,
}) => {
  const isClient = useIsClient();
  const {
    lessonType,
    setLessonType,
    hoursAdjustIndex,
    enableCustomLessonsLength,
  } = useSettingsStore();

  if (!isClient) {
    return (
      <div className={cn("px-3 py-2", className)}>
        <Skeleton className="rounded-lg max-md:h-11 max-md:w-full md:h-9 md:w-37.5" />
      </div>
    );
  }

  const isCustom = lessonType === "custom";

  return (
    /* col-reverse: na telefonie stepper nie mieści się obok przełącznika
       („Od lekcji" łamie się na dwie linie), więc schodzi pod niego —
       a że jest doprecyzowaniem trybu, czyta się to w naturalnej kolejności */
    <div
      className={cn(
        "flex gap-2 px-3 py-2 max-md:flex-col-reverse max-md:items-stretch md:items-center",
        className,
      )}
    >
      {isCustom && (
        <div className="border-lines bg-accent flex shrink-0 items-center justify-between rounded-lg border px-1 max-md:h-11 md:h-9 md:justify-start">
          <button
            aria-label="Wcześniejsza lekcja"
            disabled={hoursAdjustIndex <= MIN_ADJUST_INDEX}
            onClick={() => enableCustomLessonsLength(hoursAdjustIndex - 1)}
            className="text-primary/50 hover:text-primary grid place-content-center rounded transition-colors disabled:opacity-30 max-md:size-9 md:size-7"
          >
            <MinusIcon className="size-3.5" strokeWidth={2} />
          </button>
          <span className="tabular text-primary w-20 text-center font-mono text-xs">
            od {hoursAdjustIndex}. lekcji
          </span>
          <button
            aria-label="Późniejsza lekcja"
            disabled={hoursAdjustIndex >= MAX_LESSONS}
            onClick={() => enableCustomLessonsLength(hoursAdjustIndex + 1)}
            className="text-primary/50 hover:text-primary grid place-content-center rounded transition-colors disabled:opacity-30 max-md:size-9 md:size-7"
          >
            <PlusIcon className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="border-lines bg-accent flex min-w-0 flex-1 gap-1 rounded-lg border p-0.75 max-md:h-11 md:h-9 md:flex-none">
        {LESSON_MODES.map(({ value, label }) => {
          const active = lessonType === value;
          return (
            <button
              key={value}
              aria-label={`Lekcje ${label}`}
              aria-pressed={active}
              onClick={() =>
                value === "custom"
                  ? enableCustomLessonsLength(hoursAdjustIndex)
                  : setLessonType(value)
              }
              className={cn(
                active
                  ? "bg-foreground text-primary shadow-(--shadow-soft)"
                  : "text-primary/50 hover:text-primary/80",
                "tabular flex-1 rounded-md px-2.5 font-mono text-xs font-medium whitespace-nowrap transition-colors md:flex-none",
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
