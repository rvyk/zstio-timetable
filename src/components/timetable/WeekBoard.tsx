"use client";

import { cn, getDayNumberForNextWeek, parseTime } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, useEffect, useMemo, useState } from "react";
import { LessonEntry } from "./LessonCells";

const secondsOfDay = () => {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

/** ?now=HH:MM przesuwa zegar planszy — do podglądu trwającej lekcji. */
const clockOffset = () => {
  const value = new URLSearchParams(window.location.search).get("now");
  if (!value) return 0;
  const [h = 0, m = 0, s = 0] = value.split(":").map(Number);
  return h * 3600 + m * 60 + s - secondsOfDay();
};

/** Jeden zegar na całą planszę — kafelki tylko czytają wynik. */
const useNowSeconds = () => {
  const [now, setNow] = useState(secondsOfDay);

  useEffect(() => {
    const offset = clockOffset();
    const tick = () => setNow(secondsOfDay() + offset);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
};

interface SlotCardProps {
  hour: TableHour;
  lessons: TableLesson[];
  isToday: boolean;
  now: number;
}

const SlotCard: FC<SlotCardProps> = ({ hour, lessons, isToday, now }) => {
  const start = useMemo(() => parseTime(hour.timeFrom), [hour.timeFrom]);
  const end = useMemo(() => parseTime(hour.timeTo), [hour.timeTo]);

  const isLive = isToday && now >= start && now < end;
  const isPast = isToday && now >= end;
  const progress = isLive ? ((now - start) / (end - start)) * 100 : 0;

  const remaining = isLive ? end - now : 0;
  const countdown = `${Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;

  return (
    <article
      className={cn(
        isLive
          ? "border-accent-table/45 bg-accent-table/[0.07]"
          : "border-lines/70 bg-accent/40 hover:border-lines hover:bg-accent",
        isPast && !isLive && "opacity-55",
        "relative grid gap-1.5 overflow-hidden rounded-lg border px-3 py-2.5 transition-colors",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            isLive ? "text-accent-table" : "text-primary/40",
            "tabular font-mono text-[11px] font-semibold",
          )}
        >
          {hour.number}
        </span>
        <span
          className={cn(
            isLive ? "text-accent-table" : "text-primary/40",
            "tabular font-mono text-[11px]",
          )}
        >
          {isLive ? `za ${countdown}` : `${hour.timeFrom}–${hour.timeTo}`}
        </span>
      </div>

      <div className="grid gap-2">
        {lessons.map((lesson, index) => (
          <LessonEntry key={index} lesson={lesson} />
        ))}
      </div>

      {isLive && (
        <div className="bg-primary/10 absolute inset-x-0 bottom-0 h-[3px]">
          <div
            className="bg-accent-table h-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
};

/** Wolna godzina — czytana jako brak, nie jako treść. */
const GapCard: FC<{ hour: TableHour }> = ({ hour }) => (
  <div className="border-lines/60 flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2">
    <span className="text-primary/25 tabular font-mono text-[11px] font-semibold">
      {hour.number}
    </span>
    <span className="text-primary/30 text-xs">okienko</span>
    <span className="text-primary/25 tabular font-mono text-[11px]">
      {hour.timeFrom}–{hour.timeTo}
    </span>
  </div>
);

interface WeekBoardProps {
  dayNames: string[];
  lessons: TableLesson[][][];
  hours: TableHour[];
  todayIndex: number;
}

export const WeekBoard: FC<WeekBoardProps> = ({
  dayNames,
  lessons,
  hours,
  todayIndex,
}) => {
  const now = useNowSeconds();

  return (
    /* @container: liczy się szerokość planszy, nie okna — sidebar zmienia jedno bez drugiego */
    /* isolate: bez tego z-10 nagłówka wychodzi ponad szum z body::before (z-9)
       i przyklejony pasek wygląda jak jaśniejszy prostokąt */
    /* bez pt: górny odstęp daje pt-4 nagłówka, który musi być kryjący przy sticky */
    <div className="@container/board isolate px-4 pb-4">
      <div className="grid grid-cols-1 gap-x-3 gap-y-7 @lg/board:grid-cols-2 @2xl/board:grid-cols-3 @3xl/board:grid-cols-4 @4xl/board:grid-cols-5">
      {dayNames.map((dayName, dayIndex) => {
        const date = getDayNumberForNextWeek(dayName);
        const isToday = dayIndex === todayIndex;

        const allSlots = hours.map((hour, hourIndex) => ({
          hour,
          entries: lessons[dayIndex]?.[hourIndex] ?? [],
        }));

        // Puste sloty po ostatniej lekcji nie niosą informacji; te przed nią
        // i pomiędzy owszem — pokazują późniejszy start i okienka.
        let lastTaken = -1;
        allSlots.forEach((slot, index) => {
          if (slot.entries.length > 0) lastTaken = index;
        });
        const slots = allSlots.slice(0, lastTaken + 1);

        return (
          <section key={dayName} className="flex min-w-0 flex-col gap-2">
            {/* opakowanie kryje kafelki przewijające się pod przyklejonym
                nagłówkiem — sam nagłówek jest zaokrąglony jak kafelki lekcji */}
            {/* -mb-2 zjada gap-2, żeby całe tło pod nagłówkiem było kryjące */}
            <header className="bg-foreground sticky top-0 z-10 -mb-2 pt-4 pb-4">
              <div
                className={cn(
                  "flex items-baseline gap-2 rounded-lg border px-3 py-2",
                  isToday
                    ? "border-accent-table/40 bg-accent-table/[0.07]"
                    : "border-lines/70 bg-accent/40",
                )}
              >
                <span
                  className={cn(
                    isToday ? "text-accent-table" : "text-primary",
                    "tabular text-lg leading-none font-semibold tracking-tight",
                  )}
                >
                  {date.dayNumber.toString().padStart(2, "0")}
                </span>
                <h2
                  className={cn(
                    isToday ? "text-primary" : "text-primary/60",
                    "text-sm leading-none font-medium",
                  )}
                >
                  {dayName}
                </h2>
                {isToday && (
                  <span className="bg-accent-table/12 text-accent-table ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
                    dziś
                  </span>
                )}
              </div>
            </header>

            {slots.length > 0 ? (
              slots.map((slot) =>
                slot.entries.length > 0 ? (
                  <SlotCard
                    key={slot.hour.number}
                    hour={slot.hour}
                    lessons={slot.entries}
                    isToday={isToday}
                    now={now}
                  />
                ) : (
                  <GapCard key={slot.hour.number} hour={slot.hour} />
                ),
              )
            ) : (
              <p className="text-primary/30 px-3 py-2 text-xs">Brak zajęć</p>
            )}
          </section>
        );
      })}
      </div>
    </div>
  );
};
