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
import { DATA_SOURCE_COOKIE_NAME } from "@/lib/dataSource";
import { cn } from "@/lib/utils";
import { initDataSources, useDataSourceStore } from "@/stores/dataSource";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ChevronDown,
  GraduationCap,
  MapPin,
  StarIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useIsClient } from "usehooks-ts";
import SidebarContext, { useSidebarContext } from "./Context";
import { Dropdown } from "./Dropdown";
import { Search } from "./Search";

export const Sidebar: FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSettingsWithoutStore();

  return (
    <Fragment>
      <div className="border-lines dark:border-primary/10 bg-foreground h-screen w-full max-w-xs border-r max-xl:hidden max-md:hidden print:hidden">
        <div className="mr-3 flex h-full w-full flex-col justify-between gap-y-16 overflow-x-hidden overflow-y-auto px-4 py-6">
          <SidebarContent />
        </div>
      </div>

      <div className="max-md:hidden xl:hidden print:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <div className="border-lines dark:border-primary/10 bg-foreground flex h-screen w-24 cursor-pointer flex-col items-center gap-10 border-r px-4 py-6">
              <SidebarContext.Provider value={{ isPreview: true }}>
                <SidebarContent />
              </SidebarContext.Provider>
            </div>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="border-lines flex flex-col justify-between gap-y-16 overflow-x-hidden overflow-y-auto border-r px-4 py-6 xl:hidden"
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

  useEffect(() => {
    initDataSources();
  }, []);

  const { selectedDataSource, availableDataSources, setSelectedDataSource } =
    useDataSourceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSourceChange = async (url: string) => {
    if (url === selectedDataSource) return;
    try {
      setIsLoading(true);
      document.cookie = `${DATA_SOURCE_COOKIE_NAME}=${encodeURIComponent(url)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      setSelectedDataSource(url);
      router.refresh();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const selectedSource = useMemo(
    () => availableDataSources.find((s) => s.url === selectedDataSource),
    [availableDataSources, selectedDataSource],
  );

  if (!isClient)
    return (
      <Fragment>
        <div className={cn(isPreview && "w-12", "grid gap-10")}>
          <Skeleton className="h-12 w-full" />
          <div className={cn(isPreview && "mx-auto w-10", "grid gap-5")}>
            <Skeleton className="h-10 w-full" />
            <hr className="border-primary/10 h-px w-full border" />
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
              "text-primary/90 mx-2 text-xs font-semibold sm:text-sm",
            )}
          >
            Ostatnia aktualizacja danych: <br />
            <span className="text-primary/70 text-xs font-medium break-words">
              {lastUpdatedTimetable}
            </span>
          </p>
        )}
        <div
          className={cn(
            isPreview && "hidden",
            "text-primary/90 text-xs font-medium sm:text-sm",
          )}
        >
          <div className="mx-2 mb-1">Źródło danych:</div>
          <div className={cn("relative")}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isLoading}
              className={cn(
                "group flex w-full items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all duration-200",
                "border-primary/10 text-primary/70 hover:bg-accent/30 hover:text-primary/90",
                isLoading && "cursor-not-allowed opacity-50",
                isOpen && "border-primary/20 bg-accent/40 text-primary/90",
              )}
            >
              <span className="ml-0 truncate text-left">
                {isLoading
                  ? "Ładowanie..."
                  : (selectedSource?.name ?? "Nieznane źródło")}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <Fragment>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                <div className="absolute inset-x-0 bottom-full z-20 mb-1 overflow-hidden rounded-lg border border-primary/20 bg-foreground/95 shadow-lg backdrop-blur-sm transition-all duration-200">
                  <div className="py-1">
                    {availableDataSources.map((source) => (
                      <button
                        key={source.url}
                        onClick={() => handleSourceChange(source.url)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs transition-colors duration-150 hover:bg-accent/50",
                          selectedDataSource === source.url &&
                            "bg-accent/40 font-medium text-primary/95",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors",
                              selectedDataSource === source.url
                                ? "bg-green-500"
                                : "bg-primary/30",
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-primary/90 truncate font-medium">
                              {source.name}
                            </div>
                            <div className="text-primary/60 mt-0.5 truncate text-[10px]">
                              {source.url}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
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
              <hr className="border-primary/10 h-px w-full border" />
            )}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
};
