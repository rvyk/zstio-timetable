"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import { dayLabel } from "@/lib/i18n";
import { cn, getDayNumberForNextWeek, parseTime } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, Fragment, useRef } from "react";
import { LessonEntry } from "./LessonCells";
import { BreakMarker, formatCountdown, useNowSeconds } from "./Slots";
import { useFillerRows } from "./useFillerRows";

interface TableBoardProps {
  dayNames: string[];
  lessons: TableLesson[][][];
  hours: TableHour[];
  todayIndex: number;
}

export const TableBoard: FC<TableBoardProps> = ({
  dayNames,
  lessons,
  hours,
  todayIndex,
}) => {
  const locale = useLocale();
  const translate = useT();
  const now = useNowSeconds();

  const lastTakenHour = hours.reduce(
    (last, _, hourIndex) =>
      lessons.some((day) => (day[hourIndex]?.length ?? 0) > 0)
        ? hourIndex
        : last,
    -1,
  );
  const visibleHours = hours.slice(0, lastTakenHour + 1);
  const isSchoolDay = todayIndex >= 0 && todayIndex < dayNames.length;

  const tableRef = useRef<HTMLTableElement>(null);
  const filler = useFillerRows(tableRef, "[data-plan-scroll]", 16, [
    visibleHours.length,
    dayNames.length,
  ]);

  return (
    <div className="animate-rise @container/table px-4 pb-4">
      <table
        ref={tableRef}
        className={cn(
          "w-full table-fixed border-separate border-spacing-0 text-left",
          "[&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2.5",
          "@3xl/table:[&_td]:px-3 @3xl/table:[&_td]:py-3 @3xl/table:[&_th]:py-3",
          "[&_h3]:truncate [&_h3]:text-[13px] @3xl/table:[&_h3]:text-[15px]",
          "[&_h3+div]:flex-nowrap [&_h3+div]:overflow-hidden [&_h3+div]:text-[11px] @3xl/table:[&_h3+div]:text-xs",
          "[&_h3+div>span]:min-w-0 [&_h3+div>span]:truncate",
        )}
      >
        <thead>
          <tr>
            <th className="border-lines bg-foreground sticky top-0 z-20 w-20 border-b align-bottom @3xl/table:w-24">
              <span className="text-primary/40 text-[10px] font-semibold tracking-[0.08em] uppercase">
                {translate("timetable.hour")}
              </span>
            </th>
            {dayNames.map((dayName, dayIndex) => {
              const date = getDayNumberForNextWeek(dayName);
              const isToday = dayIndex === todayIndex;

              return (
                <th
                  key={dayName}
                  className={cn(
                    "border-lines bg-foreground sticky top-0 z-20 border-b align-bottom",
                    isToday && "border-accent-table/60",
                  )}
                >
                  <div className="flex min-w-0 items-baseline gap-1.5">
                    <span
                      className={cn(
                        isToday ? "text-accent-table" : "text-primary/45",
                        "tabular font-mono text-[11px] font-semibold",
                      )}
                    >
                      {date.dayNumber.toString().padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        isToday ? "text-primary" : "text-primary/70",
                        "truncate text-xs leading-tight font-medium tracking-[-0.01em] @3xl/table:text-[13px]",
                      )}
                    >
                      <span className="@2xl/table:hidden">
                        {dayLabel(locale, dayName, "short")}
                      </span>
                      <span className="@max-2xl/table:hidden">
                        {dayLabel(locale, dayName, "long")}
                      </span>
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleHours.map((hour, hourIndex) => {
            const start = parseTime(hour.timeFrom);
            const end = parseTime(hour.timeTo);
            const isLiveHour = now >= start && now < end;
            const isLast =
              hourIndex === visibleHours.length - 1 && filler.count === 0;
            const previousEnd =
              hourIndex > 0
                ? parseTime(visibleHours[hourIndex - 1]!.timeTo)
                : undefined;
            const isBreak =
              isSchoolDay &&
              previousEnd !== undefined &&
              now >= previousEnd &&
              now < start;
            const nextStart =
              hourIndex < visibleHours.length - 1
                ? parseTime(visibleHours[hourIndex + 1]!.timeFrom)
                : undefined;
            const isBreakAfter =
              isSchoolDay &&
              nextStart !== undefined &&
              now >= end &&
              now < nextStart;
            const breakPad = cn(isBreak && "pt-6!", isBreakAfter && "pb-6!");

            return (
              <Fragment key={hour.number}>
                {isBreak && (
                  <tr>
                    <td
                      colSpan={dayNames.length + 1}
                      className="relative border-0"
                      style={{ padding: 0, height: 0, lineHeight: 0 }}
                    >
                      <BreakMarker
                        from={visibleHours[hourIndex - 1]!.timeTo}
                        to={hour.timeFrom}
                        now={now}
                      />
                    </td>
                  </tr>
                )}
                <tr
                  data-hour
                  className={cn("group", hourIndex % 2 === 1 && "bg-accent/45")}
                >
                  <td
                    className={cn(
                      "group-hover:bg-accent/75 align-top transition-colors",
                      !isLast && "border-lines/40 border-b",
                      breakPad,
                    )}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={cn(
                          isLiveHour ? "text-accent-table" : "text-primary/85",
                          "tabular text-[16px] leading-none font-semibold",
                        )}
                      >
                        {hour.number}
                      </span>
                      <span className="text-primary/40 tabular text-center text-[10px] leading-tight tracking-tight whitespace-nowrap">
                        {hour.timeFrom}–{hour.timeTo}
                      </span>
                      {isLiveHour && (
                        <Fragment>
                          <div className="bg-primary/10 mt-0.5 h-0.5 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-accent-table h-full transition-[width] duration-1000 ease-linear"
                              style={{
                                width: `${((now - start) / (end - start)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-accent-table tabular font-mono text-[9px] leading-none font-semibold">
                            {formatCountdown(end - now)}
                          </span>
                        </Fragment>
                      )}
                    </div>
                  </td>

                  {dayNames.map((dayName, dayIndex) => {
                    const entries = lessons[dayIndex]?.[hourIndex] ?? [];
                    const isToday = dayIndex === todayIndex;
                    const isNow = isLiveHour && isToday;

                    return (
                      <td
                        key={dayName}
                        className={cn(
                          "border-lines/40 border-l align-top transition-colors",
                          !isLast && "border-b",
                          isToday && "bg-accent/60 group-hover:bg-accent/85",
                          isNow && "bg-accent-table/6",
                          !isToday && "group-hover:bg-accent/75",
                          breakPad,
                        )}
                      >
                        {entries.length > 0 ? (
                          <div className="grid gap-2.5">
                            {entries.map((lesson, index) => (
                              <LessonEntry key={index} lesson={lesson} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-primary/25 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
          {Array.from({ length: filler.count }, (_, index) => (
            <tr
              key={`filler-${index}`}
              className={cn(
                (visibleHours.length + index) % 2 === 1 && "bg-accent/45",
              )}
              style={{ height: filler.height }}
            >
              <td
                className={cn(
                  index !== filler.count - 1 && "border-lines/40 border-b",
                )}
              />
              {dayNames.map((dayName, dayIndex) => (
                <td
                  key={dayName}
                  className={cn(
                    "border-lines/40 border-l align-top",
                    index !== filler.count - 1 && "border-b",
                    dayIndex === todayIndex && "bg-accent/60",
                  )}
                >
                  <span className="text-primary/25 text-xs">—</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
