"use client";

import { getFreeRooms } from "@/actions/getFreeRooms";
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
import { daysOfWeek } from "@/constants/days";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import useModalsStore from "@/stores/modals";
import { useTimetableStore } from "@/stores/timetable";
import { Dispatch, FC, SetStateAction, useState, useTransition } from "react";
import { useCounter } from "usehooks-ts";

export const FreeRoomsSearchModal: FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const modalState = useModalsStore((state) =>
    state.getModalState("freeRoomsSearch"),
  );
  const setModalState = useModalsStore((state) => state.setModalState);
  const counter = useCounter(1);

  const handleOpenChange = (open: boolean) => {
    setModalState("freeRoomsSearch", { isOpen: open });
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      const results = await getFreeRooms(selectedDay, counter.count - 1);
      handleOpenChange(false);
      setModalState("freeRoomsResult", {
        results,
        isOpen: true,
      });
    });
  };

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>Wyszukaj wolną salę</DialogTitle>
          <DialogDescription>
            Wybierz dzień tygodnia oraz numer lekcji, a wyświetlimy Ci wszystkie
            wolne sale lekcyjne
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 transition-all duration-300">
          <Calendar {...{ selectedDay, setSelectedDay }} />
          <Counter {...counter} minCount={1} />

          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)} variant="secondary">
              Anuluj
            </Button>
            <Button
              disabled={isPending}
              variant="primary"
              onClick={handleSubmit}
            >
              Wyszukaj
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Calendar: FC<{
  selectedDay: number;
  setSelectedDay: Dispatch<SetStateAction<number>>;
}> = ({ selectedDay, setSelectedDay }) => {
  const timetable = useTimetableStore((state) => state.timetable);

  return (
    <div className="flex justify-between">
      {daysOfWeek.slice(0, timetable?.dayNames.length).map((day) => (
        <div
          onClick={() => setSelectedDay(day.index)}
          key={day.short}
          className={cn(
            selectedDay == day.index ? "border-primary/5" : "border-primary/10",
            "group w-full cursor-pointer overflow-hidden border-y text-center transition-all first:rounded-l-sm first:border-l last:rounded-r-sm last:border-r",
          )}
        >
          <div
            className={cn(
              selectedDay == day.index
                ? "bg-primary/15 dark:bg-primary/5"
                : "bg-primary/10",
              "w-full py-3",
            )}
          >
            <p className="text-xs font-medium text-primary/90 sm:text-sm">
              {day.short}
            </p>
          </div>
          <div
            className={cn(
              selectedDay == day.index
                ? "bg-accent-table text-accent-secondary group-hover:bg-accent-table/90 dark:text-primary"
                : "text-primary group-hover:bg-primary/5",
              "grid py-5 transition-all",
            )}
          >
            <h2 className="text-xl font-semibold opacity-90 sm:text-2xl">
              {getDayNumberForNextWeek(day.long).dayNumber}
            </h2>
            <h3 className="text-xs font-medium capitalize opacity-70 sm:text-sm">
              {getDayNumberForNextWeek(day.long).month}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};
