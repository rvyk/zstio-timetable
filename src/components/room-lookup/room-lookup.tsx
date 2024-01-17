import Dropdown from "@/components/room-lookup/dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, days } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCounter, useMediaQuery } from "@uidotdev/usehooks";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpened} onOpenChange={setIsOpened}>
        <DialogContent className="border-0 bg-white dark:bg-[#212121] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Wyszukaj wolną salę</DialogTitle>
            <DialogDescription>
              Zostaną wyświetlone wszystkie wolne sale w wybranym dniu i
              godzinie lekcyjnej.
            </DialogDescription>
          </DialogHeader>

          <Content
            {...{
              selectedDay,
              setSelectedDay,
              selectedLesson,
              counter,
              data,
              setIsOpened,
            }}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" variant="outline" className="mt-2 sm:mt-0">
                Anuluj
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isPending}
              onClick={handleRoomLookup}
            >
              {isPending ? "Wyszukiwanie..." : "Wyszukaj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpened} onOpenChange={setIsOpened}>
      <DrawerContent className="!focus:outline-none border-none !outline-none">
        <DrawerHeader className="text-left">
          <DrawerTitle>Wyszukaj wolną salę</DrawerTitle>
          <DrawerDescription>
            Zostaną wyświetlone wszystkie wolne sale w wybranym dniu i godzinie
            lekcyjnej.
          </DrawerDescription>
        </DrawerHeader>

        <Content
          className="mb-2"
          {...{
            selectedDay,
            setSelectedDay,
            selectedLesson,
            counter,
            data,
            setIsOpened,
          }}
        />

        <DrawerFooter className="pt-2">
          <Button type="submit" disabled={isPending} onClick={handleRoomLookup}>
            {isPending ? "Wyszukiwanie..." : "Wyszukaj"}
          </Button>
          <DrawerClose asChild>
            <Button type="submit" variant="outline" className="mt-2 sm:mt-0">
              Anuluj
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Content: React.FC<{
  selectedDay: number;
  setSelectedDay: Dispatch<SetStateAction<number>>;
  selectedLesson: number;
  counter: any;
  data: null;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  className?: string;
}> = ({
  selectedDay,
  setSelectedDay,
  selectedLesson,
  counter,
  data,
  setIsOpened,
  className,
}) => {
  const { decrement, increment, set } = counter;
  const [userInput, setUserInput] = useState("1");
  return (
    <div className={cn(className, "flex flex-col justify-center")}>
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
        <div className="flex items-center justify-center space-x-2">
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
          <div className="mb-2 flex w-full flex-col items-center justify-center text-center">
            <div className="w-full text-center">
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.currentTarget.value)}
                onBlur={(e) => {
                  set(+e.currentTarget.value);
                  setUserInput(selectedLesson.toString());
                }}
                className="w-20 bg-transparent text-center text-6xl font-bold"
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
      <Dropdown data={data} setIsOpened={setIsOpened} />
    </div>
  );
};

export default ResponsiveLookupDialog;
