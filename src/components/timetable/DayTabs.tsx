"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import { dayLabel } from "@/lib/i18n";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { FC } from "react";

interface DayTabsProps {
  dayNames: string[];
  selectedDayIndex: number;
  todayIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export const DayTabs: FC<DayTabsProps> = ({
  dayNames,
  selectedDayIndex,
  todayIndex,
  onSelect,
  className,
}) => {
  const locale = useLocale();
  const translate = useT();

  return (
    <div
      role="tablist"
      aria-label={translate("timetable.dayTabs")}
      className={cn(
        "border-lines bg-foreground/85 sticky top-0 z-20 flex border-b backdrop-blur-md",
        "relative",
        className,
      )}
    >
      {dayNames.map((dayName, dayIndex) => {
        const short = dayLabel(locale, dayName, "short");
        const date = getDayNumberForNextWeek(dayName);
        const isActive = dayIndex === selectedDayIndex;
        const isToday = dayIndex === todayIndex;

        return (
          <button
            key={dayName}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(dayIndex)}
            className={cn(
              isActive
                ? "text-primary"
                : "text-primary/45 active:text-primary/70",
              "relative flex min-h-12 w-full flex-col items-center justify-center gap-1 px-1 py-2.5 transition-colors select-none",
            )}
          >
            <span className="text-[13px] leading-none font-semibold">
              {short}
            </span>
            <span
              className={cn(
                isToday ? "text-accent-table" : "opacity-70",
                "tabular font-mono text-[11px] leading-none",
              )}
            >
              {date.dayNumber.toString().padStart(2, "0")}.
              {date.monthNumber.toString().padStart(2, "0")}
            </span>
          </button>
        );
      })}

      <span
        aria-hidden
        className="ease-out-quint pointer-events-none absolute -bottom-px left-0 flex h-0.5 transition-transform duration-300"
        style={{
          width: `${100 / dayNames.length}%`,
          transform: `translateX(${selectedDayIndex * 100}%)`,
        }}
      >
        <span className="bg-accent-table mx-3 h-full flex-1 rounded-full" />
      </span>
    </div>
  );
};
