"use client";

import { SHORT_HOURS } from "@/constants/settings";
import { TRANSLATION_DICT } from "@/constants/translations";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import type { OptivumTimetable } from "@/types/optivum";
import { CalendarX2 } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
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

const SWIPE_THRESHOLD = 50;

const NoLessons: FC<{ description: string }> = ({ description }) => (
  <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
    <CalendarX2 className="text-primary/70 dark:text-primary/80 h-10 w-10" />
    <h2 className="text-lg font-semibold">Brak planu zajęć</h2>
    <p className="text-sm">{description}</p>
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
  const setPrintTimetable = useTimetableStore(
    (state) => state.setPrintTimetable,
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

  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const dayNames = timetable.dayNames;
  const hoursList = useMemo(() => Object.values(hours), [hours]);
  const visibleHours = useMemo(
    () => hoursList.slice(0, maxLessons),
    [hoursList, maxLessons],
  );

  const lessonsByDay = useMemo(
    () =>
      dayNames.map((_, dayIndex) => {
        const dayLessons = lessons[dayIndex] ?? [];
        return visibleHours.map((_, hourIndex) => dayLessons[hourIndex] ?? []);
      }),
    [dayNames, lessons, visibleHours],
  );

  const dayHasLessons = useMemo(
    () => lessonsByDay.map((day) => day.some((hour) => hour.length > 0)),
    [lessonsByDay],
  );

  const hasLessons = useMemo(
    () => dayHasLessons.some(Boolean),
    [dayHasLessons],
  );

  const printableRows = useMemo(
    () =>
      visibleHours.map((hour, hourIndex) => ({
        hour,
        lessons: lessonsByDay.map((dayLessons) => dayLessons[hourIndex] ?? []),
      })),
    [lessonsByDay, visibleHours],
  );

  const handleDayChange = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      const increment = diff < 0 ? 1 : -1;
      const totalDays = dayNames.length;
      const nextIndex = (selectedDayIndex + increment + totalDays) % totalDays;
      handleDayChange(nextIndex);
    }
    touchStartX.current = null;
  };

  const printableRef = useRef<HTMLDivElement>(null);

  const formatDate = useCallback(
    (date: Date) =>
      new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date),
    [],
  );

  const [printTimestamp, setPrintTimestamp] = useState(() => formatDate(new Date()));

  const pageStyle = useMemo(
    () => "@page { size: A4 landscape; margin: 10mm; }",
    [],
  );

  const triggerPrint = useReactToPrint({
    contentRef: printableRef,
    pageStyle,
    documentTitle: timetable.title
      ? `Plan lekcji ${TRANSLATION_DICT[timetable.type]} ${timetable.title}`
      : "Plan lekcji",
    preserveAfterPrint: true,
    onBeforePrint: async () => {
      setPrintTimestamp(formatDate(new Date()));
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    },
  });

  const handlePrint = useCallback(() => {
    triggerPrint();
  }, [triggerPrint]);

  useEffect(() => {
    setPrintTimetable(handlePrint);
    return () => setPrintTimetable(null);
  }, [handlePrint, setPrintTimetable]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const isPrintShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p";

      if (!isPrintShortcut) return;

      event.preventDefault();
      handlePrint();
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handlePrint]);

  return (
    <>
      <div
        className={cn(
          hasLessons ? "" : "flex-1",
          "border-lines bg-foreground flex w-full flex-col transition-all max-md:mb-20 md:overflow-hidden md:rounded-md md:border",
        )}
      >
        <div className="divide-lines border-lines bg-foreground sticky top-0 z-20 flex justify-between divide-x border-y md:hidden">
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
            className="flex h-full w-full transition-transform duration-300"
            style={{ transform: `translateX(-${selectedDayIndex * 100}%)` }}
          >
          {dayNames.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="flex h-full w-full flex-shrink-0 flex-col"
            >
              {dayHasLessons[dayIndex] ? (
                <table className="w-full">
                  <tbody>
                    {printableRows.map(({ hour, lessons: hourLessons }, hourIndex) => (
                      <tr
                        key={hourIndex}
                        className="border-lines odd:bg-accent/50 odd:dark:bg-background border-b"
                      >
                        <TableHourCell
                          hour={hour}
                          isCurrentDay={dayIndex === todayIndex}
                        />
                        <td className="py-3 last:border-0 max-md:px-2 md:px-4">
                          {hourLessons[dayIndex].map((lessonItem, index) => (
                            <LessonItem key={index} lesson={lessonItem} />
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NoLessons description="Na ten dzień nie wprowadzono planu zajęć" />
              )}
            </div>
          ))}
          </div>
        </div>

        <div className="h-full w-full max-md:hidden md:overflow-auto">
          {hasLessons ? (
            <table className="w-full">
              <thead className="max-md:hidden">
                <tr className="divide-lines border-lines divide-x border-b">
                  <th>
                    <ShortLessonSwitcherCell />
                  </th>
                  {dayNames.map((dayName) => (
                    <TableHeaderCell key={dayName} dayName={dayName} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {printableRows.map(({ hour }, hourIndex) => (
                  <tr
                    key={hourIndex}
                    className="divide-lines border-lines odd:bg-accent/50 odd:dark:bg-background border-b md:divide-x md:last:border-none"
                  >
                    <TableHourCell hour={hour} />
                    {lessonsByDay.map((day, dayIndex) => (
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
          ) : (
            <NoLessons description="Na ten tydzień nie wprowadzono planu zajęć" />
          )}
        </div>
      </div>

      <div ref={printableRef} className="print-container" aria-hidden="true">
        <div className="print-wrapper">
          <header className="print-header">
            <h1>
              Plan lekcji {TRANSLATION_DICT[timetable.type]} {timetable.title}
            </h1>
            <p>Data wydruku: {printTimestamp}</p>
            {timetable.generatedDate && timetable.generatedDate !== "Invalid date" && (
              <p>Plan wygenerowano: {timetable.generatedDate}</p>
            )}
            {timetable.validDate && (
              <p>Obowiązuje od: {timetable.validDate}</p>
            )}
          </header>

          {hasLessons ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Godzina</th>
                  {dayNames.map((dayName) => (
                    <th key={dayName}>{dayName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {printableRows.map(({ hour, lessons: rowLessons }, hourIndex) => (
                  <tr key={hourIndex}>
                    <td>
                      <div className="print-lesson">
                        <span className="print-lesson__subject">{hour.number}. lekcja</span>
                        <span className="print-lesson__meta">
                          {hour.timeFrom} - {hour.timeTo}
                        </span>
                      </div>
                    </td>
                    {rowLessons.map((hourLessons, dayIndex) => (
                        <td key={dayIndex}>
                          {hourLessons.map((lesson, lessonIndex) => {
                            const lessonDetails = [
                              lesson.teacher,
                              lesson.room ? `Sala ${lesson.room}` : undefined,
                              lesson.className,
                            ]
                              .filter(Boolean)
                              .join(" • ");

                            return (
                              <div className="print-lesson" key={lessonIndex}>
                                <span className="print-lesson__subject">
                                  {lesson.subject}
                                  {lesson.groupName ? ` (${lesson.groupName})` : ""}
                                </span>
                                {lessonDetails && (
                                  <span className="print-lesson__meta">{lessonDetails}</span>
                                )}
                              </div>
                            );
                          })}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="print-no-lessons">
              Na ten tydzień nie wprowadzono planu zajęć.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
