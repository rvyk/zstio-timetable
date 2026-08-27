"use client";

import { FavoriteStar } from "@/components/common/FavoriteStar";
import { useT } from "@/components/common/LocaleProvider";
import { Segmented } from "@/components/ui/Segmented";
import {
  SHORT_HOURS,
  WEEK_VIEW_COOKIE,
  type WeekView,
} from "@/constants/settings";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { warsawDayIndex } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import type { OptivumTimetable } from "@/types/optivum";
import { setCookie } from "cookies-next";
import { Columns3, Table2 } from "lucide-react";
import { FC, useMemo, useState, useSyncExternalStore } from "react";
import { ShortLessonSwitcherCell } from "./Cells";
import { DayBoard } from "./DayBoard";
import { NoLessons } from "./Slots";
import { TableBoard } from "./TableBoard";
import { WeekBoard } from "./WeekBoard";

interface TimetableProps {
  timetable: OptivumTimetable;
  initialView: WeekView;
}

const NEVER_CHANGES = () => () => {};

const useTodayIndex = () => {
  const override = useSyncExternalStore(
    NEVER_CHANGES,
    () => new URLSearchParams(window.location.search).get("day"),
    () => null,
  );

  return override === null ? warsawDayIndex() : Number(override);
};

export const Timetable: FC<TimetableProps> = ({ timetable, initialView }) => {
  const translate = useT();
  const [weekView, setWeekView] = useState(initialView);
  const lessonType = useSettingsStore((state) => state.lessonType);
  const hoursAdjustIndex = useSettingsStore((state) => state.hoursAdjustIndex);
  const storedDayIndex = useSettingsWithoutStore(
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
  const selectedDayIndex =
    storedDayIndex >= 0 ? storedDayIndex : todayIndex > 4 ? 0 : todayIndex;
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
          <NoLessons description={translate("timetable.emptyWeek")} />
        </div>
      )}

      <div className="border-lines @container/head flex items-center justify-between gap-4 border-b pr-2 pl-4 max-md:hidden">
        <div className="flex min-w-0 items-center gap-x-3 py-2">
          <Segmented
            options={[
              {
                value: "columns" as const,
                label: <Columns3 className="mx-auto size-4" strokeWidth={2} />,
                ariaLabel: translate("timetable.view.columns"),
              },
              {
                value: "table" as const,
                label: <Table2 className="mx-auto size-4" strokeWidth={2} />,
                ariaLabel: translate("timetable.view.table"),
              },
            ]}
            value={weekView}
            onSelect={(value) => {
              setWeekView(value);
              setCookie(WEEK_VIEW_COOKIE, value, {
                path: "/",
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              });
            }}
            className="h-9 shrink-0"
            buttonClassName="w-9"
            inactiveClassName="text-primary/55 hover:text-primary/88"
          />
          <div className="flex min-w-0 items-baseline gap-x-2.5">
            <h1 className="text-primary truncate text-xl leading-tight font-semibold tracking-[-0.02em]">
              {timetable.title || translate("timetable.notFound")}
            </h1>
            {timetable.title && (
              <span className="text-primary/55 truncate text-xs">
                {translate("timetable.schedule", {
                  type: translate(`type.${timetable.type}`),
                })}
              </span>
            )}
          </div>
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
              className="border-lines bg-accent hover:bg-accent/60 h-9 rounded-lg border px-3 @max-3xl/head:gap-0 @max-3xl/head:px-2.5 @max-3xl/head:[&>span]:hidden"
            />
          )}
          <ShortLessonSwitcherCell />
        </div>
      </div>

      <div
        data-plan-scroll
        className="min-h-0 w-full flex-1 scroll-smooth motion-reduce:scroll-auto max-md:hidden md:overflow-y-auto"
      >
        {!hasLessons ? (
          <NoLessons description={translate("timetable.emptyWeek")} />
        ) : weekView === "table" ? (
          <TableBoard
            dayNames={dayNames}
            lessons={lessons}
            hours={visibleHours}
            todayIndex={todayIndex}
          />
        ) : (
          <WeekBoard
            dayNames={dayNames}
            lessons={lessons}
            hours={visibleHours}
            todayIndex={todayIndex}
          />
        )}
      </div>
    </section>
  );
};
