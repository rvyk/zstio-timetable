"use client";

import { useT } from "@/components/common/LocaleProvider";
import { SidebarContent } from "@/components/sidebar/Sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
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
  "text-primary opacity-70 active:bg-primary/5 active:opacity-100 active:scale-90 grid size-11 shrink-0 place-content-center rounded-lg transition duration-150 disabled:opacity-30";

export const BottomBar: FC<BottomBarProps> = ({ timetable, isOffline }) => {
  const translate = useT();
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const title =
    timetable?.title ??
    translate(isOffline ? "bottomBar.offline" : "bottomBar.pick");
  const subtitle = timetable
    ? translate("bottomBar.schedule", {
        type: translate(`type.${timetable.type}`),
      })
    : translate(isOffline ? "bottomBar.offlineHint" : "bottomBar.pickHint");

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
      onOpenChange={(isOpen) => {
        if (isOpen) window.scrollTo(0, 0);
      }}
    >
      <div className="border-lines bg-foreground/85 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] shadow-(--shadow-raised) backdrop-blur-xl select-none md:hidden">
        <div className="flex h-16 items-center gap-1 px-2">
          {timetable && (
            <button
              aria-label={translate("bottomBar.prev")}
              onClick={(e) => step(e, false)}
              className={STEP_BUTTON}
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
          )}

          <DrawerTrigger asChild>
            <button className="active:bg-primary/5 group grid min-w-0 flex-1 justify-items-center gap-0.5 rounded-lg px-2 py-1.5 transition duration-150 active:scale-[0.98]">
              <span className="flex max-w-full min-w-0 items-center gap-1.5">
                <span className="text-primary truncate text-[15px] leading-tight font-semibold tracking-tight">
                  {title}
                </span>
                <ChevronUp
                  className="text-primary size-3.5 shrink-0 opacity-50 transition-transform duration-200 group-active:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-primary/60 max-w-full truncate text-[11px] leading-tight">
                {subtitle}
              </span>
            </button>
          </DrawerTrigger>

          {timetable && (
            <button
              aria-label={translate("bottomBar.next")}
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
          <DrawerTitle>{translate("bottomBar.browse")}</DrawerTitle>
          <DrawerDescription>
            {translate("bottomBar.browseHint")}
          </DrawerDescription>
        </VisuallyHidden>
        <SidebarContent showTimetableDates />
      </DrawerContent>
    </Drawer>
  );
};
