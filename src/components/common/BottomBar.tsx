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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FC, MouseEvent, useEffect, useMemo, useState } from "react";

interface BottomBarProps {
  timetable?: OptivumTimetable;
  isOffline?: boolean;
}

export const BottomBar: FC<BottomBarProps> = ({ timetable, isOffline }) => {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const titleElement = useMemo(() => {
    if (timetable) {
      return (
        <div className="text-primary grid w-full justify-center gap-1 px-2 text-center">
          <h2 className="mx-auto max-w-52 truncate leading-tight font-semibold tracking-tight text-ellipsis">
            {timetable.title}
          </h2>
          <p className="text-primary/45 mx-auto max-w-72 truncate text-xs leading-tight text-ellipsis">
            {`Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}`}
          </p>
        </div>
      );
    } else if (isOffline) {
      return (
        <div className="text-primary grid w-full justify-center gap-1 px-2 text-center">
          <h2 className="mx-auto max-w-52 truncate leading-tight font-semibold tracking-tight text-ellipsis">
            Jesteś offline
          </h2>
          <p className="text-primary/45 mx-auto max-w-72 truncate text-xs leading-tight text-ellipsis">
            Brak połączenia z siecią
          </p>
        </div>
      );
    } else {
      return "Nie znaleziono planu zajęć";
    }
  }, [timetable, isOffline]);

  const handleArrowKey = (
    e: MouseEvent<HTMLButtonElement>,
    increment: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const key = increment ? "ArrowRight" : "ArrowLeft";
    simulateKeyPress(key, key === "ArrowRight" ? 39 : 37);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewportHeight = () => {
      const visualViewportHeight = window.visualViewport?.height;
      setViewportHeight(visualViewportHeight ?? window.innerHeight);
    };

    updateViewportHeight();

    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight,
      );
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

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
        <div className="border-lines bg-foreground/85 fixed bottom-0 z-30 flex h-20 w-full flex-col rounded-t-xl border-t shadow-[var(--shadow-raised)] backdrop-blur-xl outline-none md:hidden">
          <div className="bg-primary/15 absolute top-1.5 right-0 left-0 mx-auto h-1 w-9 rounded-full" />
          <div className="flex h-full items-center justify-between px-2 pt-1">
            <Button
              aria-label="Poprzednia klasa/nauczyciel/sala"
              variant="icon"
              size="icon"
              onClick={(e) => handleArrowKey(e, false)}
              className="aspect-square h-10 w-10"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Button>
            <div className="mx-auto grid h-fit">
              <div className="flex w-full justify-center text-center">
                {titleElement}
              </div>
            </div>
            <Button
              aria-label="Następna klasa/nauczyciel/sala"
              variant="icon"
              size="icon"
              onClick={(e) => handleArrowKey(e, true)}
              className="aspect-square h-10 w-10"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent
        className="md:hidden"
        style={
          viewportHeight ? { maxHeight: `${viewportHeight}px` } : undefined
        }
      >
        <VisuallyHidden>
          <DrawerTitle>Przeglądaj plan zajęć</DrawerTitle>
          <DrawerDescription>
            Wybierz klasę, nauczyciela lub salę, aby zobaczyć odpowiedni plan
            zajęć.
          </DrawerDescription>
        </VisuallyHidden>
        <div className="flex h-full flex-col justify-between gap-y-16">
          <SidebarContent showTimetableDates />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
