import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adjustShortenedLessons } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCounter, useMediaQuery } from "@uidotdev/usehooks";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

interface ResponsiveShortHourDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ResponsiveShortHourDialog: React.FC<ResponsiveShortHourDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Oblicz skrócone lekcje</DialogTitle>
            <DialogDescription>
              Zaktualizuj czas trwania lekcji oraz minutnik.
            </DialogDescription>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Oblicz skrócone lekcje</DrawerTitle>
          <DrawerDescription>
            Zaktualizuj czas trwania lekcji oraz minutnik.
          </DrawerDescription>
        </DrawerHeader>
        <Content />
        <DrawerFooter className="pt-2">
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

export default ResponsiveShortHourDialog;

const Content: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lessonNumber, { increment, decrement, set }] = useCounter(5, {
    min: 5,
    max: 14,
  });
  const [userInput, setUserInput] = useState("5");
  const newLessonArray = adjustShortenedLessons(lessonNumber + 1);
  const miniLessonArray = [
    newLessonArray[lessonNumber - 2] || null,
    newLessonArray[lessonNumber - 1] || null,
    "SPLIT",
    newLessonArray[lessonNumber] || null,
    newLessonArray[lessonNumber + 1] || null,
  ].filter((el) => el);
  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => {
            decrement();
            setUserInput((lessonNumber - 1).toString());
          }}
          disabled={lessonNumber <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <div className="flex-1 text-center">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.currentTarget.value)}
            onBlur={(e) => {
              set(+e.currentTarget.value);
              setUserInput(lessonNumber.toString());
            }}
            className="w-full text-center text-7xl font-bold tracking-tighter"
          />
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
            setUserInput((lessonNumber + 1).toString());
          }}
          disabled={lessonNumber >= 14}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="mb-4 mt-3 flex h-[120px] flex-col items-center justify-center text-center font-medium">
        <div className="text-[0.70rem] uppercase text-muted-foreground">
          normalne
        </div>
        {miniLessonArray.map((lesson) => {
          if (typeof lesson == "string") {
            return <div className="h-1 w-[50%] rounded bg-red-600">&nbsp;</div>;
          }
          return (
            <p>{`${lesson.number}. ${lesson.timeFrom}-${lesson.timeTo}`}</p>
          );
        })}
        <div className="text-[0.70rem] uppercase text-muted-foreground">
          skrócone
        </div>
      </div>
      {isDesktop ? (
        <div className="float-end ">
          <DialogClose asChild>
            <Button type="submit" variant="outline" className="mr-2">
              Anuluj
            </Button>
          </DialogClose>
          <Button type="submit">Zastosuj</Button>
        </div>
      ) : (
        <Button type="submit" className="w-full">
          Zastosuj
        </Button>
      )}
    </div>
  );
};
