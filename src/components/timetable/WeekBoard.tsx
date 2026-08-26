"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import { dayLabel } from "@/lib/i18n";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";
import { DaySlots, buildDaySlots, useNowSeconds } from "./Slots";

interface WeekBoardProps {
  dayNames: string[];
  lessons: TableLesson[][][];
  hours: TableHour[];
  todayIndex: number;
}

export const WeekBoard: FC<WeekBoardProps> = ({
  dayNames,
  lessons,
  hours,
  todayIndex,
}) => {
  const locale = useLocale();
  const translate = useT();
  const now = useNowSeconds();

  return (
    <div className="@container/board isolate px-4 pb-4">
      <div className="grid grid-cols-1 gap-x-3 gap-y-7 @lg/board:grid-cols-2 @2xl/board:grid-cols-3 @3xl/board:grid-cols-4 @4xl/board:grid-cols-5">
        {dayNames.map((dayName, dayIndex) => {
          const date = getDayNumberForNextWeek(dayName);
          const isToday = dayIndex === todayIndex;
          const slots = buildDaySlots(hours, lessons[dayIndex]);

          return (
            <section
              key={dayName}
              className="animate-rise flex min-w-0 flex-col gap-2"
              style={{ animationDelay: `${dayIndex * 45}ms` }}
            >
              <header className="bg-foreground sticky top-0 z-10 -mb-2 pt-4 pb-4">
                <div
                  className={cn(
                    "flex items-baseline gap-2 rounded-lg border px-3 py-2",
                    isToday
                      ? "border-accent-table/40 bg-accent-table/[0.07]"
                      : "border-lines/70 bg-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      isToday ? "text-accent-table" : "text-primary",
                      "tabular text-lg leading-none font-semibold tracking-tight",
                    )}
                  >
                    {date.dayNumber.toString().padStart(2, "0")}
                  </span>
                  <h2
                    className={cn(
                      isToday ? "text-primary" : "text-primary/60",
                      "text-sm leading-none font-medium",
                    )}
                  >
                    {dayLabel(locale, dayName, "long")}
                  </h2>
                  {isToday && (
                    <span className="bg-accent-table/12 text-accent-table ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
                      {translate("timetable.today")}
                    </span>
                  )}
                </div>
              </header>

              {slots.length > 0 ? (
                <DaySlots slots={slots} isToday={isToday} now={now} />
              ) : (
                <p className="text-primary/30 px-3 py-2 text-xs">
                  {translate("timetable.noLessons")}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
