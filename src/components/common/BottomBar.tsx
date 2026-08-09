"use client";

import { SidebarContent } from "@/components/sidebar/Sidebar";
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
import { ArrowLeft, ArrowRight, ChevronUp } from "lucide-react";
import { FC, MouseEvent, useEffect, useState } from "react";

interface BottomBarProps {
  timetable?: OptivumTimetable;
  isOffline?: boolean;
}

const STEP_BUTTON =
  "text-primary/55 active:bg-primary/5 active:text-primary grid size-11 shrink-0 place-content-center rounded-lg transition-colors disabled:opacity-30";

export const BottomBar: FC<BottomBarProps> = ({ timetable, isOffline }) => {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const title =
    timetable?.title ?? (isOffline ? "Jesteś offline" : "Wybierz plan");
  const subtitle = timetable
    ? `Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}`
    : isOffline
      ? "Brak połączenia z siecią"
      : "Klasa, nauczyciel lub sala";

  const step = (e: MouseEvent<HTMLButtonElement>, forward: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    const key = forward ? "ArrowRight" : "ArrowLeft";
    simulateKeyPress(key, forward ? 39 : 37);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewportHeight = () => {
      setViewportHeight(window.visualViewport?.height ?? window.innerHeight);
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
      {/* pasek jest przyklejony do dołu, więc musi omijać pasek gestów iOS */}
      <div className="border-lines bg-foreground/85 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] shadow-(--shadow-raised) backdrop-blur-xl select-none md:hidden">
        <div className="flex h-16 items-center gap-1 px-2">
          {/* bez wczytanego planu nie ma po czym przechodzić w bok */}
          {timetable && (
            <button
              aria-label="Poprzedni plan"
              onClick={(e) => step(e, false)}
              className={STEP_BUTTON}
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
          )}

          {/* jedyny element otwierający szufladę — reszta paska to osobne akcje */}
          <DrawerTrigger asChild>
            <button className="active:bg-primary/5 grid min-w-0 flex-1 justify-items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="text-primary truncate text-[15px] leading-tight font-semibold tracking-tight">
                  {title}
                </span>
                <ChevronUp
                  className="text-primary/35 size-3.5 shrink-0"
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-primary/45 max-w-full truncate text-[11px] leading-tight">
                {subtitle}
              </span>
            </button>
          </DrawerTrigger>

          {timetable && (
            <button
              aria-label="Następny plan"
              onClick={(e) => step(e, true)}
              className={STEP_BUTTON}
            >
              <ArrowRight className="size-5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

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
        <SidebarContent showTimetableDates />
      </DrawerContent>
    </Drawer>
  );
};
