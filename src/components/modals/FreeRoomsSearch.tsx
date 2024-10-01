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
import { daysOfWeek } from "@/constants/days";
import { getDayNumberForNextWeek } from "@/lib/utils";
import useModalsStore from "@/stores/modals";
import { useTimetableStore } from "@/stores/timetable";
import { FC } from "react";
import { useCounter } from "usehooks-ts";

export const FreeRoomsSearchModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("freeRoomsSearch"),
  );
  const counter = useCounter(1);
  const setModalState = useModalsStore((state) => state.setModalState);

  const handleOpenChange = (open: boolean) => {
    setModalState("freeRoomsSearch", { isOpen: open });
  };

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wyszukaj wolną salę</DialogTitle>
          <DialogDescription>
            Wybierz dzień tygodnia oraz numer lekcji, a wyświetlimy Ci wszystkie
            wolne sale lekcyjne
          </DialogDescription>
        </DialogHeader>

        <Calendar />
        <Counter {...counter} minCount={1} />

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>Anuluj</Button>
          <Button variant="primary">Zastosuj</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Calendar: FC = () => {
  const timetable = useTimetableStore((state) => state.timetable);

  return (
    <div className="flex justify-between">
      {daysOfWeek.slice(0, timetable?.dayNames.length).map((day) => (
        <div
          key={day.short}
          className="w-full overflow-hidden border-y border-primary/10 text-center first:rounded-l-sm first:border-l last:rounded-r-sm last:border-r"
        >
          <div className="w-full bg-primary/10 py-3">
            <p className="text-sm font-medium text-primary/90">{day.short}</p>
          </div>
          <div className="grid py-6">
            <h2 className="text-2xl font-semibold text-primary/90">
              {getDayNumberForNextWeek(day.long).day}
            </h2>
            <h3 className="text-sm font-medium capitalize text-primary/70">
              {getDayNumberForNextWeek(day.long).month}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};
