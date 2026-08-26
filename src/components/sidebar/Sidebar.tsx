"use client";

import school_logo from "@/assets/school-logo.png";
import { useT } from "@/components/common/LocaleProvider";
import { TimetableDates } from "@/components/common/TimetableDates";
import { SettingsList } from "@/components/settings/SettingsPanel";
import { Accordion } from "@/components/ui/Accordion";
import { Skeleton } from "@/components/ui/Skeleton";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { useRecentStore } from "@/stores/recent";
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
  SearchIcon,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import SidebarContext, { useSidebarContext } from "./Context";
import { Dropdown, DropdownContent } from "./Dropdown";
import { Search, useSearchResults } from "./Search";

interface SidebarContentProps {
  showTimetableDates?: boolean;
}

export const SidebarContent: FC<SidebarContentProps> = ({
  showTimetableDates,
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

  return (
    <Fragment>
      <TimetableSidebarDropdowns />
      <SidebarInfo showTimetableDates={showTimetableDates} />
    </Fragment>
  );
};

const SidebarBrand: FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed,
  onToggle,
}) => {
  const translate = useT();

  return (
    <div
      className={cn(
        collapsed ? "flex-col gap-y-3" : "gap-x-3",
        "flex items-center",
      )}
    >
      <Link
        href={SCHOOL_WEBSITE}
        className="group flex items-center gap-x-3"
        aria-label={translate("school.linkAria", { school: SCHOOL_SHORT })}
        title={collapsed ? translate("school.link") : undefined}
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
              {translate("school.link")}
            </span>
          </span>
        )}
      </Link>

      <button
        onClick={onToggle}
        aria-label={translate(
          collapsed ? "sidebar.expand" : "sidebar.collapse",
        )}
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
};

const ACTION_ROW =
  "flex items-center gap-2.5 rounded-md text-[13px] text-primary/55 transition-colors hover:bg-primary/5 hover:text-primary";

const SidebarActions: FC<{ collapsed: boolean; onExpand: () => void }> = ({
  collapsed,
  onExpand,
}) => {
  const translate = useT();
  const [isOpen, setIsOpen] = useState(false);
  const { isMounted, presenceProps } = usePresence(isOpen && !collapsed);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [isOpen]);

  const openSettings = () => {
    if (collapsed) {
      onExpand();
      setIsOpen(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="border-lines relative border-t pt-2">
      {isMounted && (
        <div
          {...presenceProps}
          inert={!isOpen}
          className="border-lines bg-foreground/95 data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out absolute inset-x-0 bottom-full z-20 mb-2 max-h-[calc(100dvh-9rem)] origin-bottom overflow-y-auto rounded-lg border shadow-(--shadow-raised) backdrop-blur-md"
        >
          <SettingsList onSelect={() => setIsOpen(false)} />
        </div>
      )}

      <div className={cn(collapsed && "justify-items-center", "grid gap-0.5")}>
        <a
          href="/print"
          target="_blank"
          rel="noopener"
          title={translate("settings.print")}
          aria-label={translate("settings.print")}
          className={cn(
            ACTION_ROW,
            collapsed ? "size-9 justify-center" : "w-full px-2 py-2",
          )}
        >
          <PrinterIcon className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && translate("settings.print")}
        </a>
        <button
          onClick={openSettings}
          aria-expanded={isOpen}
          title={translate("settings.menu")}
          aria-label={translate("settings.menu")}
          className={cn(
            ACTION_ROW,
            collapsed ? "size-9 justify-center" : "w-full px-2 py-2",
            isOpen && !collapsed && "bg-primary/5 text-primary",
          )}
        >
          <SlidersHorizontal className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && (
            <Fragment>
              {translate("settings.menu")}
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
  const collapsed = useSettingsWithoutStore(
    (state) => state.isSidebarCollapsed,
  );
  const setSidebarCollapsed = useSettingsWithoutStore(
    (state) => state.setSidebarCollapsed,
  );
  const toggleSidebarCollapsed = useSettingsWithoutStore(
    (state) => state.toggleSidebarCollapsed,
  );

  const isNarrow = useMediaQuery("(max-width: 1279px)", {
    initializeWithValue: false,
  });

  useEffect(() => {
    setSidebarCollapsed(isNarrow);
  }, [isNarrow, setSidebarCollapsed]);

  return (
    <aside
      className={cn(
        collapsed ? "w-16" : "w-80",
        "border-lines bg-foreground relative m-3 mr-0 h-[calc(100dvh-1.5rem)] shrink-0 rounded-xl border shadow-(--shadow-soft) transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-md:hidden",
      )}
    >
      <SidebarContext.Provider value={{ isPreview: collapsed }}>
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
  const translate = useT();
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
    <div
      className={cn(
        isPreview ? "hidden" : "grid",
        "border-lines gap-2 max-md:mt-6 max-md:border-t max-md:pt-4",
      )}
    >
      {showTimetableDates && (
        <TimetableDates
          timetable={timetable ?? undefined}
          stackOnMobile
          className="text-xs"
        />
      )}
      {lastUpdatedTimetable && (
        <p className="text-primary/40 text-[11px]">
          {translate("dates.lastUpdated")}{" "}
          <span className="text-primary/60 font-mono wrap-break-word">
            {lastUpdatedTimetable}
          </span>
        </p>
      )}
    </div>
  );
};

const TimetableSidebarDropdowns: FC = () => {
  const translate = useT();
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const { classes, teachers, rooms } = timetable?.list ?? {};
  const { isPreview } = useSidebarContext();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const recent = useRecentStore((state) => state.recent);
  const clearRecent = useRecentStore((state) => state.clearRecent);
  const results = useSearchResults(timetable, query);

  const visibleSections = isPreview ? [] : openSections;

  const dropdownItems = [
    { type: "favorites" as const, icon: BookmarkIcon, data: favorites },
    { type: "class" as const, icon: GraduationCap, data: classes },
    { type: "teacher" as const, icon: Users, data: teachers },
    { type: "room" as const, icon: MapPin, data: rooms },
  ];

  const sections = (
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
  );

  const isSearching = query.trim().length > 0;
  const suggestions = recent.length > 0 ? recent : favorites;
  const showSuggestions = isFocused && !isSearching && suggestions.length > 0;

  if (isPreview) {
    return (
      <div className="grid gap-5">
        <div className="border-lines bg-accent-secondary text-primary/45 grid h-11 w-12 place-content-center rounded-lg border">
          <SearchIcon size={17} strokeWidth={2} />
        </div>
        {sections}
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 md:gap-8"
      onFocus={(event) => {
        if (event.target.tagName === "INPUT") setIsFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <Search value={query} onChange={setQuery} results={results} />

      {showSuggestions ? (
        <div
          className="grid gap-2"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-primary/40 text-[11px] font-medium tracking-[0.06em] uppercase">
              {translate(
                recent.length > 0 ? "sidebar.recent" : "list.favorites",
              )}
            </p>
            {recent.length > 0 && (
              <button
                onClick={clearRecent}
                className="text-primary/40 hover:text-primary text-[11px] font-medium transition-colors"
              >
                {translate("sidebar.clearRecent")}
              </button>
            )}
          </div>
          <DropdownContent
            type="search"
            data={suggestions}
            className="max-h-none"
            onSelect={() => setIsFocused(false)}
          />
        </div>
      ) : isSearching ? (
        <div className="grid gap-2">
          <p className="text-primary/40 text-[11px] font-medium tracking-[0.06em] uppercase">
            {results.length > 0
              ? translate("sidebar.results", { count: results.length })
              : translate("sidebar.noResults")}
          </p>
          {results.length > 0 ? (
            <DropdownContent
              type="search"
              data={results}
              className="max-h-none"
              onSelect={() => setQuery("")}
            />
          ) : (
            <p className="text-primary/45 text-sm">
              {translate("sidebar.noMatch", { query: query.trim() })}
            </p>
          )}
        </div>
      ) : (
        sections
      )}
    </div>
  );
};
