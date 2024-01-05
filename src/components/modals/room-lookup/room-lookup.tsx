import Dropdown from "@/components/modals/room-lookup/dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { days } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

function RoomLookupModal({
  isOpened,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState(null);

  const handleRoomLookup = async () => {
    if (isPending) return;
    setIsPending(true);
    const res = await axios.get(
      `/api/fetch/emptyClasses?dayIndex=${selectedDay}&lessonIndex=${
        selectedLesson < 1 ? 1 : selectedLesson
      }`,
    );

    if (res.data.success) {
      setData(res.data.classes);
    }

    setIsPending(false);
  };

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#212121] border-0">
        <DialogHeader>
          <DialogTitle>Wyszukaj wolną salę</DialogTitle>
          <DialogDescription>
            Zostaną wyświetlone wszystkie wolne sale w wybranym dniu i godzinie
            lekcyjnej.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center flex-wrap py-2">
          <ToggleGroup
            defaultValue={selectedDay.toString()}
            onValueChange={(e) => setSelectedDay(+e)}
            type="single"
          >
            {days.map((day) => (
              <ToggleGroupItem
                key={day.index}
                value={day.index.toString()}
                variant="roomLookup"
                size="roomLookup"
              >
                <p>{day.short}</p>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Input
            type="number"
            placeholder="Numer lekcji"
            className="bg-gray-50 block mt-2 w-1/2 p-2 border-gray-300 text-center dark:bg-[#171717] dark:border-0 outline-none"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLesson(+value);
            }}
          />
        </div>

        <Dropdown data={data} setIsOpened={setIsOpened} />
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            onClick={() => setIsOpened(!isOpened)}
          >
            Anuluj
          </Button>

          <Button type="submit" disabled={isPending} onClick={handleRoomLookup}>
            {isPending ? "Wyszukiwanie..." : "Wyszukaj"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoomLookupModal;
