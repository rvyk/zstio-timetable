"use client";

import { cn } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, Fragment, TouchEvent, useRef, useState } from "react";
import { DayTabs } from "./DayTabs";
import {
  BreakRow,
  GapCard,
  NoLessons,
  SlotCard,
  buildDaySlots,
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
            slots.map((slot, index) => (
              <Fragment key={slot.hour.number}>
                {isToday && index > 0 && (
                  <BreakRow
                    from={slots[index - 1]!.hour.timeTo}
                    to={slot.hour.timeFrom}
                    now={now}
                  />
                )}
                {slot.entries.length > 0 ? (
                  <SlotCard
                    hour={slot.hour}
                    lessons={slot.entries}
                    isToday={isToday}
                    now={now}
                  />
                ) : (
                  <GapCard hour={slot.hour} />
                )}
              </Fragment>
            ))
          ) : (
            <NoLessons description="Na ten dzień nie wprowadzono planu zajęć" />
          )}
        </div>
      </div>
    </div>
  );
};
