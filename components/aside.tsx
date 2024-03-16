"use client";

import { PwaButton } from "@/components/items/pwa-button";
import { SearchClassroom } from "@/components/items/search-classroom";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/mode-toggle";
import icon from "@/resources/icon-128x128.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowsRotate, FaCalendarDays } from "react-icons/fa6";

export function Aside() {
  const router = useRouter();
  const path = usePathname();

  function switchRoute(route: string) {
    router.push(route);
  }

  return (
    <aside className="float-left flex min-h-screen w-20 flex-col items-center justify-between border-r bg-background p-3 max-sm:hidden">
      <nav className="grid items-center gap-2">
        <Link prefetch={false} href="https://zstiojar.edu.pl" className="relative mb-3 mt-1 h-12 w-12">
          <Image src={icon} alt="Logo" sizes="80vw" fill priority />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => switchRoute("/timetable")}
          className={path.startsWith("/timetable") ? "bg-accent text-accent-foreground hover:bg-accent/80" : ""}
          aria-label="Timetable"
        >
          <FaCalendarDays className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => switchRoute("/substitutions")}
          className={path.startsWith("/substitutions") ? "bg-accent text-accent-foreground hover:bg-accent/80" : ""}
          aria-label="Substitutions"
        >
          <FaArrowsRotate className="h-5 w-5" />
        </Button>
        <SearchClassroom />
      </nav>
      <div className="grid gap-2">
        <PwaButton />
        <ModeToggle />
      </div>
    </aside>
  );
}
