"use client";

import Dropdown from "@/components/room-lookup/dropdown";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import fetchEmptyClasses from "@/lib/fetchers/getEmptyRooms";
import { days } from "@/lib/utils";
import { Room } from "@/types/api";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCounter } from "@uidotdev/usehooks";
import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "../ui/responsive-dialog";

interface ResponsiveLookupDialogProps {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResponsiveLookupDialog: React.FC<ResponsiveLookupDialogProps> = ({
  isOpened,
  setIsOpened,
}: ResponsiveLookupDialogProps) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedLesson, counter] = useCounter(1, {
    min: 1,
    max: 14,
  });
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<Room[] | null>(null);

  const handleRoomLookup = async () => {
    if (isPending) return;
    setIsPending(true);

    setData(
      await fetchEmptyClasses(
        selectedDay,
        selectedLesson - 1 < 0 ? 0 : selectedLesson - 1,
      ),
    );

    setIsPending(false);
  };
  const { decrement, increment, set } = counter;
  const [userInput, setUserInput] = useState("1");

  return (
    <ResponsiveDialog open={isOpened} onOpenChange={setIsOpened}>
      <ResponsiveDialogContent className="border-0 bg-white dark:bg-[#212121]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Wyszukaj wolną salę</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Zostaną wyświetlone wszystkie wolne sale w wybranym dniu i godzinie
            lekcyjnej.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="flex flex-col justify-center p-4 pb-0">
          <ToggleGroup
            defaultValue={selectedDay.toString()}
            onValueChange={(e) => setSelectedDay(+e)}
            type="single"
            className="flex flex-wrap justify-center pt-2"
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
          <div className="mb-2 mt-2 flex w-full justify-center">
            <div className="flex w-full items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => {
                  decrement();
                  setUserInput((selectedLesson - 1).toString());
                }}
                disabled={selectedLesson <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <div className="flex w-full flex-col items-center justify-center text-center">
                <div className="w-full text-center">
                  <input
                    type="number"
                    autoFocus={true}
                    value={userInput}
                    onChange={(e) => setUserInput(e.currentTarget.value)}
                    onBlur={(e) => {
                      set(+e.currentTarget.value);
                      setUserInput(
                        Math.max(
                          1,
                          Math.min(14, +e.currentTarget.value),
                        ).toString(),
                      );
                    }}
                    className="w-20 bg-transparent text-center text-6xl font-bold outline-none"
                  />
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  nr. lekcji
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => {
                  increment();
                  setUserInput((selectedLesson + 1).toString());
                }}
                disabled={selectedLesson >= 14}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {data && <Dropdown data={data} setIsOpened={setIsOpened} />}
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button type="submit" variant="outline">
              Anuluj
            </Button>
          </ResponsiveDialogClose>
          <Button type="submit" disabled={isPending} onClick={handleRoomLookup}>
            {isPending ? "Wyszukiwanie..." : "Wyszukaj"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ResponsiveLookupDialog;
