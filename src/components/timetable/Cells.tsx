"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { DAYS_OF_WEEK } from "@/constants/days";
import { cn, getDayNumberForNextWeek, parseTime } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { TableHour } from "@majusss/timetable-parser";
import { FC, useEffect, useMemo, useState } from "react";
import { useIsClient } from "usehooks-ts";

interface TableHourCellProps {
  hour: TableHour;
  isCurrentDay?: boolean;
}

export const TableHourCell: FC<TableHourCellProps> = ({
  hour,
  isCurrentDay = true,
}) => {
  const isClient = useIsClient();
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const start = useMemo(() => parseTime(hour.timeFrom), [hour.timeFrom]);
  const end = useMemo(() => parseTime(hour.timeTo), [hour.timeTo]);
  const isCurrent = currentTime >= start && currentTime < end;
  const shouldShow = isCurrent && isCurrentDay;
  const timeRemaining = shouldShow ? end - currentTime : 0;

  const progress = shouldShow
    ? Math.min(100, ((currentTime - start) / (end - start)) * 100)
    : 0;

  const { minutesRemaining, secondsRemaining } = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    return { minutesRemaining: minutes, secondsRemaining: seconds };
  }, [timeRemaining]);

  const isLive = shouldShow && isClient;

  return (
    <td className="relative align-top py-3.5 pr-3 pl-4 max-md:w-30 max-md:select-none">
      {isLive && (
        <span className="bg-accent-table absolute top-1/2 left-0 h-[calc(100%-1.25rem)] w-[3px] -translate-y-1/2 rounded-r-full" />
      )}
      <div className="flex items-baseline gap-2 md:grid md:gap-1">
        <span
          className={cn(
            isLive ? "text-accent-table" : "text-primary",
            "tabular text-xl leading-none font-semibold tracking-tight tabular-nums sm:text-2xl",
          )}
        >
          {hour.number}
        </span>
        {isClient ? (
          <span className="text-primary/65 tabular font-mono text-xs leading-none tracking-tight">
            {hour.timeFrom}–{hour.timeTo}
          </span>
        ) : (
          <Skeleton className="h-3 w-20" />
        )}
      </div>
      {isLive && (
        <div className="mt-2 grid gap-1.5">
          <div className="bg-primary/10 h-[3px] w-full max-w-28 overflow-hidden rounded-full">
            <div
              className="bg-accent-table h-full rounded-full transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-accent-table tabular font-mono text-[11px] leading-none font-medium">
            {`za ${minutesRemaining}:${secondsRemaining}`}
          </span>
        </div>
      )}
    </td>
  );
};

interface TableHeaderCellProps {
  dayName: string;
  selectedDayIndex?: number;
  setSelectedDayIndex?: (selectedDayIndex: number) => void;
}

export const TableHeaderMobileCell: FC<TableHeaderCellProps> = ({
  dayName,
  selectedDayIndex,
  setSelectedDayIndex,
}) => {
  const dayNumber = useMemo(() => getDayNumberForNextWeek(dayName), [dayName]);

  const dayObject = DAYS_OF_WEEK.find((day) => day.long === dayName);

  if (!dayObject) return null;

  const isActive = selectedDayIndex == dayObject.index;

  return (
    <button
      onClick={() => setSelectedDayIndex?.(dayObject.index)}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        isActive ? "text-primary" : "text-primary/45 active:text-primary/70",
        "relative flex w-full flex-col items-center justify-center gap-0.5 px-2 py-3 text-center transition-colors max-md:select-none",
      )}
    >
      <span className="text-[13px] leading-none font-semibold">
        {dayObject.short}
      </span>
      <span className="tabular font-mono text-[11px] leading-none opacity-70">
        {dayNumber.dayNumber.toString().padStart(2, "0")}.
        {dayNumber.monthNumber.toString().padStart(2, "0")}
      </span>
      {isActive && (
        <span className="bg-accent-table absolute inset-x-3 -bottom-px h-[2px] rounded-full" />
      )}
    </button>
  );
};

export const TableHeaderCell: FC<TableHeaderCellProps> = ({ dayName }) => {
  const day = useMemo(() => getDayNumberForNextWeek(dayName), [dayName]);
  const isCurrentDay = useMemo(
    () => new Date().getDate() === day.dayNumber,
    [day],
  );

  return (
    <th className="relative text-left max-md:select-none">
      {isCurrentDay && (
        <span className="bg-accent-table absolute inset-x-0 top-0 h-[2px]" />
      )}
      <div className="inline-flex items-baseline gap-x-2.5 px-4 py-3.5">
        <span
          className={cn(
            isCurrentDay ? "text-accent-table" : "text-primary",
            "tabular text-2xl leading-none font-semibold tracking-tight tabular-nums",
          )}
        >
          {day.dayNumber.toString().padStart(2, "0")}
        </span>
        <span
          className={cn(
            isCurrentDay ? "text-primary" : "text-primary/75",
            "text-[15px] leading-none font-medium",
          )}
        >
          {dayName}
        </span>
      </div>
    </th>
  );
};

export const ShortLessonSwitcherCell: FC = () => {
  const isClient = useIsClient();
  const { lessonType, setLessonType } = useSettingsStore();
  const isShortLessons = lessonType === "short";

  return (
    <div className="flex items-center justify-center px-3 py-2">
      {isClient ? (
        <div className="border-lines bg-accent relative flex h-9 rounded-lg border p-[3px]">
          {lessonType !== "custom" && (
            <span
              className={cn(
                isShortLessons && "translate-x-full",
                "bg-foreground absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-md shadow-[var(--shadow-soft)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
              )}
            />
          )}
          {(["45'", "30'"] as const).map((value) => {
            const active =
              lessonType !== "custom" &&
              (value === "45'") === (lessonType === "normal");
            return (
              <button
                key={value}
                aria-label={`Lekcje ${value}`}
                aria-pressed={active}
                onClick={() =>
                  setLessonType(value === "45'" ? "normal" : "short")
                }
                className={cn(
                  active ? "text-primary" : "text-primary/50 hover:text-primary/80",
                  "tabular relative z-10 w-11 rounded-md font-mono text-xs font-medium transition-colors",
                )}
              >
                {value}
              </button>
            );
          })}
        </div>
      ) : (
        <Skeleton className="h-9 w-[94px] rounded-lg" />
      )}
    </div>
  );
};
