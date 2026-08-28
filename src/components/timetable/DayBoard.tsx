"use client";

import { useT } from "@/components/common/LocaleProvider";
import { cn, parseTime } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, Fragment, TouchEvent, useRef, useState } from "react";
import { DayTabs } from "./DayTabs";
import { LessonEntry } from "./LessonCells";
import {
  BreakMarker,
  NoLessons,
  buildDaySlots,
  formatCountdown,
  useNowSeconds,
} from "./Slots";

const SWIPE_THRESHOLD = 50;

type Transition = "left" | "right" | "swap";

const TRANSITION_CLASS: Record<Transition, string> = {
  right: "animate-day-in-right",
  left: "animate-day-in-left",
  swap: "animate-day-swap",
};

interface DayBoardProps {
  dayNames: string[];
  lessons: TableLesson[][][];
  hours: TableHour[];
  todayIndex: number;
  selectedDayIndex: number;
  onDayChange: (index: number) => void;
}

export const DayBoard: FC<DayBoardProps> = ({
  dayNames,
  lessons,
  hours,
  todayIndex,
  selectedDayIndex,
  onDayChange,
}) => {
  const translate = useT();
  const now = useNowSeconds();
  const [transition, setTransition] = useState<Transition>("swap");
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number, swipeDirection?: Transition) => {
    if (index === selectedDayIndex) return;

    const step = index - selectedDayIndex;
    setTransition(
      swipeDirection ??
        (Math.abs(step) === 1 ? (step > 0 ? "right" : "left") : "swap"),
    );
    onDayChange(index);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX;
    if (touchStartX.current === null || endX === undefined) return;

    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      const forward = diff < 0;
      const total = dayNames.length;
      const next = (selectedDayIndex + (forward ? 1 : -1) + total) % total;
      goTo(next, forward ? "right" : "left");
    }
    touchStartX.current = null;
  };

  const slots = buildDaySlots(hours, lessons[selectedDayIndex]);
  const dayOver =
    selectedDayIndex === todayIndex &&
    now >= parseTime(slots.at(-1)?.hour.timeTo ?? "00:00");
  const isActiveDay = selectedDayIndex === todayIndex && !dayOver;

  return (
    <div className="flex flex-1 flex-col md:hidden">
      <DayTabs
        dayNames={dayNames}
        selectedDayIndex={selectedDayIndex}
        todayIndex={todayIndex}
        onSelect={goTo}
      />

      <div
        className="flex-1 overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div key={selectedDayIndex} className={TRANSITION_CLASS[transition]}>
          {slots.length > 0 ? (
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                {translate("timetable.dayTable")}
              </caption>
              {/* Szerokość kolumny godzin trzymamy inline — `table-fixed`
                  bierze ją z <col>, a nie z klasy na komórce. */}
              <colgroup>
                <col style={{ width: "5.25rem" }} />
                <col />
              </colgroup>
              <tbody className="[&>tr:last-child>td]:border-b-0">
                {slots.map((slot, index) => {
                  const start = parseTime(slot.hour.timeFrom);
                  const end = parseTime(slot.hour.timeTo);
                  const isLive = isActiveDay && now >= start && now < end;
                  const isPast = isActiveDay && now >= end;
                  const previousEnd =
                    index > 0
                      ? parseTime(slots[index - 1]!.hour.timeTo)
                      : undefined;
                  const showBreak =
                    isActiveDay &&
                    previousEnd !== undefined &&
                    now >= previousEnd &&
                    now < start;
                  const nextStart =
                    index < slots.length - 1
                      ? parseTime(slots[index + 1]!.hour.timeFrom)
                      : undefined;
                  const showBreakAfter =
                    isActiveDay &&
                    nextStart !== undefined &&
                    now >= end &&
                    now < nextStart;
                  /* Oddech dla wierszy stykających się ze znacznikiem przerwy. */
                  const breakPad = cn(
                    showBreak && "pt-6",
                    showBreakAfter && "pb-6",
                  );
                  const progress = isLive
                    ? ((now - start) / (end - start)) * 100
                    : 0;

                  return (
                    <Fragment key={slot.hour.number}>
                      {showBreak && (
                        <tr>
                          <td
                            colSpan={2}
                            className="relative border-0"
                            style={{ padding: 0, height: 0, lineHeight: 0 }}
                          >
                            <BreakMarker
                              from={slots[index - 1]!.hour.timeTo}
                              to={slot.hour.timeFrom}
                              now={now}
                            />
                          </td>
                        </tr>
                      )}
                      <tr
                        className={cn(
                          isLive && "bg-accent-table/[0.07]",
                          isPast && !isLive && "opacity-55",
                        )}
                      >
                        <td
                          className={cn(
                            "border-lines/60 border-b py-2.5 pr-2 pl-3 align-middle",
                            breakPad,
                          )}
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className={cn(
                                isLive
                                  ? "text-accent-table"
                                  : "text-primary/85",
                                "tabular text-[16px] leading-none font-semibold",
                              )}
                            >
                              {slot.hour.number}
                            </span>
                            <span className="text-primary/40 tabular text-center text-[10px] leading-tight tracking-tight whitespace-nowrap">
                              {slot.hour.timeFrom}–{slot.hour.timeTo}
                            </span>
                            {isLive && (
                              <Fragment>
                                <div className="bg-primary/10 mt-0.5 h-0.5 w-full overflow-hidden rounded-full">
                                  <div
                                    className="bg-accent-table h-full transition-[width] duration-1000 ease-linear"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-accent-table tabular font-mono text-[9px] leading-none font-semibold">
                                  {formatCountdown(end - now)}
                                </span>
                              </Fragment>
                            )}
                          </div>
                        </td>
                        <td
                          className={cn(
                            "border-lines/60 border-b py-2.5 pr-3 pl-4 align-middle",
                            breakPad,
                          )}
                        >
                          {slot.entries.length > 0 ? (
                            <div className="grid gap-2">
                              {slot.entries.map((lesson, lessonIndex) => (
                                <LessonEntry
                                  key={lessonIndex}
                                  lesson={lesson}
                                  inline
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-primary/35 text-xs">
                              {translate("timetable.gap")}
                            </span>
                          )}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <NoLessons description={translate("timetable.emptyDay")} />
          )}
        </div>
      </div>
    </div>
  );
};
