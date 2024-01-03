import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { List, ListItem } from "@wulkanowy/timetable-parser";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
function TimetableDropdowns({
  timeTableList: { classes, rooms, teachers },
}: {
  timeTableList: List;
}) {
  return (
    <>
      {!!classes?.length && (
        <TimetableDropdownItem
          name="Klasy"
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
  icon: any;
}) {
  const [filter, setFilter] = useState({
    class: "",
    teacher: "",
    room: "",
  });

  const [lastSelect, setLastSelect] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLastSelect(router.asPath);
  }, [router.asPath]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dropdown" size="dropdown">
          <span className="h-5 w-5 mr-2">{icon}</span>
          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-2 max-h-60 overflow-y-scroll bg-white rounded-lg shadow dark:bg-[#161616] border-0">
        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
            <input
              type="text"
              autoComplete="false"
              id="input-group-search-class"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
              placeholder="Wyszukaj oddział"
            />
          </div>
        </div>

        {item.map((item) => (
          <DropdownMenuItem
            key={item.value}
            className={`flex items-center my-0.5 pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ${
              lastSelect === `/${linkPrefix}/${item.value}`
                ? "bg-gray-100 dark:bg-[#202020]"
                : ""
            }`}
            onClick={() =>
              handleSelect(linkPrefix, item, setLastSelect, router)
            }
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

const handleSelect = (
  linkPrefix: string,
  item: ListItem,
  setLastSelect: React.Dispatch<React.SetStateAction<string>>,
  router: NextRouter,
) => {
  const link = `/${linkPrefix}/${item.value}`;
  setLastSelect(link);
  localStorage.setItem("lastSelect", link);

  router.push(link);
};
export default TimetableDropdowns;
