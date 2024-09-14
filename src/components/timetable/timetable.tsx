"use client";

import { Button } from "@/components/ui/button";
import { translationDict } from "@/constants/translates";
import { cn, simulateKeyPress } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings-store";
import { OptivumTimetable } from "@/types/optivum";
import { ArrowLeft, ArrowRight, Shrink } from "lucide-react";
import {
  ShortLessonSwitcherCell,
  TableHeaderCell,
  TableHourCell,
} from "./cells";
import { TableLessonCell } from "./lessons";

export const Timetable: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable }) => {
  const isFullscreenMode =
    useSettingsWithoutStore((state) => state.isFullscreenMode) ?? false;

  // TODO: MAKE IT COMPATIBLE WITH FULLSCREEN MODE
  // if (timetable.lessons.some((innerArray) => innerArray.length === 0)) {
  //   return null;
  // }

  return (
    <div
      className={cn(
        isFullscreenMode
          ? "fixed left-0 top-0 z-40 h-full min-h-screen w-screen rounded-none"
          : "h-fit w-full rounded-md",
        "overflow-hidden border border-lines bg-foreground transition-all",
      )}
    >
      <div className="h-full w-full overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-lines border-b border-lines">
              <ShortLessonSwitcherCell />
              {timetable?.dayNames.map((dayName) => (
                <TableHeaderCell key={dayName} dayName={dayName} />
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(timetable?.hours)
              .map(([, value]) => value)
              .map((hour, lessonIndex) => (
                <tr
                  key={lessonIndex}
                  className="divide-x divide-lines border-b border-lines odd:bg-accent/50 odd:dark:bg-background"
                >
                  <TableHourCell hour={hour} />
                  {timetable?.lessons.map((day, dayIndex) => (
                    <TableLessonCell
                      key={dayIndex}
                      day={day}
                      lessonIndex={lessonIndex}
                    />
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isFullscreenMode && <FullScreenControlls {...{ timetable }} />}
    </div>
  );
};

const FullScreenControlls: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable: { title, type } }) => {
  const toggleFullscreenMode = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );

  const shortenedTitle =
    title && title.length > 16 ? `${title.slice(0, 16)}...` : title;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 grid w-full place-content-center">
      <div className="flex items-center justify-center gap-x-4 opacity-20 hover:opacity-100">
        <Button
          aria-label="Poprzednia klasa/nauczyciel/sala"
          variant="icon"
          size="icon"
          onClick={() => simulateKeyPress("ArrowLeft", 37)}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Button>
        <div className="flex h-14 min-w-96 items-center justify-between rounded-md border border-lines bg-accent pl-4 pr-2 dark:border-primary/10">
          <h1 className="text-lg font-medium text-primary/90">
            {title ? (
              <>
                Rozkład zajęć {translationDict[type]}{" "}
                <span className="font-semibold">{shortenedTitle}</span>
              </>
            ) : (
              "Nie znaleziono planu zajęć"
            )}
          </h1>

          <Button
            aria-label="Wyjdź z trybu pełnoekranowego"
            variant="icon"
            size="icon"
            onClick={toggleFullscreenMode}
          >
            <Shrink size={20} strokeWidth={2.5} />
          </Button>
        </div>
        <Button
          aria-label="Następna klasa/nauczyciel/sala"
          variant="icon"
          size="icon"
          onClick={() => simulateKeyPress("ArrowRight", 39)}
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};
