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
import { DAYS_OF_WEEK } from "@/constants/days";
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
    <div className="grid grid-cols-5 gap-2">
      {DAYS_OF_WEEK.slice(0, timetable?.dayNames.length).map((day) => {
        const isSelected = selectedDay == day.index;
        const date = getDayNumberForNextWeek(day.long);

        return (
          <button
            type="button"
            onClick={() => setSelectedDay(day.index)}
            key={day.short}
            aria-pressed={isSelected}
            className={cn(
              isSelected
                ? "border-accent-table bg-accent-table/8 text-primary"
                : "border-lines text-primary/60 hover:border-primary/20 hover:text-primary",
              "grid gap-1.5 rounded-lg border px-1 py-3 text-center transition-colors active:scale-[0.97]",
            )}
          >
            <span className="text-[11px] font-medium">{day.short}</span>
            <span
              className={cn(
                isSelected && "text-accent-table",
                "tabular text-xl leading-none font-semibold tracking-tight",
              )}
            >
              {date.dayNumber}
            </span>
            <span className="text-primary/40 text-[11px] capitalize">
              {date.month}
            </span>
          </button>
        );
      })}
    </div>
  );
};
