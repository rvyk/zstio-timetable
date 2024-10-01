"use client";

import { ListItemComponent } from "@/components/sidebar/Dropdown";
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
import { useSettingsWithoutStore } from "@/stores/settings";
import { Frown } from "lucide-react";
import { FC } from "react";

export const FreeRoomsResultModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("freeRoomsResult"),
  );
  const setModalState = useModalsStore((state) => state.setModalState);
  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );

  const handleOpenChange = (open: boolean) => {
    setModalState("freeRoomsResult", { isOpen: open });
  };

  const handleBackToSearch = () => {
    handleOpenChange(false);
    setModalState("freeRoomsSearch", { isOpen: true });
  };

  const handleSelectRoom = () => {
    handleOpenChange(false);
    toggleSettingsPanel();
  };

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wyszukaj wolną salę</DialogTitle>
          <DialogDescription>
            {!!modalState?.results.length
              ? `Znaleziono kilka wolnych sal lekcyjnych (${modalState.results.length}), możesz teraz wybrać jedną z nich`
              : "Nie znaleziono żadnych wolnych sal lekcyjnych, spróbuj ponownie z innymi parametrami"}
          </DialogDescription>
        </DialogHeader>

        {!!modalState?.results.length ? (
          <div className="grid max-h-96 grid-cols-2 gap-4 overflow-auto">
            {modalState.results.map((result) => (
              <ListItemComponent
                onClick={handleSelectRoom}
                key={result.id}
                item={{
                  name: result.title,
                  value: result.id,
                }}
                type="room"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-2">
            <Frown className="mx-auto h-8 w-8 text-primary/70 dark:text-primary/80" />
            <p className="text-center text-sm font-semibold text-primary/70 dark:font-medium">
              Nie znaleziono wolnych sal lekcyjnych
            </p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)} variant="secondary">
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleBackToSearch}>
            Wróć do wyszukiwarki
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
