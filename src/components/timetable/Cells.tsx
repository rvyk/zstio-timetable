"use client";

import { Button } from "@/components/ui/Button";
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

  const { minutesRemaining, secondsRemaining } = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    return { minutesRemaining: minutes, secondsRemaining: seconds };
  }, [timeRemaining]);

  return (
    <td className="relative px-4 py-3 text-center max-md:w-32">
      {shouldShow && isClient && (
        <div className="absolute left-0 h-[calc(100%-1.5rem)] w-1 rounded-r-lg bg-accent-table"></div>
      )}
      <h2 className="text-lg font-semibold text-primary/90 sm:text-xl">
        {hour.number}
      </h2>
      {isClient ? (
        <div className="grid gap-2">
          <p className="text-xs font-medium text-primary/70 sm:text-sm">
            {hour.timeFrom}-{hour.timeTo}
          </p>
          {shouldShow && (
            <p className="mx-auto rounded-sm border border-accent-table bg-accent-table px-2 py-0.5 text-center text-sm font-medium text-accent/90 dark:bg-accent-table/10 dark:text-primary/90">
              {`${minutesRemaining}:${secondsRemaining}`}
            </p>
          )}
        </div>
      ) : (
        <Skeleton className="mx-auto h-4 w-24" />
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

  return (
    <button
      onClick={() => setSelectedDayIndex?.(dayObject.index)}
      className={cn(
        selectedDayIndex == dayObject.index &&
          "bg-accent-table text-accent-secondary group-hover:bg-accent-table/90 dark:text-primary",
        "flex w-full flex-col items-center justify-center px-4 py-3 text-center",
      )}
    >
      <h2 className="text-sm font-semibold opacity-90">{dayObject.short}</h2>
      <h3 className="text-xs font-semibold opacity-70">
        {dayNumber.dayNumber.toString().padStart(2, "0")}.
        {dayNumber.monthNumber.toString().padStart(2, "0")}
      </h3>
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
    <th className="relative text-left">
      <div
        className={cn(
          isCurrentDay ? "gap-x-5" : "gap-x-3",
          "inline-flex items-center px-4 py-3",
        )}
      >
        <h2
          className={cn(
            isCurrentDay
              ? "-mx-2.5 -my-1 rounded-sm bg-accent-table px-2.5 py-1 text-accent/90 dark:text-primary/90"
              : "text-primary/90",
            "text-3xl font-semibold",
          )}
        >
          {day.dayNumber.toString().padStart(2, "0")}
        </h2>
        <h3 className="text-lg font-semibold text-primary/90">{dayName}</h3>
      </div>
    </th>
  );
};

export const ShortLessonSwitcherCell: FC = () => {
  const isClient = useIsClient();
  const { lessonType, setLessonType } = useSettingsStore();
  const isShortLessons = lessonType === "short";

  return (
    <div className="flex items-center justify-center px-2">
      {isClient ? (
        <div className="relative h-9 sm:h-10">
          <div className="flex h-9 sm:h-10">
            {["45'", "30'"].map((value, index) => (
              <Button
                aria-label="Przełącz długość lekcji"
                variant="icon"
                key={value}
                onClick={() =>
                  setLessonType(value === "45'" ? "normal" : "short")
                }
                className={cn(
                  index === 0 ? "!rounded-l-sm" : "!rounded-r-sm",
                  "rounded-none bg-accent font-semibold text-primary/90 hover:bg-primary/5 hover:text-primary max-sm:h-9 max-sm:text-xs",
                )}
              >
                {value}
              </Button>
            ))}
          </div>
          {lessonType !== "custom" && (
            <div
              className={cn(
                isShortLessons
                  ? "translate-x-[100%] transform rounded-r-sm"
                  : "rounded-l-sm",
                "absolute top-0 z-40 flex h-9 w-[50%] cursor-default items-center justify-center bg-accent-table px-4 py-2 text-xs font-semibold text-accent/90 transition-all dark:text-primary/90 sm:h-10 sm:text-sm",
              )}
            >
              {isShortLessons ? "30'" : "45'"}
            </div>
          )}
        </div>
      ) : (
        <Skeleton className="h-9 w-28 rounded-sm sm:h-10" />
      )}
    </div>
  );
};
