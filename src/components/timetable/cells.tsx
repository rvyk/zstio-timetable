"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { shortHours } from "@/constants/hours";
import { cn, getCurrentLesson, getDayNumberForNextWeek } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { TableHour } from "@majusss/timetable-parser";
import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";

export const TableHourCell: React.FC<{
  hour: TableHour;
}> = ({ hour }) => {
  const isClient = useIsClient();
  const isShortLessons = useSettingsStore((state) => state.isShortLessons);

  //TODO: REFACTOR THIS COMPONENT

  const shortHour = shortHours.find((sh) => sh.number === hour.number);

  const timeFrom =
    isShortLessons && shortHour ? shortHour.timeFrom : hour.timeFrom;
  const timeTo = isShortLessons && shortHour ? shortHour.timeTo : hour.timeTo;

  const [isWithinTimeRange, setIsWithinTimeRange] = useState(
    getCurrentLesson(timeFrom, timeTo).isWithinTimeRange,
  );
  const [timeRemaining, setTimeRemaining] = useState(
    getCurrentLesson(timeFrom, timeTo).timeRemaining,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const { isWithinTimeRange, timeRemaining } = getCurrentLesson(
        timeFrom,
        timeTo,
      );
      setTimeRemaining(timeRemaining);
      setIsWithinTimeRange(isWithinTimeRange);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeFrom, timeTo]);

  return (
    <td className="relative flex h-full min-h-16 w-full flex-col items-center justify-center py-3">
      {isWithinTimeRange && (
        <div className="absolute left-0 h-[calc(100%-1.5rem)] w-1 rounded-r-lg bg-accent-table"></div>
      )}
      <h2 className="text-xl font-semibold text-primary/90">{hour.number}</h2>
      {isClient ? (
        <div className="grid gap-2">
          <p className="text-sm font-medium text-primary/70">
            {timeFrom}-{timeTo}
          </p>
          {!!timeRemaining && timeRemaining != "00:00" && (
            <p className="mx-auto rounded-sm border border-accent-table bg-accent-table/10 px-2 py-0.5 text-center text-sm font-medium text-primary/90">
              {timeRemaining}
            </p>
          )}
        </div>
      ) : (
        <Skeleton className="h-3.5 w-24" />
      )}
    </td>
  );
};

export const TableHeaderCell: React.FC<{ dayName: string }> = ({ dayName }) => {
  const dayNumber = getDayNumberForNextWeek(dayName);

  return (
    <th className="text-left">
      <div className="inline-flex items-center gap-x-3 px-4 py-3">
        <h2 className="text-3xl font-semibold text-primary/90">{dayNumber}</h2>
        <p className="text-xl font-semibold text-primary/90">{dayName}</p>
      </div>
    </th>
  );
};

export const ShortLessonSwitcherCell: React.FC = () => {
  const isClient = useIsClient();
  const { isShortLessons, toggleShortLessons } = useSettingsStore();

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
                onClick={toggleShortLessons}
                className={cn(
                  index === 0 ? "!rounded-l-sm" : "!rounded-r-sm",
                  "rounded-none bg-accent font-semibold text-primary/90 hover:bg-primary/5 hover:text-primary",
                )}
              >
                {value}
              </Button>
            ))}
          </div>
          <div
            className={cn(
              isShortLessons
                ? "translate-x-[100%] transform rounded-r-sm"
                : "rounded-l-sm",
              "absolute top-0 z-40 flex h-10 w-[50%] cursor-default items-center justify-center bg-primary px-4 py-2 text-sm font-semibold text-accent/90 transition-all dark:bg-accent-table dark:text-primary/90",
            )}
          >
            {isShortLessons ? "30'" : "45'"}
          </div>
        </div>
      ) : (
        <Skeleton className="h-10 w-28 rounded-sm" />
      )}
    </th>
  );
};
