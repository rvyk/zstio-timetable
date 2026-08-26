"use client";

import { useT } from "@/components/common/LocaleProvider";
import { cn } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, TouchEvent, useRef, useState } from "react";
import { DayTabs } from "./DayTabs";
import { DaySlots, NoLessons, buildDaySlots, useNowSeconds } from "./Slots";

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
  const isToday = selectedDayIndex === todayIndex;

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
        <div
          key={selectedDayIndex}
          className={cn(TRANSITION_CLASS[transition], "grid gap-2 p-3")}
        >
          {slots.length > 0 ? (
            <DaySlots slots={slots} isToday={isToday} now={now} />
          ) : (
            <NoLessons description={translate("timetable.emptyDay")} />
          )}
        </div>
      </div>
    </div>
  );
};
