"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import { usePresence } from "@/hooks/usePresence";
import { warsawDayIndex } from "@/lib/dates";
import { dayLabel } from "@/lib/i18n";
import { cn, currentLessonIndex, getDayNumberForNextWeek } from "@/lib/utils";
import { ListItem, TableHour } from "@majusss/timetable-parser";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FreeRoomsDay } from "./FreeRoomsDay";

interface FreeRoomsBoardProps {
  dayNames: string[];
  hours: TableHour[];
  freeRooms: string[][][];
  rooms: ListItem[];
}

const NEVER_CHANGES = () => () => {};

export const FreeRoomsBoard: FC<FreeRoomsBoardProps> = ({
  dayNames,
  hours,
  freeRooms,
  rooms,
}) => {
  const locale = useLocale();
  const translate = useT();
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const todayIndex = warsawDayIndex();

  const roomNames = useMemo(
    () => new Map(rooms.map((room) => [room.value, room.name])),
    [rooms],
  );

  const maxFree = useMemo(
    () => Math.max(1, ...freeRooms.flat().map((ids) => ids.length)),
    [freeRooms],
  );

  const nowHourIndex = useSyncExternalStore(
    NEVER_CHANGES,
    () => (todayIndex < dayNames.length ? currentLessonIndex(hours) : null),
    () => null,
  );

  const [autoSelected, setAutoSelected] = useState(false);
  if (!autoSelected && nowHourIndex !== null) {
    setAutoSelected(true);
    setSelected([todayIndex, nowHourIndex]);
  }

  const { isMounted, presenceProps } = usePresence(selected !== null);
  const [shown, setShown] = useState(selected);
  if (selected && selected !== shown) setShown(selected);

  const selectedIds = shown ? (freeRooms[shown[0]]?.[shown[1]] ?? []) : [];

  const resultsRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(true);
  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    if (selected) resultsRef.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <section
      id="plan"
      className="border-lines bg-foreground flex w-full flex-1 flex-col max-md:mb-3 md:overflow-hidden md:rounded-xl md:border md:shadow-(--shadow-soft)"
    >
      <div className="border-lines flex items-center justify-between gap-4 border-b py-2 pr-2 pl-4 max-md:hidden">
        <div className="flex min-w-0 items-baseline gap-x-2.5">
          <h1 className="text-primary text-xl leading-none font-semibold tracking-[-0.02em]">
            {translate("freeRooms.title")}
          </h1>
          <span className="text-primary/40 truncate text-xs max-sm:hidden">
            {translate("freeRooms.hint")}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() =>
              nowHourIndex !== null && setSelected([todayIndex, nowHourIndex])
            }
            disabled={nowHourIndex === null}
            className="border-lines bg-accent hover:bg-accent/60 text-primary/70 hover:text-primary flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors disabled:opacity-40"
          >
            <ClockIcon className="size-4" strokeWidth={2} />
            {translate("freeRooms.now")}
          </button>
          <Link
            href="/"
            className="border-lines bg-accent hover:bg-accent/60 text-primary/70 hover:text-primary flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors"
          >
            <ArrowLeftIcon className="size-4" strokeWidth={2} />
            {translate("freeRooms.back")}
          </Link>
        </div>
      </div>

      <FreeRoomsDay
        dayNames={dayNames}
        hours={hours}
        freeRooms={freeRooms}
        roomNames={roomNames}
        todayIndex={todayIndex}
        nowHourIndex={nowHourIndex}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-3 max-sm:hidden sm:p-4">
        <div className="grid gap-1.5">
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
                  <h2 className="text-primary/60 truncate text-sm leading-none font-medium">
                    <span className="max-sm:hidden">
                      {dayLabel(locale, dayName, "long")}
                    </span>
                    <span className="sm:hidden">
                      {dayLabel(locale, dayName, "short")}
                    </span>
                  </h2>
                </div>
              );
            })}
          </div>

          {hours.map((hour, hourIndex) => (
            <div
              key={hour.number}
              className="animate-rise grid gap-1.5 [--hours-col:2.75rem] sm:[--hours-col:7rem]"
              style={{
                gridTemplateColumns: `var(--hours-col) repeat(${dayNames.length}, minmax(0, 1fr))`,
                animationDelay: `${Math.min(hourIndex, 10) * 30}ms`,
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
                      "rounded-lg border px-2 py-2 text-center transition duration-150 not-disabled:active:scale-95 disabled:opacity-40 sm:px-3 sm:text-left",
                    )}
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

        {isMounted && (
          <div
            ref={resultsRef}
            {...presenceProps}
            className="border-lines data-[state=open]:animate-rise data-[state=closed]:animate-fall mt-4 border-t pt-4"
          >
            <p className="text-primary/40 mb-2 text-[11px] font-medium tracking-[0.06em] uppercase">
              {shown &&
                translate("freeRooms.selection", {
                  day: dayLabel(locale, dayNames[shown[0]] ?? "", "long"),
                  number: hours[shown[1]]?.number ?? "",
                  from: hours[shown[1]]?.timeFrom ?? "",
                  to: hours[shown[1]]?.timeTo ?? "",
                  count: selectedIds.length,
                })}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedIds.map((id, index) => (
                <Link
                  key={id}
                  href={`/room/${id}`}
                  style={{ animationDelay: `${Math.min(index, 14) * 20}ms` }}
                  className="border-lines/70 bg-accent/40 hover:border-lines hover:bg-accent text-primary/80 hover:text-primary animate-rise rounded-lg border px-3 py-1.5 text-sm transition-colors"
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
