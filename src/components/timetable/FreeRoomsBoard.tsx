"use client";

import { DAYS_OF_WEEK } from "@/constants/days";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { ListItem, TableHour } from "@majusss/timetable-parser";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FreeRoomsDay } from "./FreeRoomsDay";

interface FreeRoomsBoardProps {
  dayNames: string[];
  hours: TableHour[];
  /** [dzień][lekcja] → identyfikatory wolnych sal */
  freeRooms: string[][][];
  rooms: ListItem[];
}

export const FreeRoomsBoard: FC<FreeRoomsBoardProps> = ({
  dayNames,
  hours,
  freeRooms,
  rooms,
}) => {
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const todayIndex = (new Date().getDay() + 6) % 7;

  const roomNames = useMemo(
    () => new Map(rooms.map((room) => [room.value, room.name])),
    [rooms],
  );

  const maxFree = useMemo(
    () => Math.max(1, ...freeRooms.flat().map((ids) => ids.length)),
    [freeRooms],
  );

  const selectedIds = selected
    ? (freeRooms[selected[0]]?.[selected[1]] ?? [])
    : [];

  // na telefonie lista ląduje pod całą siatką, poza ekranem — przewijamy do niej
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) resultsRef.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <section
      id="plan"
      className="border-lines bg-foreground flex w-full flex-1 flex-col max-md:mb-3 md:overflow-hidden md:rounded-xl md:border md:shadow-(--shadow-soft)"
    >
      <div className="border-lines flex items-center justify-between gap-4 border-b py-2 pr-2 pl-4">
        <div className="flex min-w-0 items-baseline gap-x-2.5">
          <h1 className="text-primary text-xl leading-none font-semibold tracking-[-0.02em]">
            Wolne sale
          </h1>
          <span className="text-primary/40 truncate text-xs max-sm:hidden">
            Cały tydzień naraz — wybierz kratkę, żeby zobaczyć listę
          </span>
        </div>
        {/* "/" wraca na ostatnio oglądany plan (cookie lastVisited) */}
        <Link
          href="/"
          className="border-lines bg-accent hover:bg-accent/60 text-primary/70 hover:text-primary flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors"
        >
          <ArrowLeftIcon className="size-4" strokeWidth={2} />
          Plan
        </Link>
      </div>

      <FreeRoomsDay
        dayNames={dayNames}
        hours={hours}
        freeRooms={freeRooms}
        roomNames={roomNames}
        todayIndex={todayIndex}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-3 max-sm:hidden sm:p-4">
        <div className="grid gap-1.5">
          {/* nagłówek: godziny po lewej, dni w kolumnach — jak w planie */}
          <div
            className="grid gap-1.5 [--hours-col:2.75rem] sm:[--hours-col:7rem]"
            style={{
              gridTemplateColumns: `var(--hours-col) repeat(${dayNames.length}, minmax(0, 1fr))`,
            }}
          >
            <span />
            {dayNames.map((dayName, dayIndex) => {
              const date = getDayNumberForNextWeek(dayName);
              const isToday = dayIndex === todayIndex;

              return (
                <div
                  key={dayName}
                  className={cn(
                    isToday
                      ? "border-accent-table/40 bg-accent-table/[0.07]"
                      : "border-lines/70 bg-accent/40",
                    "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2 sm:flex-row sm:items-baseline sm:justify-start sm:gap-2 sm:px-3",
                  )}
                >
                  <span
                    className={cn(
                      isToday ? "text-accent-table" : "text-primary",
                      "tabular text-base leading-none font-semibold tracking-tight sm:text-lg",
                    )}
                  >
                    {date.dayNumber.toString().padStart(2, "0")}
                  </span>
                  {/* pełna nazwa nie mieści się w kolumnie na telefonie */}
                  <h2 className="text-primary/60 truncate text-sm leading-none font-medium">
                    <span className="max-sm:hidden">{dayName}</span>
                    <span className="sm:hidden">
                      {DAYS_OF_WEEK.find((day) => day.long === dayName)?.short}
                    </span>
                  </h2>
                </div>
              );
            })}
          </div>

          {hours.map((hour, hourIndex) => (
            <div
              key={hour.number}
              className="grid gap-1.5 [--hours-col:2.75rem] sm:[--hours-col:7rem]"
              style={{
                gridTemplateColumns: `var(--hours-col) repeat(${dayNames.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="border-lines/70 bg-accent/40 flex items-baseline justify-center gap-1 rounded-lg border px-2 py-2 sm:justify-between sm:px-3">
                <span className="text-primary/40 tabular font-mono text-[11px] font-semibold">
                  {hour.number}
                </span>
                <span className="text-primary/40 tabular font-mono text-[11px] max-sm:hidden">
                  {hour.timeFrom}
                </span>
              </div>

              {dayNames.map((dayName, dayIndex) => {
                const count = freeRooms[dayIndex]?.[hourIndex]?.length ?? 0;
                const isSelected =
                  selected?.[0] === dayIndex && selected[1] === hourIndex;

                return (
                  <button
                    key={dayName}
                    onClick={() =>
                      setSelected(isSelected ? null : [dayIndex, hourIndex])
                    }
                    aria-pressed={isSelected}
                    disabled={count === 0}
                    className={cn(
                      isSelected
                        ? "border-accent-table bg-accent-table/[0.07]"
                        : "border-lines/70 hover:border-lines",
                      "rounded-lg border px-2 py-2 text-center transition-colors disabled:opacity-40 sm:px-3 sm:text-left",
                    )}
                    /* nasycenie tła niesie liczbę wolnych sal — widać gorące
                       godziny bez czytania cyfr */
                    style={{
                      backgroundColor: isSelected
                        ? undefined
                        : `rgb(var(--primary) / ${(count / maxFree) * 0.07})`,
                    }}
                  >
                    <span
                      className={cn(
                        count === 0 ? "text-primary/25" : "text-primary/80",
                        "tabular font-mono text-xs",
                      )}
                    >
                      {count || "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {selected && (
          <div
            ref={resultsRef}
            className="border-lines animate-rise mt-4 border-t pt-4"
          >
            <p className="text-primary/40 mb-2 text-[11px] font-medium tracking-[0.06em] uppercase">
              {dayNames[selected[0]]}, lekcja {hours[selected[1]]?.number} (
              {hours[selected[1]]?.timeFrom}–{hours[selected[1]]?.timeTo}) —{" "}
              {selectedIds.length} wolnych
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedIds.map((id) => (
                <Link
                  key={id}
                  href={`/room/${id}`}
                  className="border-lines/70 bg-accent/40 hover:border-lines hover:bg-accent text-primary/80 hover:text-primary rounded-lg border px-3 py-1.5 text-sm transition-colors"
                >
                  {roomNames.get(id) ?? id}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
