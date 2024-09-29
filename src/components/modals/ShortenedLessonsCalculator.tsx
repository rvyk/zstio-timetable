"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import useModalsStore from "@/stores/modals";
import { FC } from "react";

export const ShortenedLessonsCalculatorModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("shortenedLessonsCalculator"),
  );
  const setModalState = useModalsStore((state) => state.setModalState);

  const handleOpenChange = (open: boolean) => {
    setModalState("shortenedLessonsCalculator", { isOpen: open });
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
      </DialogContent>
    </Dialog>
  );
};
