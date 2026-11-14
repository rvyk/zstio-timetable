"use client";

import school_logo from "@/assets/school-logo.png";
import { useT } from "@/components/common/LocaleProvider";
import { OtherTimetables } from "@/components/common/OtherTimetables";
import { TimetableDates } from "@/components/common/TimetableDates";
import { SettingsList } from "@/components/settings/SettingsPanel";
import { Accordion } from "@/components/ui/Accordion";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { useRecentStore } from "@/stores/recent";
import { useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import type { OptivumTimetable } from "@/types/optivum";
import type { List } from "@majusss/timetable-parser";
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
import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import SidebarContext, { useSidebarContext } from "./Context";
import { Dropdown, DropdownContent } from "./Dropdown";
import { NoScriptList } from "./NoScriptList";
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
        <SidebarListSkeleton />
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

const SidebarListSkeleton: FC = () => {
  const { isPreview } = useSidebarContext();

  if (isPreview)
    return (
      <div className="hidden w-8 gap-2 in-data-js:grid">
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
        <hr className="border-lines my-1" />
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
      </div>
    );

  return (
    <div className="hidden gap-10 in-data-js:grid">
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-5">
        <Skeleton className="h-10 w-full" />
        <hr className="border-primary/10 h-px w-full border" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
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
        collapsed ? "flex-col gap-y-5" : "gap-x-3",
        "flex items-center",
      )}
    >
      <Link
        href={SCHOOL_WEBSITE}
        className="group flex items-center gap-x-3"
        aria-label={
          collapsed
            ? translate("school.linkAria", { school: SCHOOL_SHORT })
            : undefined
        }
        title={collapsed ? translate("school.link") : undefined}
      >
        <Image
          src={school_logo}
          alt=""
          className={cn(
            collapsed ? "w-8" : "w-9",
            "aspect-square shrink-0 transition-transform duration-300 group-hover:scale-105",
          )}
        />
        {!collapsed && (
          <span className="grid gap-0.5">
            <span className="text-primary text-sm leading-none font-semibold tracking-tight">
              {SCHOOL_SHORT}
            </span>
            <span className="text-primary flex items-center gap-1 text-[11px] leading-none opacity-60 transition-colors group-hover:opacity-100">
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
          "border-lines bg-accent text-primary/55 hover:text-primary hover:bg-primary/5 grid size-8 shrink-0 place-content-center rounded-md border transition",
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

const SETTINGS_PANEL_MS = 300;

const ACTION_ROW =
  "flex items-center gap-2.5 rounded-md text-[13px] text-primary/70 transition-colors hover:bg-primary/5 hover:text-primary";

const SidebarActions: FC<{ collapsed: boolean; onExpand: () => void }> = ({
  collapsed,
  onExpand,
}) => {
  const translate = useT();
  const [isOpen, setIsOpen] = useState(false);
  const { isMounted, presenceProps } = usePresence(
    isOpen && !collapsed,
    SETTINGS_PANEL_MS,
  );

  const openSettings = () => {
    if (collapsed) {
      onExpand();
      setIsOpen(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-lines border-t pt-2">
      <div className={cn(collapsed ? "gap-2" : "gap-0.5", "grid")}>
        <a
          href="/print"
          target="_blank"
          rel="noopener"
          title={translate("settings.print")}
          aria-label={translate("settings.print")}
          className={cn(
            ACTION_ROW,
            collapsed ? "size-8 justify-center" : "w-full px-2 py-2",
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
            collapsed ? "size-8 justify-center" : "w-full px-2 py-2",
            isOpen && !collapsed && "text-primary",
          )}
        >
          <SlidersHorizontal className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && (
            <Fragment>
              {translate("settings.menu")}
              <ChevronDown
                className={cn(
                  "text-primary/45 ml-auto size-3.5 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
                strokeWidth={2}
              />
            </Fragment>
          )}
        </button>
      </div>

      {isMounted && (
        <div
          data-settings
          {...presenceProps}
          inert={!isOpen}
          style={{ transitionDuration: `${SETTINGS_PANEL_MS}ms` }}
          className="grid grid-rows-[0fr] transition-[grid-template-rows] ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:grid-rows-[1fr] starting:data-[state=open]:grid-rows-[0fr]"
        >
          <div className="overflow-hidden">
            <SettingsList onSelect={() => setIsOpen(false)} compact />
          </div>
        </div>
      )}
    </div>
  );
};

export const Sidebar: FC<{ list: List; sidebarInfo?: ReactNode }> = ({
  list,
  sidebarInfo,
}) => {
  const collapsed = useSettingsWithoutStore(
    (state) => state.isSidebarCollapsed,
  );
  const setSidebarCollapsed = useSettingsWithoutStore(
    (state) => state.setSidebarCollapsed,
  );
  const toggleSidebarCollapsed = useSettingsWithoutStore(
    (state) => state.toggleSidebarCollapsed,
  );
  const isClient = useIsClient();

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
        <nav
          onClick={collapsed ? () => setSidebarCollapsed(false) : undefined}
          className={cn(
            collapsed && "cursor-pointer",
            "h-full w-full overflow-hidden",
          )}
        >
          <ScrollArea
            className="h-full"
            viewportClassName="h-full overflow-x-hidden"
            contentClassName={cn(
              collapsed
                ? "w-[calc(4rem-2px)] items-center gap-y-5 py-[15px]"
                : "w-[calc(20rem-2px)] gap-y-7 px-5 py-6",
              "flex min-h-full flex-col",
            )}
            scrollbarClassName="top-3 bottom-3"
          >
            <SidebarBrand
              collapsed={collapsed}
              onToggle={toggleSidebarCollapsed}
            />
            <div className="grid flex-1 grid-rows-[1fr_auto] gap-y-12">
              <div className="col-start-1 row-start-1">
                <NoScriptList list={list} />
                {isClient ? (
                  <TimetableSidebarDropdowns />
                ) : (
                  <SidebarListSkeleton />
                )}
              </div>
              <div className="group/footer bg-foreground relative col-start-1 row-start-2 grid gap-y-7 self-end has-[[data-settings]]:row-[1/-1]">
                <div
                  aria-hidden
                  className="from-foreground pointer-events-none absolute inset-x-0 bottom-full h-50 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-has-[[data-settings][data-state=open]]/footer:opacity-100"
                />
                <SidebarInfo showTimetableDates dates={sidebarInfo} />
                <SidebarActions
                  collapsed={collapsed}
                  onExpand={() => setSidebarCollapsed(false)}
                />
              </div>
            </div>
          </ScrollArea>
        </nav>
      </SidebarContext.Provider>
    </aside>
  );
};

export const SidebarInfo: FC<{
  showTimetableDates?: boolean;
  dates?: ReactNode;
}> = ({ showTimetableDates, dates }) => {
  const { isPreview } = useSidebarContext();

  return (
    <div
      className={cn(
        isPreview ? "hidden" : "grid",
        "border-lines gap-2 px-2 max-md:mt-6 max-md:border-t max-md:pt-4",
      )}
    >
      {dates ? (
        <Fragment>{dates}</Fragment>
      ) : (
        <StoredTimetableInfo showTimetableDates={showTimetableDates} />
      )}
      <OtherTimetables />
    </div>
  );
};

export const StoredTimetableInfo: FC<{ showTimetableDates?: boolean }> = ({
  showTimetableDates,
}) => {
  const timetable = useTimetableStore((state) => state.timetable);
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <Fragment>
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-32" />
      </Fragment>
    );
  }

  return (
    <TimetableInfo
      timetable={timetable ?? undefined}
      showTimetableDates={showTimetableDates}
    />
  );
};

export const TimetableInfo: FC<{
  timetable?: OptivumTimetable;
  showTimetableDates?: boolean;
}> = ({ timetable, showTimetableDates }) => {
  const translate = useT();

  return (
    <Fragment>
      {showTimetableDates && (
        <TimetableDates
          timetable={timetable}
          stackOnMobile
          className="text-xs"
        />
      )}
      {timetable?.lastUpdated && (
        <p className="text-primary/60 text-[11px]">
          {translate("dates.lastUpdated")}{" "}
          <span className="text-primary/72 font-mono wrap-break-word">
            {timetable.lastUpdated}
          </span>
        </p>
      )}
    </Fragment>
  );
};

const TimetableSidebarDropdowns: FC = () => {
  const translate = useT();
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const { classes, teachers, rooms } = timetable?.list ?? {};
  const { isPreview } = useSidebarContext();
  const [openSection, setOpenSection] = useState("");
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const recent = useRecentStore((state) => state.recent);
  const clearRecent = useRecentStore((state) => state.clearRecent);
  const results = useSearchResults(timetable, query);

  const dropdownItems = [
    { type: "favorites" as const, icon: BookmarkIcon, data: favorites },
    { type: "class" as const, icon: GraduationCap, data: classes },
    { type: "teacher" as const, icon: Users, data: teachers },
    { type: "room" as const, icon: MapPin, data: rooms },
  ];

  const sections = (
    <Accordion
      type="single"
      collapsible
      value={isPreview ? "" : openSection}
      onValueChange={setOpenSection}
      className={cn(isPreview ? "gap-2" : "gap-1", "grid w-full")}
    >
      {dropdownItems.map((item, index) => (
        <Fragment key={item.type}>
          <Dropdown type={item.type} icon={item.icon} data={item.data} />
          {index === 0 && (
            <hr
              className={cn(isPreview ? "my-1" : "my-2", "border-lines w-full")}
            />
          )}
        </Fragment>
      ))}
    </Accordion>
  );

  const isSearching = query.trim().length > 0;
  const suggestions = recent.length > 0 ? recent : favorites;
  const showSuggestions = isFocused && !isSearching && suggestions.length > 0;

  if (isPreview) {
    return (
      <div className="grid w-8 gap-2">
        <div className="border-lines bg-accent text-primary/65 grid size-8 place-content-center rounded-md border">
          <SearchIcon className="size-4" strokeWidth={1.75} />
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
            <p className="text-primary/60 text-xs font-medium">
              {translate(
                recent.length > 0 ? "sidebar.recent" : "list.favorites",
              )}
            </p>
            {recent.length > 0 && (
              <button
                onClick={clearRecent}
                className="text-primary/60 hover:text-primary text-xs font-medium transition-colors"
              >
                {translate("sidebar.clearRecent")}
              </button>
            )}
          </div>
          <DropdownContent
            type="search"
            data={suggestions}
            viewportClassName="max-h-none"
            onSelect={() => setIsFocused(false)}
          />
        </div>
      ) : isSearching ? (
        <div className="grid gap-2">
          <p className="text-primary/60 text-xs font-medium">
            {results.length > 0
              ? translate("sidebar.results", { count: results.length })
              : translate("sidebar.noResults")}
          </p>
          {results.length > 0 ? (
            <DropdownContent
              type="search"
              data={results}
              viewportClassName="max-h-none"
              onSelect={() => setQuery("")}
            />
          ) : (
            <p className="text-primary/60 text-sm">
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
