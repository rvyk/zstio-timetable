"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AcademicCapIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { List, ListItem } from "@wulkanowy/timetable-parser";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type FilterKeys = "class" | "teacher" | "room";

const TimetableDropdowns: React.FC<{ timeTableList: List }> = ({
  timeTableList: { classes, rooms, teachers },
}) => {
  return (
    <div className="hidden md:block">
      {!!classes?.length && (
        <TimetableDropdownItem
          name="Oddziały"
          linkPrefix="class"
          item={classes}
          icon={<AcademicCapIcon />}
        />
      )}

      {!!teachers?.length && (
        <TimetableDropdownItem
          name="Nauczyciele"
          linkPrefix="teacher"
          item={teachers}
          icon={<UsersIcon />}
        />
      )}

      {!!rooms?.length && (
        <TimetableDropdownItem
          name="Sale"
          linkPrefix="room"
          item={rooms}
          icon={<MapPinIcon />}
        />
      )}
    </div>
  );
};

interface TimetableDropdownItemProps {
  name: string;
  linkPrefix: string;
  item: ListItem[];
  icon: React.ReactNode;
}

const TimetableDropdownItem: React.FC<TimetableDropdownItemProps> = ({
  name,
  linkPrefix,
  item,
  icon,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState("");

  const [isOpened, setIsOpened] = useState(false);
  const [lastSelect, setLastSelect] = useState("");

  const items = useMemo(() => {
    return item.filter((item: ListItem) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [item, filter]);

  const handleSelect = useCallback(
    (item: ListItem) => {
      const link = `/${linkPrefix}/${item.value}`;
      setLastSelect(link);
      localStorage.setItem("lastSelect", link);
      setIsOpened(false);
      router.push(link);
    },
    [linkPrefix, router],
  );

  const onKeyDownHandler = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code !== "Enter" || items.length !== 1) return;
    handleSelect(items[0]);
  };

  const translations = {
    class: "oddział",
    teacher: "nauczyciela",
    room: "salę",
  };

  useEffect(() => {
    setLastSelect(pathname);
  }, [pathname]);

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={() => setIsOpened(!isOpened)}
      open={isOpened}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="dropdown"
          size="dropdown"
          className={`${
            isOpened && "bg-[#73110e] text-white dark:bg-[#131313]"
          }`}
        >
          <span className="mr-2 h-5 w-5">{icon}</span>
          {name}
          <ChevronDownIcon
            className={`ml-2 h-4 w-4 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 max-h-60 w-60 overflow-y-scroll rounded-lg border-0 bg-white shadow dark:bg-[#131313]">
        <div className="p-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </div>
            <Input
              autoFocus
              type="text"
              placeholder={`Wyszukaj ${translations[linkPrefix as FilterKeys]}`}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 transition-all duration-200 focus:border-[#2B161B] focus:ring-[#2B161B] dark:border-gray-500 dark:bg-[#171717] dark:text-white dark:placeholder-gray-400 dark:focus:border-[#202020] dark:focus:ring-[#202020]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                onKeyDownHandler(e);
              }}
            />
          </div>
        </div>

        {items.map((item) => (
          <DropdownMenuItem
            tabIndex={0}
            key={item.value}
            className={`my-0.5 flex items-center rounded pl-2 hover:bg-gray-200 dark:hover:bg-[#202020] dark:focus:bg-[#202020] ${
              lastSelect === `/${linkPrefix}/${item.value}`
                ? "bg-gray-200 dark:bg-[#202020]"
                : ""
            }`}
            onClick={() => handleSelect(item)}
          >
            <p className="ml-2 w-full rounded py-1 text-sm font-medium text-gray-900 dark:text-gray-300">
              {item.name}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimetableDropdowns;
