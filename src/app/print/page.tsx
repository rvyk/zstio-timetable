"use client";

import { DAYS_OF_WEEK } from "@/constants/days";
import { useTimetableStore } from "@/stores/timetable";
import { useEffect } from "react";
import { useIsClient } from "usehooks-ts";

const DEFAULT_DAYS = DAYS_OF_WEEK.slice(0, 5).map((day) => day.long);

export default function PrintPage() {
  const { timetable } = useTimetableStore();
  const isMounted = useIsClient();

  // strona otwiera się z przycisku „Drukuj plan” — od razu podnosimy dialog druku
  useEffect(() => {
    if (isMounted && timetable) window.print();
  }, [isMounted, timetable]);

  if (!isMounted) return null;

  if (!timetable) {
    return (
      <p className="p-8 text-black">
        Brak danych planu lekcji — wróć na stronę główną, aby go wczytać.
      </p>
    );
  }

  const { title, dayNames, hours, lessons } = timetable;
  const days = dayNames.length > 0 ? dayNames : DEFAULT_DAYS;
  const hourKeys = Object.keys(hours).map(Number);
  const maxHours = hourKeys.length > 0 ? Math.max(...hourKeys) : 0;

  return (
    <div className="w-full bg-white p-6 text-black print:p-0">
      <h1 className="mb-6 text-center text-3xl font-bold">{title}</h1>

      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-100 print:bg-gray-100">
            <th className="w-16 border border-gray-400 p-2">Nr</th>
            <th className="w-32 border border-gray-400 p-2">Godziny</th>
            {days.map((day) => (
              <th key={day} className="border border-gray-400 p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxHours }).map((_, hourIndex) => {
            const hourNum = hourIndex + 1;
            const hourData = hours[hourNum];
            if (!hourData) return null;

            return (
              <tr key={hourNum} className="break-inside-avoid">
                <td className="border border-gray-400 p-2 text-center font-medium">
                  {hourNum}
                </td>
                <td className="border border-gray-400 p-2 text-center whitespace-nowrap">
                  {hourData.timeFrom} - {hourData.timeTo}
                </td>
                {days.map((_, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="min-w-30 border border-gray-400 p-2 text-center align-top"
                  >
                    {(lessons?.[dayIndex]?.[hourIndex] ?? []).map(
                      (lesson, index) => (
                        <div
                          key={index}
                          className={
                            index > 0
                              ? "mt-2 border-t border-gray-200 pt-2"
                              : ""
                          }
                        >
                          <div className="font-semibold">{lesson.subject}</div>
                          <div className="text-xs text-gray-600">
                            {lesson.teacher && <span>{lesson.teacher} </span>}
                            {lesson.room && <span>s. {lesson.room}</span>}
                          </div>
                        </div>
                      ),
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
