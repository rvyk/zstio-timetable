"use client";

import { SHORT_HOURS } from "@/constants/settings";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
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
  const totalDays = timetable.dayNames.length;

  const [currentSlide, setCurrentSlide] = useState(selectedDayIndex + 1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

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

  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);

  const extendedDayIndices = useMemo(
    () => [
      totalDays - 1,
      ...Array.from({ length: totalDays }, (_, i) => i),
      0,
    ],
    [totalDays],
  );

  const handleDayChange = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
      setCurrentSlide(newIndex + 1);
    }
  };

  const handleSwipe = (increment: number) => {
    const nextIndex = (selectedDayIndex + increment + totalDays) % totalDays;
    setSelectedDayIndex(nextIndex);
    setCurrentSlide((prev) => prev + increment);
  };

  const handleTransitionEnd = () => {
    if (currentSlide === 0) {
      setTransitionEnabled(false);
      setCurrentSlide(totalDays);
    } else if (currentSlide === totalDays + 1) {
      setTransitionEnabled(false);
      setCurrentSlide(1);
    }
  };

  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }
  }, [transitionEnabled]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      const increment = diff < 0 ? 1 : -1;
      handleSwipe(increment);
    }
    touchStartX.current = null;
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

      {/* Mobile timetable with sliding animation */}
      {hasLessons && (
        <div
          className="md:hidden overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={clsx("flex w-full", {
              "transition-transform duration-300": transitionEnabled,
            })}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedDayIndices.map((dayIndex, idx) => (
              <table key={idx} className="w-full flex-shrink-0">
                <tbody>
                  {Object.values(hours)
                    .slice(0, maxLessons)
                    .map((hour, hourIndex) => (
                      <tr
                        key={hourIndex}
                        className="border-b border-lines odd:bg-accent/50 odd:dark:bg-background"
                      >
                        <TableHourCell
                          hour={hour}
                          isCurrentDay={dayIndex === todayIndex}
                        />
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
            ))}
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
