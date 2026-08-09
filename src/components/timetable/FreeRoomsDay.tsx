"use client";

import { cn } from "@/lib/utils";
import { TableHour } from "@majusss/timetable-parser";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import { DayTabs } from "./DayTabs";

interface FreeRoomsDayProps {
  dayNames: string[];
  hours: TableHour[];
  freeRooms: string[][][];
  roomNames: Map<string, string>;
  todayIndex: number;
}

/**
 * Mobilna wersja wolnych sal. Siatka tydzień × lekcje mieści się dopiero od sm;
 * na telefonie to ściana dwucyfrowych liczb, więc dzień wybiera się zakładkami,
 * a godziny czyta się z listy — dokładnie jak plan lekcji.
 */
export const FreeRoomsDay: FC<FreeRoomsDayProps> = ({
  dayNames,
  hours,
  freeRooms,
  roomNames,
  todayIndex,
}) => {
  const [dayIndex, setDayIndex] = useState(
    todayIndex >= 0 && todayIndex < dayNames.length ? todayIndex : 0,
  );
  const [openHour, setOpenHour] = useState<number | null>(null);

  return (
    <div className="sm:hidden">
      <DayTabs
        dayNames={dayNames}
        selectedDayIndex={dayIndex}
        todayIndex={todayIndex}
        onSelect={(index) => {
          setDayIndex(index);
          setOpenHour(null);
        }}
      />

      <div className="grid gap-2 p-3">
        {hours.map((hour, hourIndex) => {
          const ids = freeRooms[dayIndex]?.[hourIndex] ?? [];
          const isOpen = openHour === hourIndex;
          const isEmpty = ids.length === 0;

          return (
            <Fragment key={hour.number}>
              <button
                onClick={() => setOpenHour(isOpen ? null : hourIndex)}
                aria-expanded={isOpen}
                disabled={isEmpty}
                className={cn(
                  isOpen
                    ? "border-accent-table/45 bg-accent-table/[0.07]"
                    : "border-lines/70 bg-accent/40",
                  isEmpty && "opacity-45",
                  "flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                )}
              >
                <span
                  className={cn(
                    isOpen ? "text-accent-table" : "text-primary/55",
                    "tabular w-4 shrink-0 font-mono text-[11px] font-semibold",
                  )}
                >
                  {hour.number}
                </span>
                <span
                  className={cn(
                    isOpen ? "text-accent-table" : "text-primary/55",
                    "tabular shrink-0 font-mono text-[11px]",
                  )}
                >
                  {hour.timeFrom}–{hour.timeTo}
                </span>
                <span className="text-primary ml-auto text-[13px] font-medium">
                  {isEmpty ? "brak wolnych" : `${ids.length} wolnych`}
                </span>
                {!isEmpty && (
                  <ChevronDown
                    className={cn(
                      isOpen && "rotate-180",
                      "text-primary/35 size-4 shrink-0 transition-transform duration-300",
                    )}
                    strokeWidth={2}
                  />
                )}
              </button>

              {isOpen && (
                <div className="animate-rise flex flex-wrap gap-1.5 pb-1">
                  {ids.map((id) => (
                    <Link
                      key={id}
                      href={`/room/${id}`}
                      className="border-lines/70 bg-accent/40 text-primary/80 active:bg-accent flex min-h-9 items-center rounded-lg border px-3 text-sm transition-colors"
                    >
                      {roomNames.get(id) ?? id}
                    </Link>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
