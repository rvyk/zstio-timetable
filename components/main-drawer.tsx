"use client";

import { Footer } from "@/components/footer";
import { Dropdowns } from "@/components/items/dropdown";
import { Location } from "@/components/items/location";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FaChevronUp } from "react-icons/fa6";

export function MainDrawer() {
  return (
    <nav className="fixed bottom-0 z-30 w-full sm:hidden">
      <Drawer>
        <DrawerTrigger className="grid w-full gap-1 rounded-t-2xl border-t bg-background p-3">
          <FaChevronUp className="inline-flex w-full justify-center" />
          <Location className="pointer-events-none inline-flex justify-center" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Location className="inline-flex justify-center" />
            </DrawerTitle>
          </DrawerHeader>
          <div className="grid w-full gap-2 px-3">
            <Dropdowns />
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
