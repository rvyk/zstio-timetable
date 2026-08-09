"use client";

import { DAYS_OF_WEEK } from "@/constants/days";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { FC } from "react";

interface DayTabsProps {
  dayNames: string[];
  selectedDayIndex: number;
  todayIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

/**
 * Dzień wybrany i dzień dzisiejszy to dwie różne informacje: pierwszą niesie
 * podkreślenie i kontrast tekstu, drugą kolor daty. Dzięki temu w czwartek
 * widać, gdzie jest „dziś", nawet gdy ogląda się poniedziałek.
 */
export const DayTabs: FC<DayTabsProps> = ({
  dayNames,
  selectedDayIndex,
  todayIndex,
  onSelect,
  className,
}) => (
  <div
    role="tablist"
    aria-label="Dzień tygodnia"
    className={cn(
      "border-lines bg-foreground/85 sticky top-0 z-20 flex border-b backdrop-blur-md",
      className,
    )}
  >
    {dayNames.map((dayName, dayIndex) => {
      const short = DAYS_OF_WEEK.find((day) => day.long === dayName)?.short;
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
            {short ?? dayName}
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
          {isActive && (
            <span className="bg-accent-table absolute inset-x-3 -bottom-px h-0.5 rounded-full" />
          )}
        </button>
      );
    })}
  </div>
);
