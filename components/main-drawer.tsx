"use client";

import { Footer } from "@/components/footer";
import { Location } from "@/components/items/location";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { FaChevronDown, FaGraduationCap, FaMapPin, FaUsers } from "react-icons/fa6";

export function MainDrawer() {
  return (
    <nav className="fixed bottom-0 z-30 w-full rounded-t-2xl border-t bg-background p-5 sm:hidden">
      <Drawer>
        <DrawerTrigger className="w-full">
          <Location className="pointer-events-none inline-flex justify-center" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Location className="inline-flex justify-center" />
            </DrawerTitle>
          </DrawerHeader>
          <div className="grid w-full gap-2 px-3">
            <DropdownItem name="Oddziały" icon={<FaGraduationCap />} />
            <DropdownItem name="Nauczyciele" icon={<FaUsers />} />
            <DropdownItem name="Sale" icon={<FaMapPin />} />
          </div>
          <DrawerFooter>
            <span className="mb-2 mt-4 text-center text-muted-foreground" suppressHydrationWarning>
              Generated: {new Date().toLocaleDateString()}
            </span>
            <Footer />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}

export function DropdownItem({ name, icon }: { name: string; icon: ReactNode }) {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <DropdownMenu onOpenChange={() => setIsOpened(!isOpened)} open={isOpened}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-12 gap-2">
          {icon} {name} <FaChevronDown className={`${isOpened && "rotate-180"} transition-transform`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[90vw]">
        <DropdownMenuGroup>
          {Array.from({ length: 5 }).map((_, i) => (
            <DropdownMenuItem key={i}>
              {name} {i + 1}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
