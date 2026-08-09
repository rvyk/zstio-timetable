"use client";

import school_logo from "@/assets/school-logo.png";
import { TimetableDates } from "@/components/common/TimetableDates";
import { SettingsList } from "@/components/settings/SettingsPanel";
import { Accordion } from "@/components/ui/Accordion";
import { Skeleton } from "@/components/ui/Skeleton";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import {
  ArrowLeft,
  BookmarkIcon,
  ChevronDown,
  ChevronLeft,
  GraduationCap,
  MapPin,
  PrinterIcon,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import SidebarContext, { useSidebarContext } from "./Context";
import { Dropdown } from "./Dropdown";
import { Search } from "./Search";

interface SidebarContentProps {
  showTimetableDates?: boolean;
  layout?: "vertical" | "horizontal";
  showInfo?: boolean;
  showSearch?: boolean;
}

export const SidebarContent: FC<SidebarContentProps> = ({
  showTimetableDates,
  layout = "vertical",
  showInfo = true,
  showSearch = true,
}) => {
  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

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

  const infoSection = showInfo ? (
    <SidebarInfo showTimetableDates={showTimetableDates} />
  ) : null;

  if (layout === "horizontal") {
    return (
      <div className="grid gap-4">
        <TimetableSidebarDropdowns
          layout="horizontal"
          showSearch={showSearch}
        />
        {infoSection}
      </div>
    );
  }

  return (
    <Fragment>
      <TimetableSidebarDropdowns layout="vertical" showSearch={showSearch} />
      {infoSection}
    </Fragment>
  );
};

const SidebarBrand: FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed,
  onToggle,
}) => (
  <div
    className={cn(
      collapsed ? "flex-col gap-y-3" : "gap-x-3",
      "flex items-center",
    )}
  >
    <Link
      href={SCHOOL_WEBSITE}
      className="group flex items-center gap-x-3"
      aria-label={`Przejdź na stronę szkoły ${SCHOOL_SHORT}`}
      title={collapsed ? "Strona szkoły" : undefined}
    >
      <Image
        src={school_logo}
        alt=""
        className="aspect-square w-9 shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      {!collapsed && (
        <span className="grid gap-0.5">
          <span className="text-primary text-sm leading-none font-semibold tracking-tight">
            {SCHOOL_SHORT}
          </span>
          <span className="text-primary/40 group-hover:text-primary/70 flex items-center gap-1 text-[11px] leading-none transition-colors">
            <ArrowLeft
              className="size-3 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
            Strona szkoły
          </span>
        </span>
      )}
    </Link>

    <button
      onClick={onToggle}
      aria-label={collapsed ? "Rozwiń panel boczny" : "Zwiń panel boczny"}
      aria-expanded={!collapsed}
      className={cn(
        !collapsed && "ml-auto",
        "text-primary/40 hover:bg-primary/5 hover:text-primary grid size-7 shrink-0 place-content-center rounded-md transition-colors",
      )}
    >
      <ChevronLeft
        className={cn(
          collapsed && "rotate-180",
          "size-4 transition-transform duration-300",
        )}
        strokeWidth={2}
      />
    </button>
  </div>
);

const ACTION_ROW =
  "flex items-center gap-2.5 rounded-md text-[13px] text-primary/55 transition-colors hover:bg-primary/5 hover:text-primary";

const SidebarActions: FC<{ collapsed: boolean; onExpand: () => void }> = ({
  collapsed,
  onExpand,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSettings = () => {
    if (collapsed) {
      onExpand();
      setIsOpen(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-lines relative border-t pt-2">
      {isOpen && !collapsed && (
        <Fragment>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          <div className="border-lines bg-foreground/95 animate-rise absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-lg border shadow-(--shadow-raised) backdrop-blur-md">
            <SettingsList onSelect={() => setIsOpen(false)} />
          </div>
        </Fragment>
      )}

      <div className={cn(collapsed && "justify-items-center", "grid gap-0.5")}>
        <button
          onClick={() => window.open("/print", "_blank")}
          title="Drukuj plan"
          aria-label="Drukuj plan"
          className={cn(
            ACTION_ROW,
            collapsed ? "size-9 justify-center" : "w-full px-2 py-2",
          )}
        >
          <PrinterIcon className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && "Drukuj plan"}
        </button>
        <button
          onClick={openSettings}
          aria-expanded={isOpen}
          title="Dodatkowe funkcje"
          aria-label="Dodatkowe funkcje"
          className={cn(
            ACTION_ROW,
            collapsed ? "size-9 justify-center" : "w-full px-2 py-2",
            isOpen && !collapsed && "bg-primary/5 text-primary",
          )}
        >
          <SlidersHorizontal className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && (
            <Fragment>
              Dodatkowe funkcje
              <ChevronDown
                className={cn(
                  "ml-auto size-3.5 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
                strokeWidth={2}
              />
            </Fragment>
          )}
        </button>
      </div>
    </div>
  );
};

export const Sidebar: FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed, toggleSidebarCollapsed } =
    useSettingsWithoutStore();

  // poniżej xl plan potrzebuje całej dostępnej szerokości, więc rail jest domyślny
  const isNarrow = useMediaQuery("(max-width: 1279px)", {
    initializeWithValue: false,
  });

  useEffect(() => {
    setSidebarCollapsed(isNarrow);
  }, [isNarrow, setSidebarCollapsed]);

  const collapsed = isSidebarCollapsed;

  return (
    <aside
      className={cn(
        collapsed ? "w-16" : "w-80",
        "border-lines bg-foreground relative m-3 mr-0 h-[calc(100dvh-1.5rem)] shrink-0 rounded-xl border shadow-(--shadow-soft) transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-md:hidden",
      )}
    >
      <SidebarContext.Provider value={{ isPreview: collapsed }}>
        {/* stała szerokość treści = brak przelewania tekstu w trakcie animacji */}
        <div className="h-full w-full overflow-hidden">
          <nav
            onClick={collapsed ? () => setSidebarCollapsed(false) : undefined}
            className={cn(
              collapsed ? "w-16 cursor-pointer items-center px-3" : "w-80 px-5",
              "flex h-full flex-col gap-y-7 overflow-x-hidden overflow-y-auto py-6",
            )}
          >
            <SidebarBrand
              collapsed={collapsed}
              onToggle={toggleSidebarCollapsed}
            />
            <div className="flex flex-1 flex-col justify-between gap-y-12">
              <SidebarContent showTimetableDates />
            </div>
            <SidebarActions
              collapsed={collapsed}
              onExpand={() => setSidebarCollapsed(false)}
            />
          </nav>
        </div>
      </SidebarContext.Provider>
    </aside>
  );
};

export const SidebarInfo: FC<{ showTimetableDates?: boolean }> = ({
  showTimetableDates,
}) => {
  const timetable = useTimetableStore((state) => state.timetable);
  const lastUpdatedTimetable = timetable?.lastUpdated;
  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className={cn(isPreview ? "hidden" : "grid", "gap-2")}>
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className={cn(isPreview ? "hidden" : "grid", "gap-2")}>
      {showTimetableDates && (
        <TimetableDates
          timetable={timetable ?? undefined}
          stackOnMobile
          className="text-xs"
        />
      )}
      {lastUpdatedTimetable && (
        <p className="text-primary/40 text-[11px]">
          Ostatnia aktualizacja{" "}
          <span className="text-primary/60 font-mono wrap-break-word">
            {lastUpdatedTimetable}
          </span>
        </p>
      )}
    </div>
  );
};

const TimetableSidebarDropdowns: FC<{
  layout: "vertical" | "horizontal";
  showSearch?: boolean;
}> = ({ layout, showSearch = true }) => {
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.getFavorites());
  const { classes, teachers, rooms } = timetable?.list ?? {};
  const isHorizontal = layout === "horizontal";
  const { isPreview } = useSidebarContext();
  const [openSections, setOpenSections] = useState<string[]>([]);

  // w railu nie ma gdzie narysować rozwiniętej listy — zwijamy sekcje razem z panelem.
  // Liczone przy renderze, nie synchronizowane efektem, więc nie ma kaskady renderów.
  const visibleSections = isPreview ? [] : openSections;

  const dropdownItems = useMemo(() => {
    return [
      { type: "favorites" as const, icon: BookmarkIcon, data: favorites },
      { type: "class" as const, icon: GraduationCap, data: classes },
      { type: "teacher" as const, icon: Users, data: teachers },
      { type: "room" as const, icon: MapPin, data: rooms },
    ];
  }, [favorites, classes, teachers, rooms]);

  return (
    <div className={cn(isHorizontal ? "grid w-full gap-3" : "grid gap-8")}>
      {showSearch && (
        <div className={cn(isHorizontal ? "col-span-4" : "")}>
          <Search timetable={timetable} />
        </div>
      )}
      {isHorizontal ? (
        <div className="col-span-4 flex w-full flex-wrap gap-2">
          {dropdownItems.map((item) => (
            <Dropdown
              key={item.type}
              type={item.type}
              icon={item.icon}
              data={item.data}
              useModal
            />
          ))}
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={visibleSections}
          onValueChange={setOpenSections}
          className="grid w-full gap-1"
        >
          {dropdownItems.map((item, index) => (
            <Fragment key={item.type}>
              <Dropdown type={item.type} icon={item.icon} data={item.data} />
              {index === 0 && <hr className="border-lines my-2 w-full" />}
            </Fragment>
          ))}
        </Accordion>
      )}
    </div>
  );
};
