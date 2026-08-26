"use client";

import { useT } from "@/components/common/LocaleProvider";
import { Segmented } from "@/components/ui/Segmented";
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
        <Skeleton className="h-9 rounded-lg max-md:w-full md:w-37.5" />
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
          className="border-lines bg-accent data-[state=open]:animate-rise data-[state=closed]:animate-fall flex h-9 shrink-0 items-center justify-between rounded-lg border px-1 md:justify-start"
        >
          <button
            aria-label={translate("lessons.earlier")}
            disabled={hoursAdjustIndex <= MIN_ADJUST_INDEX}
            onClick={() => enableCustomLessonsLength(hoursAdjustIndex - 1)}
            className="text-primary active:bg-primary/5 grid place-content-center rounded-md opacity-65 transition duration-150 hover:opacity-100 active:scale-90 disabled:opacity-30 max-md:h-full max-md:w-12 md:size-7"
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
            className="text-primary active:bg-primary/5 grid place-content-center rounded-md opacity-65 transition duration-150 hover:opacity-100 active:scale-90 disabled:opacity-30 max-md:h-full max-md:w-12 md:size-7"
          >
            <PlusIcon className="max-md:size-4.5 md:size-3.5" strokeWidth={2} />
          </button>
        </div>
      )}

      <Segmented
        options={LESSON_MODES.map(({ value, label: rawLabel }) => {
          const label = rawLabel ?? translate("lessons.mode.custom");
          return {
            value,
            label,
            ariaLabel: translate("lessons.mode.aria", { label }),
          };
        })}
        value={lessonType}
        onSelect={(value) =>
          value === "custom"
            ? enableCustomLessonsLength(hoursAdjustIndex)
            : setLessonType(value)
        }
        className="h-9 min-w-0 max-md:w-full md:w-auto"
        buttonClassName="tabular px-2.5 font-mono text-xs font-medium whitespace-nowrap"
        inactiveClassName="text-primary/65 hover:text-primary/88"
      />
    </div>
  );
};
