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

export const FreeRoomsSearchModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("freeRoomsSearch"),
  );
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
      </DialogContent>
    </Dialog>
  );
};
