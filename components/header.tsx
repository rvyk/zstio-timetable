"use client";

import { Dropdowns } from "@/components/items/dropdown";
import { Location } from "@/components/items/location";
import { PwaButton } from "@/components/items/pwa-button";
import { SearchClassroom } from "@/components/items/search-classroom";
import { ShortHoursToggle } from "@/components/items/short-hours";
import { TimetableContext } from "@/components/providers/timetable-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/ui/mode-toggle";
import icon from "@/resources/icon-128x128.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaArrowsRotate, FaCalendarDays, FaChevronDown } from "react-icons/fa6";

export function Header() {
  const router = useRouter();
  const path = usePathname();

  function switchRoute(route: string) {
    router.push(route);
  }

  const [isOpened, setIsOpened] = useState(false);

  const table = useContext(TimetableContext);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b bg-background p-5">
      <div className="flex items-center gap-5">
        <Link prefetch={false} href="https://zstiojar.edu.pl" className="relative h-12 w-12 sm:hidden">
          <Image src={icon} alt="Logo" sizes="80vw" fill priority />
        </Link>
        <ShortHoursToggle />
        <Location className="max-sm:hidden" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 max-sm:hidden">
        <Dropdowns />
      </div>
      <div className="font-medium text-muted-foreground">
        <div className="flex flex-wrap gap-2 sm:hidden">
          <DropdownMenu onOpenChange={() => setIsOpened(!isOpened)} open={isOpened}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Dropdown">
                <FaChevronDown className={`${isOpened && "rotate-180"} transition-transform`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid w-auto gap-2">
              <SearchClassroom />
              <ModeToggle />
              <PwaButton />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => switchRoute("/substitutions")}
            className={path.startsWith("/substitutions") ? "bg-accent text-accent-foreground hover:bg-accent/80" : ""}
            aria-label="Substitutions"
          >
            <FaArrowsRotate className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => switchRoute("/class")}
            className={path.startsWith("/class") ? "bg-accent text-accent-foreground hover:bg-accent/80" : ""}
            aria-label="Timetable"
          >
            <FaCalendarDays className="h-5 w-5" />
          </Button>
        </div>
        <span className="max-sm:hidden" suppressHydrationWarning>
          Generated: {table?.generatedDate}
        </span>
      </div>
    </header>
  );
}
