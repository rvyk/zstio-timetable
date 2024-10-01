"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import useModalsStore from "@/stores/modals";
import { FC } from "react";
import { ListItemComponent } from "../sidebar/Dropdown";

export const FreeRoomsResultModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("freeRoomsResult"),
  );

  const setModalState = useModalsStore((state) => state.setModalState);

  const handleOpenChange = (open: boolean) => {
    setModalState("freeRoomsResult", { isOpen: open });
  };

  const handleBackToSearch = () => {
    handleOpenChange(false);
    setModalState("freeRoomsSearch", { isOpen: true });
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

        <div className="grid max-h-96 grid-cols-2 gap-4 overflow-auto pr-2">
          {modalState?.results.map((result) => (
            <ListItemComponent
              key={result.id}
              item={{
                name: result.title,
                value: result.id,
              }}
              type="room"
            />
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>Anuluj</Button>
          <Button variant="primary" onClick={handleBackToSearch}>
            Wróć do wyszukiwarki
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
