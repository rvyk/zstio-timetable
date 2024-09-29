"use client";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { TableHour } from "@majusss/timetable-parser";
import { FC, useMemo } from "react";
import { useIsClient } from "usehooks-ts";

interface TableHourCellProps {
  hour: TableHour;
  isCurrent: boolean;
  timeRemaining: number;
}

export const TableHourCell: FC<TableHourCellProps> = ({
  hour,
  isCurrent,
  timeRemaining,
}) => {
  const isClient = useIsClient();

  const { minutesRemaining, secondsRemaining } = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    return { minutesRemaining: minutes, secondsRemaining: seconds };
  }, [timeRemaining]);

  return (
    <td className="relative px-4 py-3 text-center">
      {isCurrent && isClient && (
        <div className="absolute left-0 h-[calc(100%-1.5rem)] w-1 rounded-r-lg bg-accent-table"></div>
      )}
      <h2 className="text-xl font-semibold text-primary/90">{hour.number}</h2>
      {isClient ? (
        <div className="grid gap-2">
          <p className="text-sm font-medium text-primary/70">
            {hour.timeFrom}-{hour.timeTo}
          </p>
          {isCurrent && (
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
}

export const TableHeaderCell: FC<TableHeaderCellProps> = ({ dayName }) => {
  const dayNumber = useMemo(() => getDayNumberForNextWeek(dayName), [dayName]);
  const isCurrentDay = useMemo(
    () => new Date().getDate() === dayNumber,
    [dayNumber],
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
          {dayNumber.toString().padStart(2, "0")}
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
    <th className="flex h-16 items-center justify-center px-2">
      {isClient ? (
        <div className="relative h-10">
          <div className="flex h-10">
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
                  "rounded-none bg-accent font-semibold text-primary/90 hover:bg-primary/5 hover:text-primary",
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
                "absolute top-0 z-40 flex h-10 w-[50%] cursor-default items-center justify-center bg-accent-table px-4 py-2 text-sm font-semibold text-accent/90 transition-all dark:text-primary/90",
              )}
            >
              {isShortLessons ? "30'" : "45'"}
            </div>
          )}
        </div>
      ) : (
        <Skeleton className="h-10 w-28 rounded-sm" />
      )}
    </th>
  );
};
