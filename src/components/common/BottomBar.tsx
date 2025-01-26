"use client";

import { SidebarContent } from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { TRANSLATION_DICT } from "@/constants/translations";
import { simulateKeyPress } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FC, MouseEvent, useMemo } from "react";

interface TopbarProps {
  timetable?: OptivumTimetable;
  substitutions?: SubstitutionsPage;
}

export const BottomBar: FC<TopbarProps> = ({ timetable, substitutions }) => {
  const isSubstitutionsPage = Boolean(substitutions);

  const titleElement = useMemo(() => {
    if (timetable ?? substitutions) {
      return (
        <div className="grid w-full justify-center gap-1 px-2 text-center text-primary">
          <h2 className="mx-auto max-w-52 truncate text-ellipsis text-base font-semibold leading-tight opacity-90">
            {isSubstitutionsPage && substitutions
              ? "Przeglądaj zastępstwa"
              : timetable?.title}
          </h2>
          <p className="mx-auto max-w-72 truncate text-ellipsis text-sm font-medium leading-tight opacity-70">
            {isSubstitutionsPage && substitutions
              ? "Kliknij, aby zobaczyć szczegóły"
              : timetable?.type &&
                `Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}`}
          </p>
        </div>
      );
    } else {
      return "Nie znaleziono planu zajęć";
    }
  }, [isSubstitutionsPage, substitutions, timetable]);

  const handleArrowKey = (
    e: MouseEvent<HTMLButtonElement>,
    increment: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const key = increment ? "ArrowRight" : "ArrowLeft";
    simulateKeyPress(key, key === "ArrowRight" ? 39 : 37);
  };

  return (
    <Drawer
      /*
        Testing needed: a known problem is scrolling the page after opening the bottom drawer on iOS
        https://github.com/shadcn-ui/ui/issues/3943
      */
      onOpenChange={(isOpen) => {
        if (isOpen) window.scrollTo(0, 0);
      }}
    >
      <DrawerTrigger asChild>
        <div className="fixed bottom-0 flex h-20 w-full flex-col rounded-t-md border border-primary/10 bg-background dark:bg-foreground md:hidden">
          <div className="absolute left-0 right-0 top-1 mx-auto h-2 w-[100px] rounded-full bg-primary/10" />
          <div className="flex h-full items-center justify-between px-2">
            {!isSubstitutionsPage && (
              <Button
                aria-label="Poprzednia klasa/nauczyciel/sala"
                variant="icon"
                size="icon"
                onClick={(e) => handleArrowKey(e, false)}
                className="aspect-square h-10 w-10"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </Button>
            )}
            <div className="mx-auto grid h-fit">
              <div className="flex w-full justify-center text-center">
                {titleElement}
              </div>
            </div>
            {!isSubstitutionsPage && (
              <Button
                aria-label="Następna klasa/nauczyciel/sala"
                variant="icon"
                size="icon"
                onClick={(e) => handleArrowKey(e, true)}
                className="aspect-square h-10 w-10"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </Button>
            )}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="md:hidden">
        <VisuallyHidden>
          <DrawerTitle>Przeglądaj plan zajęć</DrawerTitle>
          <DrawerDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe,
            sapiente.
          </DrawerDescription>
        </VisuallyHidden>
        <div className="flex h-full flex-col justify-between gap-y-16">
          <SidebarContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
