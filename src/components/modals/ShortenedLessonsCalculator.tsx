"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import useModalsStore from "@/stores/modals";
import { useSettingsStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { FC, useMemo } from "react";
import { useCounter } from "usehooks-ts";
import { Button } from "../ui/Button";
import { Counter } from "../ui/Counter";

export const ShortenedLessonsCalculatorModal: FC = () => {
  const enableCustomLessonsLength = useSettingsStore(
    (state) => state.enableCustomLessonsLength,
  );
  const timetable = useTimetableStore((state) => state.timetable);
  const counter = useCounter(4);
  const modalState = useModalsStore((state) =>
    state.getModalState("shortenedLessonsCalculator"),
  );
  const setModalState = useModalsStore((state) => state.setModalState);

  const handleOpenChange = (open: boolean) => {
    setModalState("shortenedLessonsCalculator", { isOpen: open });
  };

  const adjustedLessons = useMemo(() => {
    return adjustShortenedLessons(
      counter.count,
      Object.values(timetable?.hours ?? []),
    );
  }, [counter.count, timetable?.hours]);

  const shortenedLessons = adjustedLessons.slice(0, counter.count);
  const normalLessons = adjustedLessons.slice(counter.count);

  const handleSubmit = () => {
    enableCustomLessonsLength(counter.count);
    handleOpenChange(false);
  };

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Kalkulator skróconych lekcji</DialogTitle>
          <DialogDescription>
            Oblicz, o której godzinie skończysz lekcje na podstawie skróconego
            czasu ich trwania
          </DialogDescription>
        </DialogHeader>

        <Counter {...counter} minCount={4} />

        <div className="mx-auto grid w-full max-w-48 gap-3.5 text-center">
          {shortenedLessons.length > 0 && (
            <div className="grid gap-2">
              <p className="text-xs font-medium text-primary/50">NORMALNE</p>
              <div className="text-base font-medium text-primary/90">
                {shortenedLessons.map((lesson) => (
                  <h3 key={lesson.number}>
                    {lesson.number}. {lesson.timeFrom} - {lesson.timeTo}
                  </h3>
                ))}
              </div>
            </div>
          )}
          {shortenedLessons.length > 0 && normalLessons.length > 0 && (
            <div className="h-px bg-accent-table text-accent-table" />
          )}
          {normalLessons.length > 0 && (
            <div className="grid gap-2">
              <div className="text-base font-medium text-primary/90">
                {normalLessons.map((lesson) => (
                  <h3 key={lesson.number}>
                    {lesson.number}. {lesson.timeFrom} - {lesson.timeTo}
                  </h3>
                ))}
              </div>
              <p className="text-xs font-medium text-primary/50">SKRÓCONE</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>Anuluj</Button>
          <Button variant="primary" onClick={handleSubmit}>
            Zastosuj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
