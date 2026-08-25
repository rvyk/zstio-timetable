"use client";

import { useT } from "@/components/common/LocaleProvider";
import { cn, parseTime } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { CalendarX2, Coffee } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { LessonEntry } from "./LessonCells";

const secondsOfDay = () => {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

const clockOffset = () => {
  const value = new URLSearchParams(window.location.search).get("now");
  if (!value) return 0;
  const [h = 0, m = 0, s = 0] = value.split(":").map(Number);
  return h * 3600 + m * 60 + s - secondsOfDay();
};

export const useNowSeconds = () => {
  const [now, setNow] = useState(-1);

  useEffect(() => {
    const offset = clockOffset();
    const tick = () => setNow(secondsOfDay() + offset);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
};

export interface DaySlot {
  hour: TableHour;
  entries: TableLesson[];
}

export const buildDaySlots = (
  hours: TableHour[],
  dayLessons: TableLesson[][] | undefined,
): DaySlot[] => {
  const all = hours.map((hour, hourIndex) => ({
    hour,
    entries: dayLessons?.[hourIndex] ?? [],
  }));

  let lastTaken = -1;
  all.forEach((slot, index) => {
    if (slot.entries.length > 0) lastTaken = index;
  });

  return all.slice(0, lastTaken + 1);
};

const formatCountdown = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

interface SlotCardProps {
  hour: TableHour;
  lessons: TableLesson[];
  isToday: boolean;
  now: number;
}

export const SlotCard: FC<SlotCardProps> = ({
  hour,
  lessons,
  isToday,
  now,
}) => {
  const translate = useT();
  const start = useMemo(() => parseTime(hour.timeFrom), [hour.timeFrom]);
  const end = useMemo(() => parseTime(hour.timeTo), [hour.timeTo]);

  const isLive = isToday && now >= start && now < end;
  const isPast = isToday && now >= end;
  const progress = isLive ? ((now - start) / (end - start)) * 100 : 0;

  return (
    <article
      className={cn(
        isLive
          ? "border-lines bg-accent shadow-lg shadow-black/30"
          : "border-lines/70 bg-accent/40 hover:border-lines hover:bg-accent",
        isPast && !isLive && "opacity-55",
        "relative grid gap-1.5 rounded-lg border px-3 py-2.5 transition-colors",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {isLive ? (
          <span className="bg-accent-table rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-white uppercase">
            {translate("timetable.now")}
          </span>
        ) : (
          <span className="text-primary/55 tabular font-mono text-[11px] font-semibold">
            {hour.number}
          </span>
        )}
        <span
          className={cn(
            isLive ? "text-accent-table font-semibold" : "text-primary/55",
            "tabular font-mono text-[11px]",
          )}
        >
          {isLive
            ? formatCountdown(end - now)
            : `${hour.timeFrom}–${hour.timeTo}`}
        </span>
      </div>

      <div className="grid gap-2">
        {lessons.map((lesson, index) => (
          <LessonEntry key={index} lesson={lesson} />
        ))}
      </div>

      {isLive && (
        <div className="bg-primary/10 mt-0.5 h-0.5 overflow-hidden rounded-full">
          <div
            className="bg-accent-table h-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
};

/** Divider shown between two cards while the break between them is running. */
export const BreakRow: FC<{ from: string; to: string; now: number }> = ({
  from,
  to,
  now,
}) => {
  const translate = useT();
  const start = parseTime(from);
  const end = parseTime(to);
  if (now < start || now >= end) return null;

  const progress = ((now - start) / (end - start)) * 100;

  return (
    <div className="animate-rise flex items-center gap-2 px-1 py-0.5">
      <Coffee className="text-accent-table size-3 shrink-0" strokeWidth={2} />
      <span className="text-accent-table/80 text-[11px] font-medium">
        {translate("timetable.break")}
      </span>
      <div className="bg-primary/10 h-px flex-1 overflow-hidden rounded-full">
        <div
          className="bg-accent-table/50 h-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-accent-table tabular font-mono text-[11px]">
        {formatCountdown(end - now)}
      </span>
    </div>
  );
};

export const NoLessons: FC<{ description: string }> = ({ description }) => {
  const translate = useT();

  return (
    <div className="animate-rise flex w-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="border-lines bg-accent grid size-12 place-content-center rounded-xl border">
        <CalendarX2 className="text-primary/40 size-5" strokeWidth={1.75} />
      </div>
      <div className="grid gap-1">
        <h2 className="text-primary/90 text-base font-medium tracking-tight">
          {translate("timetable.empty")}
        </h2>
        <p className="text-primary/50 max-w-xs text-sm">{description}</p>
      </div>
    </div>
  );
};

export const GapCard: FC<{ hour: TableHour }> = ({ hour }) => {
  const translate = useT();

  return (
    <div className="border-lines/60 flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2">
      <span className="text-primary/25 tabular font-mono text-[11px] font-semibold">
        {hour.number}
      </span>
      <span className="text-primary/30 text-xs">
        {translate("timetable.gap")}
      </span>
      <span className="text-primary/25 tabular font-mono text-[11px]">
        {hour.timeFrom}–{hour.timeTo}
      </span>
    </div>
  );
};
