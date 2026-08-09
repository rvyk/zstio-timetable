"use client";

import { cn } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { FC, TouchEvent, useRef, useState } from "react";
import { DayTabs } from "./DayTabs";
import {
  GapCard,
  NoLessons,
  SlotCard,
  buildDaySlots,
  useNowSeconds,
} from "./Slots";

const SWIPE_THRESHOLD = 50;

interface DayBoardProps {
  dayNames: string[];
  lessons: TableLesson[][][];
  hours: TableHour[];
  todayIndex: number;
  selectedDayIndex: number;
  onDayChange: (index: number) => void;
}

/**
 * Mobilny odpowiednik planszy tygodnia: ten sam kafelek, jedna kolumna, jeden
 * dzień naraz. Renderujemy tylko wybrany dzień — dzięki temu wysokość ekranu
 * odpowiada treści, a nie najdłuższemu dniu tygodnia.
 */
export const DayBoard: FC<DayBoardProps> = ({
  dayNames,
  lessons,
  hours,
  todayIndex,
  selectedDayIndex,
  onDayChange,
}) => {
  const now = useNowSeconds();
  const [direction, setDirection] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    if (index === selectedDayIndex) return;
    setDirection(index > selectedDayIndex ? "right" : "left");
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
      const total = dayNames.length;
      const next = (selectedDayIndex + (diff < 0 ? 1 : -1) + total) % total;
      goTo(next);
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
          /* key wymusza remount przy zmianie dnia, więc animacja wejścia gra
             przy każdym przełączeniu, a nie tylko przy pierwszym renderze */
          key={selectedDayIndex}
          className={cn(
            direction === "right"
              ? "animate-day-in-right"
              : "animate-day-in-left",
            "grid gap-2 p-3",
          )}
        >
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
            <NoLessons description="Na ten dzień nie wprowadzono planu zajęć" />
          )}
        </div>
      </div>
    </div>
  );
};
