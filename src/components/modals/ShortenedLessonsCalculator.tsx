"use client";

import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { NORMAL_HOURS } from "@/constants/settings";
import { toast } from "@/hooks/useToast";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import useModalsStore from "@/stores/modals";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { FC, useMemo } from "react";
import { useCounter } from "usehooks-ts";

export const ShortenedLessonsCalculatorModal: FC = () => {
  const enableCustomLessonsLength = useSettingsStore(
    (state) => state.enableCustomLessonsLength,
  );
  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );
  const setModalState = useModalsStore((state) => state.setModalState);
  const modalState = useModalsStore((state) =>
    state.getModalState("shortenedLessonsCalculator"),
  );
  const counter = useCounter(5);

  const handleOpenChange = (open: boolean) => {
    setModalState("shortenedLessonsCalculator", { isOpen: open });
  };

  const adjustedLessons = useMemo(() => {
    return adjustShortenedLessons(counter.count, Object.values(NORMAL_HOURS));
  }, [counter.count]);

  const shortenedLessons = adjustedLessons.slice(
    counter.count - 4,
    counter.count - 1,
  );
  const normalLessons = adjustedLessons.slice(
    counter.count - 1,
    counter.count + 2,
  );

  const handleSubmit = () => {
    enableCustomLessonsLength(counter.count);
    handleOpenChange(false);
    toggleSettingsPanel();

    toast({
      title: "Pomyślnie zastosowano",
      description: `Od ${counter.count} godziny lekcyjnej zastosowano skrócony czas trwania lekcji`,
    });
  };

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kalkulator skróconych lekcji</DialogTitle>
          <DialogDescription>
            Oblicz, o której godzinie skończysz lekcje na podstawie skróconego
            czasu ich trwania
          </DialogDescription>
        </DialogHeader>

        <Counter {...counter} minCount={5} />

        <div className="mx-auto grid w-full max-w-48 gap-3.5 text-center">
          {shortenedLessons.length > 0 && (
            <div className="grid gap-2">
              <p className="text-xs font-medium text-primary/50">NORMALNE</p>
              <div className="text-sm font-medium text-primary/90 sm:text-base">
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
              <div className="text-sm font-medium text-primary/90 sm:text-base">
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
          <Button onClick={() => handleOpenChange(false)} variant="secondary">
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Zastosuj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
