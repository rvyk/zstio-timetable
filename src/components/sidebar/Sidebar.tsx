"use client";

import { TimetableDates } from "@/components/common/TimetableDates";
import { Accordion } from "@/components/ui/Accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { GraduationCap, MapPin, StarIcon, Users } from "lucide-react";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import SidebarContext, { useSidebarContext } from "./Context";
import { Dropdown } from "./Dropdown";
import { Search } from "./Search";

export const Sidebar: FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSettingsWithoutStore();

  return (
    <Fragment>
      <div className="h-screen w-full max-w-xs border-r border-lines bg-foreground dark:border-primary/10 max-xl:hidden max-md:hidden">
        <div className="mr-3 flex h-full w-full flex-col justify-between gap-y-16 overflow-y-auto overflow-x-hidden px-4 py-6">
          <SidebarContent />
        </div>
      </div>

      <div className="max-md:hidden xl:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <button className="flex h-screen w-24 cursor-pointer flex-col items-center gap-10 border-r border-lines bg-foreground px-4 py-6 dark:border-primary/10">
              <SidebarContext.Provider value={{ isPreview: true }}>
                <SidebarContent />
              </SidebarContext.Provider>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col justify-between gap-y-16 overflow-y-auto overflow-x-hidden border-r border-lines px-4 py-6 xl:hidden"
          >
            <VisuallyHidden>
              <SheetTitle>Nawigacja boczna</SheetTitle>
            </VisuallyHidden>
            <SidebarContent />
            <VisuallyHidden>
              <SheetDescription>
                Lista wszystkich klas, nauczycieli i sal dostępnych w planie.
              </SheetDescription>
            </VisuallyHidden>
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  );
};

interface SidebarContentProps {
  showTimetableDates?: boolean;
}

export const SidebarContent: FC<SidebarContentProps> = ({
  showTimetableDates,
}) => {
  const timetable = useTimetableStore((state) => state.timetable);
  const lastUpdatedTimetable = timetable?.lastUpdated;

  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

  const sourceLink = process.env.NEXT_PUBLIC_TIMETABLE_URL;

  if (!isClient)
    return (
      <Fragment>
        <div className={cn(isPreview && "w-12", "grid gap-10")}>
          <Skeleton className="h-12 w-full" />
          <div className={cn(isPreview && "mx-auto w-10", "grid gap-5")}>
            <Skeleton className="h-10 w-full" />
            <hr className="h-px w-full border border-primary/10" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className={cn(isPreview ? "hidden" : "grid", "gap-2")}>
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-full" />
        </div>
      </Fragment>
    );

  return (
    <Fragment>
      <TimetableSidebarDropdowns />

      <div className="flex flex-col gap-1">
        {showTimetableDates && (
          <TimetableDates
            timetable={timetable ?? undefined}
            stackOnMobile
            className={cn(isPreview && "hidden", "mx-2 text-xs sm:text-sm")}
          />
        )}
        {lastUpdatedTimetable && (
          <p
            className={cn(
              isPreview && "hidden",
              "mx-2 text-xs font-semibold text-primary/90 sm:text-sm",
            )}
          >
            Ostatnia aktualizacja danych: <br />
            <span className="break-words text-xs font-medium text-primary/70">
              {lastUpdatedTimetable}
            </span>
          </p>
        )}
        <p
          className={cn(
            isPreview && "hidden",
            "mx-2 text-xs font-semibold text-primary/90 sm:text-sm",
          )}
        >
          Źródło danych: <br />
          <Link
            href={sourceLink ?? "#"}
            target="_blank"
            className="break-words text-xs font-medium text-primary/70 underline"
          >
            {sourceLink}
          </Link>
        </p>
      </div>
    </Fragment>
  );
};

const TimetableSidebarDropdowns: FC = () => {
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.getFavorites());
  const { classes, teachers, rooms } = timetable?.list ?? {};

  const dropdownItems = useMemo(() => {
    return [
      { type: "favorites" as const, icon: StarIcon, data: favorites },
      { type: "class" as const, icon: GraduationCap, data: classes },
      { type: "teacher" as const, icon: Users, data: teachers },
      { type: "room" as const, icon: MapPin, data: rooms },
    ];
  }, [favorites, classes, teachers, rooms]);

  return (
    <div className="grid gap-10">
      <Search timetable={timetable} />
      <Accordion type="multiple" className="grid w-full gap-5 px-2">
        {dropdownItems.map((item, index) => (
          <Fragment key={item.type}>
            <Dropdown type={item.type} icon={item.icon} data={item.data} />
            {index === 0 && (
              <hr className="h-px w-full border border-primary/10" />
            )}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
};
