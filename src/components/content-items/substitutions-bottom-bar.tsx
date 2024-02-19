"use client";

import { Dropdown } from "@/components/content-items/bottom-bar/dropdown";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useState } from "react";
import Footer from "../footer";

interface BottomBarProps {
  substitutions: Substitutions;
}

const SubstitutionsBottomBar: React.FC<BottomBarProps> = ({
  substitutions,
}) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const dropdowns = [
    {
      data: substitutions.tables[0].zastepstwa
        .map((z) => ({
          type: "branches",
          name: z.branch,
          value: z.branch,
        }))
        .filter((z, index, self) => {
          return index === self.findIndex((t) => t.value === z.value);
        }),
      type: "branches",
      title: "Oddziały",
    },
    {
      data: substitutions.tables[0].zastepstwa
        .map((z) => ({
          type: "teachers",
          name: z.teacher,
          value: z.teacher,
        }))
        .filter((z, index, self) => {
          return index === self.findIndex((t) => t.value === z.value);
        }),
      type: "teachers",
      title: "Nauczyciele",
    },
  ];

  return (
    <div className="fixed bottom-0 flex h-16 w-full items-center justify-around">
      <div className="relative flex w-full items-center justify-center rounded-lg bg-[#F7F3F5] p-2 pb-4 dark:bg-[#131313]">
        <Drawer
          open={isDrawerOpened}
          onOpenChange={setIsDrawerOpened}
          shouldScaleBackground
        >
          <DrawerTrigger asChild>
            <div className="flex h-14 w-full cursor-pointer items-center  whitespace-nowrap rounded-xl bg-[#27161a] text-gray-100 transition-all duration-300 hover:bg-[#27161a] dark:bg-[#202020] dark:text-gray-300 dark:hover:bg-[#171717]">
              <div className="flex w-full justify-center">
                <p className="mr-1 text-xl font-normal transition-all">
                  Filtruj
                </p>
                <p className="overflow-hidden text-ellipsis text-xl font-bold transition-all">
                  zastepstwa
                </p>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="!focus:outline-none border-none !outline-none">
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="flex w-full flex-col overflow-scroll transition-all duration-300">
                <DrawerTitle className="flex items-center justify-center">
                  <p className="mr-1 text-xl font-normal transition-all">
                    Filtruj
                  </p>
                  <p className="overflow-hidden text-ellipsis text-xl font-bold transition-all">
                    zastepstwa
                  </p>
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex w-full flex-col items-center justify-center px-4">
                {dropdowns?.map((dropdown) => (
                  <div key={`dropdown-container-${dropdown.title}`}>
                    {!!dropdown.data?.length && (
                      <Dropdown
                        setIsDrawerOpened={setIsDrawerOpened}
                        key={`dropdown-${dropdown.title}`}
                        title={dropdown.title}
                        results={dropdown.data}
                        isSubstitutions={true}
                      />
                    )}
                  </div>
                ))}
              </div>
              <DrawerFooter>
                <Footer />
                <div className="h-12"></div>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default SubstitutionsBottomBar;
