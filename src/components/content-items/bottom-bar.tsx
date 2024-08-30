"use client";

import { Dropdown } from "@/components/content-items/bottom-bar/dropdown";
import SearchBar from "@/components/content-items/bottom-bar/search";
import Footer from "@/components/footer";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useContext, useState } from "react";
import { TimetableContext } from "../timetable-provider";

const BottomBar = () => {
  const optivumTimetable = useContext(TimetableContext);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const dropdowns = [
    {
      data: optivumTimetable?.list.classes.map((c) => ({
        type: "class",
        name: c.name,
        value: c.value,
      })),
      type: "class",
      title: "Oddziały",
    },
    {
      data: optivumTimetable?.list.teachers?.map((t) => ({
        type: "teacher",
        name: t.name,
        value: t.value,
      })),
      type: "teacher",
      title: "Nauczyciele",
    },
    {
      data: optivumTimetable?.list.rooms?.map((r) => ({
        type: "room",
        name: r.name,
        value: r.value,
      })),
      type: "room",
      title: "Sale",
    },
  ];

  return (
    <div className="fixed bottom-0 flex h-16 w-full items-center justify-around">
      <div className="relative flex w-full items-center justify-center rounded-lg bg-[#F7F3F5] p-2 pb-4 dark:bg-[#131313]">
        <div
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "ArrowLeft" }),
            )
          }
          className="group mr-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl bg-[#27161a] transition-all duration-300 hover:bg-[#1f1115] dark:bg-[#202020] dark:hover:bg-[#171717]"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white opacity-60 transition-all group-hover:opacity-100" />
        </div>

        <Drawer
          open={isDrawerOpened}
          onOpenChange={setIsDrawerOpened}
          shouldScaleBackground
        >
          <DrawerTrigger asChild>
            <div className="flex h-14 w-[70%] cursor-pointer items-center whitespace-nowrap rounded-xl bg-[#27161a] transition-all duration-300 hover:bg-[#27161a] dark:bg-[#202020] dark:hover:bg-[#171717]">
              <div className="flex w-full justify-center">
                <p className="mr-1 text-xl font-normal text-gray-100 transition-all dark:text-gray-300">
                  {optivumTimetable?.type} /
                </p>
                <p className="overflow-hidden text-ellipsis text-xl font-bold text-gray-100 transition-all dark:text-gray-300">
                  {optivumTimetable?.title}
                </p>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="!focus:outline-none h-[calc(100vh-16%)] border-none text-gray-900 !outline-none dark:text-white">
            <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-between">
              <div>
                <DrawerHeader className="flex w-full flex-col overflow-scroll transition-all duration-300">
                  <DrawerTitle className="flex items-center justify-center">
                    <p className="mr-1 text-xl font-normal text-gray-900 transition-all dark:text-gray-300">
                      {optivumTimetable?.type} /
                    </p>
                    <p className="overflow-hidden text-ellipsis text-xl font-bold text-gray-900 transition-all dark:text-gray-300">
                      {optivumTimetable?.title}
                    </p>
                  </DrawerTitle>
                </DrawerHeader>

                <div className="flex w-full flex-col items-center justify-center px-4">
                  <SearchBar />
                  {dropdowns?.map((dropdown) => (
                    <div key={`dropdown-container-${dropdown.title}`}>
                      {!!dropdown.data?.length && (
                        <Dropdown
                          setIsDrawerOpened={setIsDrawerOpened}
                          key={`dropdown-${dropdown.title}`}
                          title={dropdown.title}
                          results={dropdown.data}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DrawerFooter>
                <div className="flex w-full flex-col items-center justify-center text-center text-gray-900 dark:text-gray-300">
                  {optivumTimetable?.generatedDate && (
                    <p>
                      Wygenerowano:{" "}
                      <span className="font-semibold">
                        {optivumTimetable.generatedDate}
                      </span>
                    </p>
                  )}
                  {optivumTimetable?.validDate && (
                    <p>
                      Obowiązuje od:{" "}
                      <span className="font-semibold">
                        {optivumTimetable.validDate}
                      </span>
                    </p>
                  )}
                  {optivumTimetable?.id && (
                    <Link
                      prefetch={false}
                      href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${optivumTimetable.id}.html`}
                      target="_blank"
                      className="font-semibold"
                    >
                      Źródło danych
                    </Link>
                  )}
                </div>
                <Footer />
                {!optivumTimetable?.id &&
                  !optivumTimetable?.validDate &&
                  !optivumTimetable?.generatedDate && (
                    <div className="h-16"></div>
                  )}
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        <div
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "ArrowRight" }),
            )
          }
          className="group ml-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl bg-[#27161a] transition-all duration-300 hover:bg-[#1f1115] dark:bg-[#202020] dark:hover:bg-[#171717]"
        >
          <ChevronRightIcon className="h-8 w-8 text-white opacity-60 transition-all group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
