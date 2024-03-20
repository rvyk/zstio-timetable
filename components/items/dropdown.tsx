"use client";

import { TimetableContext } from "@/components/providers/timetable-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useState } from "react";
import { FaChevronDown, FaGraduationCap, FaMapPin, FaUsers } from "react-icons/fa6";

export function Dropdowns() {
  return (
    <>
      <DropdownItem name="Oddziały" icon={<FaGraduationCap />} type="classes" />
      <DropdownItem name="Nauczyciele" icon={<FaUsers />} type="teachers" />
      <DropdownItem name="Sale" icon={<FaMapPin />} type="rooms" />
    </>
  );
}

export function DropdownItem({ name, icon, type }: { name: string; icon: ReactNode; type?: string }) {
  const router = useRouter();

  function switchRoute(route: string) {
    router.push(route);
  }
  const table = useContext(TimetableContext);
  const [isOpened, setIsOpened] = useState(false);

  if (table?.list?.[type as keyof typeof table.list]?.length === 0) return null;

  return (
    <DropdownMenu onOpenChange={() => setIsOpened(!isOpened)} open={isOpened}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-sm:h-16">
          {icon} {name} <FaChevronDown className={`${isOpened && "rotate-180"} transition-transform`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-48 w-56 overflow-y-auto">
        <DropdownMenuGroup>
          {table?.list?.[type as keyof typeof table.list]?.map(({ name, value }) => (
            <DropdownMenuItem
              key={name}
              onClick={() =>
                switchRoute(`/${{ classes: "class", rooms: "room", teachers: "teacher" }[type ?? ""]}/${value}`)
              }
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
