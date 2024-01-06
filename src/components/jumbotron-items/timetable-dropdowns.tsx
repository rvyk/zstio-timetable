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
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type FilterKeys = "class" | "teacher" | "room";

function TimetableDropdowns({
  timeTableList: { classes, rooms, teachers },
}: {
  timeTableList: List;
}) {
  return (
    <>
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
    </>
  );
}

function TimetableDropdownItem({
  name,
  linkPrefix,
  item,
  icon,
}: {
  name: string;
  linkPrefix: string;
  item: ListItem[];
  icon: React.ReactNode;
}) {
  const router = useRouter();

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
    setLastSelect(router.asPath);
  }, [router.asPath]);

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
            isOpened && "dark:bg-[#131313] bg-[#73110e] text-white"
          }`}
        >
          <span className="h-5 w-5 mr-2">{icon}</span>
          {name}
          <ChevronDownIcon
            className={`w-4 h-4 ml-2 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-2 max-h-60 overflow-y-scroll bg-white rounded-l-lg shadow dark:bg-[#131313] border-0">
        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
            <Input
              autoFocus
              type="text"
              placeholder={`Wyszukaj ${translations[linkPrefix as FilterKeys]}`}
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={onKeyDownHandler}
            />
          </div>
        </div>

        {items.map((item) => (
          <DropdownMenuItem
            tabIndex={0}
            key={item.value}
            className={`flex items-center my-0.5 pl-2 rounded hover:bg-gray-200 dark:hover:bg-[#202020] dark:focus:bg-[#202020] ${
              lastSelect === `/${linkPrefix}/${item.value}`
                ? "bg-gray-200 dark:bg-[#202020]"
                : ""
            }`}
            onClick={() => handleSelect(item)}
          >
            <p className="w-full py-1 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
              {item.name}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TimetableDropdowns;
