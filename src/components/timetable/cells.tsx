"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { shortHours } from "@/constants/hours";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { TableHour } from "@majusss/timetable-parser";
import { useIsClient } from "usehooks-ts";

export const TableHourCell: React.FC<{
  hour: TableHour;
}> = ({ hour }) => {
  const isClient = useIsClient();
  const isShortLessons = useSettingsStore((state) => state.isShortLessons);
  const shortHour = shortHours.find((sh) => sh.number === hour.number);

  const timeFrom =
    isShortLessons && shortHour ? shortHour.timeFrom : hour.timeFrom;
  const timeTo = isShortLessons && shortHour ? shortHour.timeTo : hour.timeTo;

  return (
    <td className="flex h-full min-h-16 w-full flex-col items-center justify-center py-3">
      <h2 className="text-xl font-semibold text-primary/90">{hour.number}</h2>
      {isClient ? (
        <p className="text-sm font-medium text-primary/70">
          {timeFrom}-{timeTo}
        </p>
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
