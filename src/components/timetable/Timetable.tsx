"use client";

import { FavoriteStar } from "@/components/common/FavoriteStar";
import { SHORT_HOURS } from "@/constants/settings";
import { TRANSLATION_DICT } from "@/constants/translations";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import type { OptivumTimetable } from "@/types/optivum";
import { CalendarX2 } from "lucide-react";
import { FC, useMemo, useRef, useSyncExternalStore } from "react";
import {
  ShortLessonSwitcherCell,
  TableHeaderMobileCell,
  TableHourCell,
} from "./Cells";
import { LessonItem } from "./LessonCells";
import { WeekBoard } from "./WeekBoard";

interface TimetableProps {
  timetable: OptivumTimetable;
}

const SWIPE_THRESHOLD = 50;

const NEVER_CHANGES = () => () => {};

/**
 * ?day=0..4 udaje inny dzień tygodnia (razem z ?now=HH:MM do testów).
 * useSyncExternalStore daje osobny snapshot dla serwera i klienta, więc nie
 * potrzebujemy setState w efekcie ani nie ryzykujemy niezgodności hydracji.
 */
const useTodayIndex = () => {
  const override = useSyncExternalStore(
    NEVER_CHANGES,
    () => new URLSearchParams(window.location.search).get("day"),
    () => null,
  );

  return override === null ? (new Date().getDay() + 6) % 7 : Number(override);
};

const NoLessons: FC<{ description: string }> = ({ description }) => (
  <div className="animate-rise flex h-full w-full flex-col items-center justify-center gap-3 p-10 text-center">
    <div className="border-lines bg-accent grid size-12 place-content-center rounded-xl border">
      <CalendarX2 className="text-primary/40 size-5" strokeWidth={1.75} />
    </div>
    <div className="grid gap-1">
      <h2 className="text-primary/90 text-base font-medium tracking-tight">
        Brak planu zajęć
      </h2>
      <p className="text-primary/50 max-w-xs text-sm">{description}</p>
    </div>
  </div>
);

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

  const lessons = useMemo(() => timetable.lessons ?? [], [timetable.lessons]);

  const maxLessons = useMemo(() => {
    const lessonCounts = lessons.map((day) => day.length);
    const hourCount = Object.keys(timetable.hours).length;

    return Math.max(hourCount, ...lessonCounts, 0);
  }, [lessons, timetable.hours]);

  const hasLessons = useMemo(
    () =>
      lessons.some((day) => day.some((hourLessons) => hourLessons.length > 0)),
    [lessons],
  );

  const todayIndex = useTodayIndex();
  const dayNames = timetable.dayNames;
  const hoursList = useMemo(() => Object.values(hours), [hours]);
  const visibleHours = useMemo(
    () => hoursList.slice(0, maxLessons),
    [hoursList, maxLessons],
  );

  const handleDayChange = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX;
    if (touchStartX.current === null || endX === undefined) return;

    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      const increment = diff < 0 ? 1 : -1;
      const totalDays = dayNames.length;
      const nextIndex = (selectedDayIndex + increment + totalDays) % totalDays;
      handleDayChange(nextIndex);
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="plan"
      className={cn(
        "flex-1",
        "border-lines bg-foreground flex w-full flex-col max-md:mb-20 md:overflow-hidden md:rounded-xl md:border md:shadow-(--shadow-soft)",
      )}
    >
      <div className="border-lines bg-foreground/85 sticky top-0 z-20 flex justify-between border-b backdrop-blur-md md:hidden">
        {dayNames.map((dayName) => (
          <TableHeaderMobileCell
            key={dayName}
            dayName={dayName}
            selectedDayIndex={selectedDayIndex}
            setSelectedDayIndex={handleDayChange}
          />
        ))}
      </div>

      <div
        className="flex-1 overflow-hidden md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${selectedDayIndex * 100}%)` }}
        >
          {dayNames.map((_, dayIndex) => {
            const dayLessons = lessons[dayIndex] ?? [];
            const dayHasLessons = dayLessons.some(
              (hourLessons) => hourLessons.length > 0,
            );
            return (
              <div
                key={dayIndex}
                className="flex h-full w-full shrink-0 flex-col"
              >
                {dayHasLessons ? (
                  <table className="w-full">
                    <tbody>
                      {visibleHours.map((hour, hourIndex) => (
                        <tr key={hourIndex} className="">
                          <TableHourCell
                            hour={hour}
                            isCurrentDay={dayIndex === todayIndex}
                          />
                          <td className="p-1 pl-0">
                            {(lessons[dayIndex]?.[hourIndex] ?? []).map(
                              (lessonItem, index) => (
                                <LessonItem key={index} lesson={lessonItem} />
                              ),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <NoLessons description="Na ten dzień nie wprowadzono planu zajęć" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-lines flex items-center justify-between gap-4 border-b pr-2 pl-4 max-md:hidden">
        <div className="flex min-w-0 items-baseline gap-x-2.5">
          <h1 className="text-primary truncate text-xl leading-none font-semibold tracking-[-0.02em]">
            {timetable.title || "Nie znaleziono planu"}
          </h1>
          {timetable.title && (
            <span className="text-primary/40 shrink-0 text-xs">
              Rozkład zajęć {TRANSLATION_DICT[timetable.type]}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center">
          {timetable.title && (
            <FavoriteStar
              item={{
                name: timetable.title,
                value: timetable.id.substring(1),
                type: timetable.type,
              }}
              withLabel
              className="border-lines bg-accent hover:bg-accent/60 h-9 rounded-lg border px-3"
            />
          )}
          <ShortLessonSwitcherCell />
        </div>
      </div>

      <div className="min-h-0 w-full flex-1 max-md:hidden md:overflow-y-auto">
        {hasLessons ? (
          <WeekBoard
            dayNames={dayNames}
            lessons={lessons}
            hours={visibleHours}
            todayIndex={todayIndex}
          />
        ) : (
          <NoLessons description="Na ten tydzień nie wprowadzono planu zajęć" />
        )}
      </div>
    </section>
  );
};
