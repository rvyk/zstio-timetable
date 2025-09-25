"use client";

import { TRANSLATION_DICT } from "@/constants/translations";
import type { OptivumTimetable } from "@/types/optivum";
import type { TableHour, TableLesson } from "@majusss/timetable-parser";
import { forwardRef, useMemo } from "react";

interface TimetablePrintSheetProps {
  timetable?: OptivumTimetable;
  hours: TableHour[];
  lessons: TableLesson[][][];
  dayNames: string[];
  mode: "week" | "day";
  dayIndex: number;
  printTimestamp: string;
}

const formatHour = (hour: TableHour) =>
  `${hour.number}. ${hour.timeFrom} – ${hour.timeTo}`;

const formatLessonMeta = (lesson: TableLesson) => {
  const meta: string[] = [];

  if (lesson.teacher) {
    meta.push(lesson.teacher);
  }

  if (lesson.room) {
    meta.push(`Sala ${lesson.room}`);
  }

  if (lesson.groupName) {
    meta.push(`Grupa ${lesson.groupName}`);
  }

  return meta.join(" · ");
};

export const TimetablePrintSheet = forwardRef<
  HTMLDivElement,
  TimetablePrintSheetProps
>(({ timetable, hours, lessons, dayNames, mode, dayIndex, printTimestamp }, ref) => {
  const safeDayIndex = useMemo(() => {
    const maxIndex = Math.max(dayNames.length - 1, 0);
    if (maxIndex < 0) return 0;

    return Math.min(Math.max(dayIndex, 0), maxIndex);
  }, [dayIndex, dayNames.length]);

  const activeDayNames = useMemo(() => {
    if (mode === "day") {
      return dayNames.length ? [dayNames[safeDayIndex] ?? ""] : [];
    }

    return dayNames;
  }, [dayNames, mode, safeDayIndex]);

  const activeLessons = useMemo(() => {
    if (mode === "day") {
      return [lessons[safeDayIndex] ?? []];
    }

    return lessons;
  }, [lessons, mode, safeDayIndex]);

  const hasLessons = useMemo(
    () =>
      activeLessons.some((day) =>
        day.some((hourLessons) => hourLessons.length > 0),
      ),
    [activeLessons],
  );

  const titleLabel = useMemo(() => {
    if (!timetable?.title) {
      return "Plan lekcji";
    }

    const typeLabel = TRANSLATION_DICT[timetable.type];

    return `Plan lekcji ${typeLabel} ${timetable.title}`;
  }, [timetable]);

  const subtitleLabel = useMemo(() => {
    if (!timetable) {
      return "";
    }

    return `Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}`;
  }, [timetable]);

  return (
    <div
      ref={ref}
      className="print-sheet w-[210mm] max-w-full bg-white p-8 text-slate-900"
    >
      <header className="border-b border-slate-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {subtitleLabel}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{titleLabel}</h1>
        <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {timetable?.generatedDate && (
            <div>
              <dt className="font-semibold text-slate-500">Wygenerowano</dt>
              <dd className="mt-0.5 text-slate-800">{timetable.generatedDate}</dd>
            </div>
          )}
          {timetable?.validDate && (
            <div>
              <dt className="font-semibold text-slate-500">Obowiązuje od</dt>
              <dd className="mt-0.5 text-slate-800">{timetable.validDate}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-slate-500">Zakres wydruku</dt>
            <dd className="mt-0.5 text-slate-800">
              {mode === "day"
                ? activeDayNames[0] ?? ""
                : "Cały plan tygodniowy"}
            </dd>
          </div>
          {printTimestamp && (
            <div>
              <dt className="font-semibold text-slate-500">Data wydruku</dt>
              <dd className="mt-0.5 text-slate-800">{printTimestamp}</dd>
            </div>
          )}
        </dl>
      </header>

      <section className="mt-6">
        {activeDayNames.length === 0 ? (
          <p className="text-sm text-slate-600">
            Brak danych o dniach tygodnia do wyświetlenia.
          </p>
        ) : (
          <table className="min-w-full table-fixed border-collapse text-sm shadow-[0_0_0_1px_rgb(229_231_235)]">
            <thead>
              <tr className="bg-slate-100 text-left text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <th className="w-40 border border-slate-200 px-4 py-3 align-middle text-slate-700">
                  Godzina
                </th>
                {activeDayNames.map((dayName, index) => (
                  <th
                    key={`${dayName}-${index}`}
                    className="border border-slate-200 px-4 py-3 align-middle text-slate-700"
                  >
                    {dayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, hourIndex) => (
                <tr
                  key={`${hour.number}-${hour.timeFrom}-${hour.timeTo}`}
                  className={hourIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="whitespace-nowrap border border-slate-200 px-4 py-3 align-top font-semibold text-slate-800">
                    {formatHour(hour)}
                  </td>
                  {activeLessons.map((day, dayIdx) => {
                    const lessonsForHour = day[hourIndex] ?? [];

                    return (
                      <td
                        key={`${hour.number}-${dayIdx}`}
                        className="border border-slate-200 px-4 py-3 align-top text-slate-800"
                      >
                        {lessonsForHour.length === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <div className="space-y-3">
                            {lessonsForHour.map((lesson, idx) => (
                              <div key={idx} className="space-y-1">
                                <p className="text-base font-semibold leading-tight text-slate-900">
                                  {lesson.subject}
                                  {lesson.groupName && (
                                    <span className="text-sm font-medium text-slate-600">
                                      {` (${lesson.groupName})`}
                                    </span>
                                  )}
                                </p>
                                {formatLessonMeta(lesson) && (
                                  <p className="text-[13px] font-medium leading-relaxed text-slate-600">
                                    {formatLessonMeta(lesson)}
                                  </p>
                                )}
                                {lesson.className && lesson.className !== timetable?.title && (
                                  <p className="text-[13px] text-slate-500">
                                    {lesson.className}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!hasLessons && (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Dla wybranego zakresu nie znaleziono żadnych zajęć.
          </p>
        )}
      </section>
    </div>
  );
});

TimetablePrintSheet.displayName = "TimetablePrintSheet";
