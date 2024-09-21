"use client";

import { Accordion } from "@/components/ui/accordion";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { GraduationCap, MapPin, StarIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useIsClient } from "usehooks-ts";
import { Dropdown, DropdownProps } from "./dropdown";
import { Search } from "./search";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-full max-w-xs border-r border-lines bg-foreground dark:border-primary/10">
      <div className="mr-3 flex h-full w-full flex-col justify-between space-y-16 overflow-y-auto overflow-x-hidden px-4 py-6">
        <SidebarContent />
      </div>
    </div>
  );
};

const SidebarContent: React.FC = () => {
  const isSubstitutionPage = usePathname() === "/substitutions";
  const sourceLink = isSubstitutionPage
    ? process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL
    : process.env.NEXT_PUBLIC_TIMETABLE_URL;
  const isClient = useIsClient();

  // TODO: Skeleton loading
  if (!isClient) return null;

  return (
    <React.Fragment>
      {isSubstitutionPage ? (
        <SubstitutionSidebarDropdowns />
      ) : (
        <TimetableSidebarDropdowns />
      )}

      <p className="mx-2 text-sm font-semibold text-primary/90">
        Źródło danych <br />
        <Link
          href={sourceLink as string}
          target="_blank"
          className="break-words text-xs font-medium text-primary/70 underline"
        >
          {sourceLink}
        </Link>
      </p>
    </React.Fragment>
  );
};

const SubstitutionSidebarDropdowns: React.FC = () => {
  const substitutions = useSubstitutionsStore((state) => state.substitutions);

  const getUniqueItems = (type: "teacher" | "class") => {
    return Array.from(
      new Set(
        substitutions?.tables
          .map((t) => t.substitutions.map((s) => s[type]))
          .flat(),
      ),
    );
  };

  const dropdownItems = [
    { type: "teacher", icon: Users, data: getUniqueItems("teacher") },
    { type: "class", icon: GraduationCap, data: getUniqueItems("class") },
  ];

  return (
    <div className="grid gap-10">
      {/* TODO: Search support for substitutions */}
      {/* <Search /> */}
      <Accordion type="multiple" className="grid w-full gap-5 px-2">
        {dropdownItems.map((item) => (
          <React.Fragment key={item.type}>
            <Dropdown
              type={item.type as DropdownProps["type"]}
              icon={item.icon}
              data={item.data}
            />
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  );
};

const TimetableSidebarDropdowns: React.FC = () => {
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.getFavorites());
  const { classes, teachers, rooms } = timetable?.list ?? {};

  const dropdownItems = [
    { type: "favorites", icon: StarIcon, data: favorites },
    { type: "class", icon: GraduationCap, data: classes },
    { type: "teacher", icon: Users, data: teachers },
    { type: "room", icon: MapPin, data: rooms },
  ];

  return (
    <div className="grid gap-10">
      <Search />
      <Accordion type="multiple" className="grid w-full gap-5 px-2">
        {dropdownItems.map((item, index) => (
          <React.Fragment key={item.type}>
            <Dropdown
              type={item.type as DropdownProps["type"]}
              icon={item.icon}
              data={item.data}
            />
            {index === 0 && (
              <hr className="h-px w-full border border-primary/10" />
            )}
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  );
};
