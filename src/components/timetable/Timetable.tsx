"use client";

import { SHORT_HOURS } from "@/constants/settings";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import { FC, useMemo } from "react";
import {
  ShortLessonSwitcherCell,
  TableHeaderCell,
  TableHeaderMobileCell,
  TableHourCell,
} from "./Cells";
import { TableLessonCell } from "./LessonCells";

interface TimetableProps {
  timetable: OptivumTimetable;
}

export const Timetable: FC<TimetableProps> = ({ timetable }) => {
  const lessonType = useSettingsStore((state) => state.lessonType);
  const hoursAdjustIndex = useSettingsStore((state) => state.hoursAdjustIndex);
  const selectedDayIndex = useSettingsWithoutStore(
    (state) => state.selectedDayIndex,
  );
  const setSelectedDayIndex = useSettingsWithoutStore(
    (state) => state.setSelectedDayIndex,
  );

  const hours = useMemo(() => {
    if (lessonType === "custom") {
      return adjustShortenedLessons(
        hoursAdjustIndex,
        Object.values(timetable.hours),
      );
    }
    return lessonType === "short" ? SHORT_HOURS : timetable.hours;
  }, [lessonType, hoursAdjustIndex, timetable.hours]);

  const maxLessons = useMemo(() => {
    return (
      Math.max(
        Object.keys(timetable.hours).length,
        ...(timetable.lessons?.map((day) => day.length) ?? []),
      ) || 0
    );
  }, [timetable]);

  const hasLessons = useMemo(
    () => timetable.lessons?.some((innerArray) => innerArray.length > 0),
    [timetable.lessons],
  );

  const handleDayChange = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
    }
  };

  return (
    <div className="h-fit w-full border-lines bg-foreground transition-all max-md:mb-20 md:overflow-hidden md:rounded-md md:border">
      <div className="sticky top-0 z-20 flex justify-between divide-x divide-lines border-y border-lines bg-foreground md:hidden">
        {timetable.dayNames.map((dayName) => (
          <TableHeaderMobileCell
            key={dayName}
            dayName={dayName}
            selectedDayIndex={selectedDayIndex}
            setSelectedDayIndex={handleDayChange}
          />
        ))}
      </div>

      <div className="h-full w-full md:overflow-auto">
        {hasLessons && (
          <table className="w-full">
            <thead className="max-md:hidden">
              <tr className="divide-x divide-lines border-b border-lines">
                <th>
                  <ShortLessonSwitcherCell />
                </th>
                {timetable.dayNames.map((dayName) => (
                  <TableHeaderCell key={dayName} dayName={dayName} />
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(hours)
                .slice(0, maxLessons)
                .map((hour, hourIndex) => (
                  <tr
                    key={hourIndex}
                    className="divide-lines border-b border-lines odd:bg-accent/50 odd:dark:bg-background md:divide-x md:last:border-none"
                  >
                    <TableHourCell hour={hour} />
                    {timetable.lessons?.map((day, dayIndex) => (
                      <TableLessonCell
                        key={dayIndex}
                        dayIndex={dayIndex}
                        day={day}
                        lessonIndex={hourIndex}
                        selectedDayIndex={selectedDayIndex}
                      />
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
