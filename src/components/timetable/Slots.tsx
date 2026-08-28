"use client";

import { useT } from "@/components/common/LocaleProvider";
import { parseTime } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { CalendarX2, Coffee } from "lucide-react";
import { FC, useSyncExternalStore } from "react";

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

let currentSeconds = -1;
let offset = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

const tick = () => {
  currentSeconds = secondsOfDay() + offset;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) {
    offset = clockOffset();
    tick();
    timer = setInterval(tick, 1000);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearInterval(timer);
  };
};

export const useNowSeconds = () =>
  useSyncExternalStore(
    subscribe,
    () => currentSeconds,
    () => -1,
  );

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

export const formatCountdown = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

/** Znacznik przerwy — leży na granicy dwóch wierszy, żeby nie rozdzielać
    tabeli i nie przerywać pionowych linii kolumn. Renderuje się tylko wtedy,
    gdy przerwa właśnie trwa; rodzic musi być `relative` i mieć zerową wysokość. */
export const BreakMarker: FC<{ from: string; to: string; now: number }> = ({
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
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex -translate-y-1/2 items-center gap-2 px-3">
      <span className="border-accent-table/35 bg-foreground text-accent-table flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium">
        <Coffee className="size-3" strokeWidth={2} />
        {translate("timetable.break")}
        <span className="tabular font-mono font-semibold">
          {formatCountdown(end - now)}
        </span>
      </span>
      <span className="bg-primary/10 h-px flex-1 overflow-hidden rounded-full">
        <span
          className="bg-accent-table/50 block h-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </span>
    </div>
  );
};

export const NoLessons: FC<{ description: string }> = ({ description }) => {
  const translate = useT();

  return (
    <div className="animate-rise flex w-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="border-lines bg-accent grid size-12 place-content-center rounded-xl border">
        <CalendarX2
          className="text-primary size-5 opacity-55"
          strokeWidth={1.75}
        />
      </div>
      <div className="grid gap-1">
        <h2 className="text-primary/95 text-base font-medium tracking-tight">
          {translate("timetable.empty")}
        </h2>
        <p className="text-primary/65 max-w-xs text-sm">{description}</p>
      </div>
    </div>
  );
};
