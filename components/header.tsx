"use client";

import { Location } from "@/components/location";
import ModeToggle from "@/components/mode-toggle";
import { SearchClassroom } from "@/components/search-classroom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import icon from "@/public/icon-128x128.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowsRotate, FaCalendarDays, FaChevronDown } from "react-icons/fa6";

export function Header() {
    const router = useRouter();
    const path = usePathname();

    function switchRoute(route: string) {
        router.push(route);
    }

    const [isOpened, setIsOpened] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex min-h-20 w-full items-center border-b bg-background p-5">
            <div className="flex flex-1 items-center gap-5">
                <Link prefetch={false} href="https://zstiojar.edu.pl" className="relative h-12 w-12 sm:hidden">
                    <Image src={icon} alt="Logo" sizes="80vw" fill priority />
                </Link>
                <ToggleGroup className="gap-0" type="single" defaultValue="45">
                    <ToggleGroupItem className="rounded-l-lg rounded-r-none font-bold" value="45">
                        45&apos;
                    </ToggleGroupItem>
                    <ToggleGroupItem className="rounded-l-none rounded-r-lg font-bold" value="30">
                        30&apos;
                    </ToggleGroupItem>
                </ToggleGroup>
                <Location className="max-sm:hidden" />
            </div>
            <div className="justify-end font-medium text-muted-foreground">
                <div className="flex flex-wrap gap-2 sm:hidden">
                    <DropdownMenu onOpenChange={() => setIsOpened(!isOpened)} open={isOpened}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <FaChevronDown className={`${isOpened && "rotate-180"} transition-transform`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="grid w-auto gap-2">
                            <SearchClassroom />
                            <ModeToggle />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => switchRoute("/substitutions")}
                        className={
                            path.startsWith("/substitutions")
                                ? "bg-accent text-accent-foreground hover:bg-accent/80"
                                : ""
                        }
                    >
                        <FaArrowsRotate className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => switchRoute("/timetable")}
                        className={
                            path.startsWith("/timetable") ? "bg-accent text-accent-foreground hover:bg-accent/80" : ""
                        }
                    >
                        <FaCalendarDays className="h-5 w-5" />
                    </Button>
                </div>
                <span className="max-sm:hidden" suppressHydrationWarning>
                    Generated: {new Date().toLocaleDateString()}
                </span>
            </div>
        </header>
    );
}
