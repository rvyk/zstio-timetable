"use client";

import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { ListItem } from "@majusss/timetable-parser";
import { setCookie } from "cookies-next";
import {
  ChevronDown,
  GraduationCap,
  LucideIcon,
  MapPin,
  SearchIcon,
  StarIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useIsClient } from "usehooks-ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-full max-w-xs border-r border-accent/10 bg-foreground dark:border-primary/10">
      <div className="mr-3 flex h-full w-full flex-col justify-between space-y-16 overflow-y-auto overflow-x-hidden p-6 pr-6">
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
    <Accordion type="multiple" className="grid w-full gap-5">
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

const Search: React.FC = () => {
  return (
    <div className="inline-flex h-12 w-full items-center gap-x-3 rounded-sm border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10">
      <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
      <input
        type="text"
        className="w-full bg-transparent text-sm font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none"
        placeholder="Szukaj..."
      />
    </div>
  );
};

const Dropdown: React.FC<{
  type: string;
  icon: LucideIcon;
  data?: ListItem[] | undefined;
}> = ({ type, icon: Icon, data }) => {
  const isClient = useIsClient();
  const pathname = usePathname();

  const translates = {
    favorites: "Ulubione",
    class: "Klasy",
    teacher: "Nauczyciele",
    room: "Sale",
  };

  const handleClick = (link: string) => {
    setCookie("lastVisited", link, {
      path: "/",
    });
  };

  return (
    <AccordionItem value={type}>
      <AccordionTrigger className="group relative">
        <div className="absolute -left-2 -top-1.5 z-10 h-[calc(100%+12px)] w-[calc(100%+16px)] rounded-md bg-accent/90 opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:opacity-100"></div>
        <div className="relative z-20 inline-flex w-full items-center justify-between">
          <div className="inline-flex items-center gap-x-3.5">
            <div className="grid h-10 w-10 place-content-center rounded-sm border border-primary/10 bg-accent transition-all group-hover:bg-primary/5 group-hover:dark:bg-accent">
              <Icon
                className="text-primary/80 transition-all group-hover:text-primary/90 group-data-[state=open]:text-primary/90"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-sm font-semibold text-primary/70 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 dark:font-medium">
              {translates[type as keyof typeof translates]}{" "}
              {isClient && `(${data?.length})`}
            </p>
          </div>
          <ChevronDown
            className="text-primary/80 transition-all group-data-[state=open]:rotate-180"
            size={20}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="mt-4 grid gap-2 rounded-md bg-accent/90 p-4">
          {data?.length ? (
            data?.map((item, i) => {
              const link = `/${item?.type ? item.type : type}/${item.value}`;

              return (
                <Link
                  href={link}
                  onClick={() => handleClick(link)}
                  key={i}
                  className={cn(
                    pathname == link &&
                      "!border-primary/5 bg-primary/5 hover:border-primary/10 hover:!bg-primary/10 dark:!bg-primary/5 hover:dark:!bg-primary/10",
                    "rounded-md border border-transparent py-3 pl-6 pr-3 text-sm font-semibold text-primary/80 transition-all hover:border-primary/5 hover:bg-primary/5 dark:font-medium hover:dark:bg-primary/5",
                  )}
                >
                  {item.name}
                </Link>
              );
            })
          ) : (
            <p className="text-center text-sm font-semibold text-primary/70 dark:font-medium">
              Brak danych
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};