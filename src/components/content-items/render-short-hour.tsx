"use client";

import { Button } from "@/components/ui/button";
import { adjustShortenedLessons, normalHours } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCounter } from "@uidotdev/usehooks";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { SettingsContext, SettingsContextType } from "../setting-provider";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "../ui/responsive-dialog";

interface ResponsiveShortHourDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ResponsiveShortHourDialog: React.FC<ResponsiveShortHourDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [hoursTime, setHours] = (
    useContext(SettingsContext) as SettingsContextType
  )?.hoursTime;
  const [, setIsShortHours] = (
    useContext(SettingsContext) as SettingsContextType
  )?.shortHours;
  const [lessonNumber, { increment, decrement, set }] = useCounter(5, {
    min: 5,
    max: Object.entries(hoursTime).map(([, value]) => value).length,
  });
  const [userInput, setUserInput] = useState("5");
  const newLessonArray = adjustShortenedLessons(lessonNumber, normalHours);
  const miniLessonArray = [
    newLessonArray[lessonNumber - 2] || null,
    newLessonArray[lessonNumber - 1] || null,
    "SPLIT",
    newLessonArray[lessonNumber] || null,
    newLessonArray[lessonNumber + 1] || null,
  ].filter((el) => el);
  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent className="!focus:outline-none border-none bg-white text-gray-900 !outline-none dark:bg-[#212121] dark:text-gray-50 ">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Oblicz skrócone lekcje</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Zaktualizuj czas trwania lekcji oraz minutnik.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="p-4 pb-0">
          <div className="flex w-full items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => {
                decrement();
                setUserInput((lessonNumber - 1).toString());
              }}
              disabled={lessonNumber <= 5}
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
                setUserInput((lessonNumber + 1).toString());
              }}
              disabled={
                lessonNumber >=
                Object.entries(hoursTime).map(([, value]) => value).length
              }
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-4 mt-3 flex h-[120px] flex-col items-center justify-center text-center font-medium">
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              normalne
            </div>
            {miniLessonArray.map((lesson, key) => {
              if (typeof lesson == "string") {
                return (
                  <div
                    key={key}
                    className="h-1 w-[50%] rounded bg-[#321c21] dark:bg-red-400"
                  >
                    &nbsp;
                  </div>
                );
              }
              return (
                <p
                  key={key}
                >{`${lesson.number}. ${lesson.timeFrom}-${lesson.timeTo}`}</p>
              );
            })}
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              skrócone
            </div>
          </div>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button type="submit" variant="outline">
                Anuluj
              </Button>
            </ResponsiveDialogClose>
            <ResponsiveDialogClose asChild>
              <Button
                type="submit"
                onClick={() => {
                  setIsShortHours(false);
                  setHours(newLessonArray);
                }}
              >
                Zastosuj
              </Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ResponsiveShortHourDialog;
