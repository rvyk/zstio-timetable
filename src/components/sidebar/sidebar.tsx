"use client";

import { Accordion } from "@/components/ui/accordion";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { GraduationCap, MapPin, StarIcon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Dropdown } from "./dropdown";
import { Search } from "./search";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-full max-w-xs border-r border-accent/10 bg-foreground dark:border-primary/10">
      <div className="mr-3 flex h-full w-full flex-col justify-between space-y-16 overflow-y-auto overflow-x-hidden px-4 py-6">
        <div className="grid gap-9">
          <Search />
          <SidebarDropdowns />
        </div>
        <p className="text-sm font-semibold text-primary/90">
          Źródło danych <br />
          <Link
            href={process.env.NEXT_PUBLIC_TIMETABLE_URL!}
            target="_blank"
            className="text-xs font-medium text-primary/70 underline"
          >
            {process.env.NEXT_PUBLIC_TIMETABLE_URL}
          </Link>
        </p>
      </div>
    </div>
  );
};

const SidebarDropdowns: React.FC = () => {
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.getFavorites());
  const { classes, teachers, rooms } = timetable?.list || {};

  const dropdownItems = [
    { type: "favorites", icon: StarIcon, data: favorites },
    { type: "class", icon: GraduationCap, data: classes },
    { type: "teacher", icon: Users, data: teachers },
    { type: "room", icon: MapPin, data: rooms },
  ];

  return (
    <Accordion type="multiple" className="grid w-full gap-5 px-2">
      {dropdownItems.map((item, index) => (
        <React.Fragment key={item.type}>
          <Dropdown type={item.type} icon={item.icon} data={item.data} />
          {index === 0 && (
            <hr className="h-px w-full border border-primary/10" />
          )}
        </React.Fragment>
      ))}
    </Accordion>
  );
};
