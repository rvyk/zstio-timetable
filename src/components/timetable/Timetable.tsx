"use client";

import { SHORT_HOURS } from "@/constants/settings";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import { FC, useMemo, useRef, useState } from "react";
import {
  ShortLessonSwitcherCell,
  TableHeaderCell,
  TableHeaderMobileCell,
  TableHourCell,
} from "./Cells";
import { LessonItem, TableLessonCell } from "./LessonCells";

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

  const totalDays = timetable.dayNames.length;

  const [animIndex, setAnimIndex] = useState(selectedDayIndex + 1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDaySelect = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
      setAnimIndex(newIndex + 1);
    }
  };

  const moveDay = (increment: number) => {
    const nextIndex = (selectedDayIndex + increment + totalDays) % totalDays;
    setSelectedDayIndex(nextIndex);
    setIsAnimating(true);
    if (selectedDayIndex === 0 && increment === -1) {
      setAnimIndex(0);
    } else if (selectedDayIndex === totalDays - 1 && increment === 1) {
      setAnimIndex(totalDays + 1);
    } else {
      setAnimIndex((prev) => prev + increment);
    }
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (animIndex === 0) {
      setAnimIndex(totalDays);
    } else if (animIndex === totalDays + 1) {
      setAnimIndex(1);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      moveDay(diff < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const renderDay = (dayIndex: number, key: React.Key) => (
    <table key={key} className="w-full flex-shrink-0">
      <tbody>
        {Object.values(hours)
          .slice(0, maxLessons)
          .map((hour, hourIndex) => (
            <tr
              key={hourIndex}
              className="border-b border-lines odd:bg-accent/50 odd:dark:bg-background"
            >
              <TableHourCell hour={hour} />
              <td className="py-3 last:border-0 max-md:px-2 md:px-4">
                {(timetable.lessons?.[dayIndex]?.[hourIndex] ?? []).map(
                  (lessonItem, index) => (
                    <LessonItem key={index} lesson={lessonItem} />
                  ),
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <div className="h-fit w-full border-lines bg-foreground transition-all max-md:mb-20 md:overflow-hidden md:rounded-md md:border">
      <div className="sticky top-0 z-20 flex justify-between divide-x divide-lines border-y border-lines bg-foreground md:hidden">
        {timetable.dayNames.map((dayName) => (
          <TableHeaderMobileCell
            key={dayName}
            dayName={dayName}
            selectedDayIndex={selectedDayIndex}
            setSelectedDayIndex={handleDaySelect}
          />
        ))}
      </div>

      {/* Mobile timetable with sliding animation */}
      {hasLessons && (
        <div
          className="md:hidden overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex w-full ${
              isAnimating ? "transition-transform duration-300" : ""
            }`}
            style={{ transform: `translateX(-${animIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {renderDay(totalDays - 1, "clone-last")}
            {timetable.dayNames.map((_, dayIndex) =>
              renderDay(dayIndex, dayIndex),
            )}
            {renderDay(0, "clone-first")}
          </div>
        </div>
      )}

      {/* Desktop timetable */}
      <div className="h-full w-full max-md:hidden md:overflow-auto">
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
