"use client";

import { FavoriteStar } from "@/components/common/FavoriteStar";
import { SHORT_HOURS } from "@/constants/settings";
import { TRANSLATION_DICT } from "@/constants/translations";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import type { OptivumTimetable } from "@/types/optivum";
import { FC, useMemo, useSyncExternalStore } from "react";
import { ShortLessonSwitcherCell } from "./Cells";
import { DayBoard } from "./DayBoard";
import { NoLessons } from "./Slots";
import { WeekBoard } from "./WeekBoard";

interface TimetableProps {
  timetable: OptivumTimetable;
}

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

  return (
    <section
      id="plan"
      className={cn(
        "flex-1",
        "border-lines bg-foreground flex w-full flex-col md:overflow-hidden md:rounded-xl md:border md:shadow-(--shadow-soft)",
      )}
    >
      {hasLessons ? (
        <DayBoard
          dayNames={dayNames}
          lessons={lessons}
          hours={visibleHours}
          todayIndex={todayIndex}
          selectedDayIndex={selectedDayIndex}
          onDayChange={setSelectedDayIndex}
        />
      ) : (
        <div className="md:hidden">
          <NoLessons description="Na ten tydzień nie wprowadzono planu zajęć" />
        </div>
      )}

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
