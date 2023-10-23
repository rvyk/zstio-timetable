import { Menu, Transition } from "@headlessui/react";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import Footer from "../Footer";
import Search from "./Search";
import { useRouter } from "next/router";
import getLastSelect from "@/utils/lastSelect";
import { lock, unlock } from "tua-body-scroll-lock";
import MobileDetect from "mobile-detect";

function BottomBar({ handleKey, ...props }) {
  let {
    text,
    timeTableID,
    classes,
    teachers,
    rooms,
    timeTable: { generatedDate, title, validDate },
  } = props;

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [lastSelect, setLastSelect] = useState("");
  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    const lastSelect = getLastSelect(currentUrl);
    setLastSelect(lastSelect);
  }, [currentUrl]);

  const handleSelect = (name, value) => {
    const link = `/${name}/${value}`;
    setLastSelect(link);
    localStorage.setItem("LastSelect", link);
  };

  const dropdowns = [
    { data: classes, link: "class", title: "Oddziały" },
    { data: teachers, link: "teacher", title: "Nauczyciele" },
    { data: rooms, link: "room", title: "Sale" },
  ];

  useEffect(() => {
    const userAgent = window?.navigator?.userAgent;
    const sys = new MobileDetect(userAgent);

    // Dropdown scrolling not working on iOS when lock();
    // TODO: Fix on iOS without this if
    if (sys.os() != "iOS") {
      if (isMenuExpanded) {
        lock();
      } else {
        unlock();
      }
    }
  }, [isMenuExpanded]);

  return (
    <div
      id="bottomBar"
      className={`!fixed bottom-0 transition-all ${
        isMenuExpanded ? "h-full overflow-auto" : "h-[4.25rem]"
      } left-0 w-full flex flex-col bg-[#321c21] dark:bg-[#3b3b3b] duration-700 z-50`}
    >
      <div
        className={`h-24 relative mt-1.5 w-full flex justify-center items-center transition-all`}
      >
        <div
          onClick={() => {
            handleKey("ArrowLeft");
          }}
          className="h-14 w-14 cursor-pointer group dark:bg-[#202020] dark:hover:bg-[#171717] bg-[#27161a] hover:bg-[#1f1115] rounded-xl flex justify-center items-center ml-2 mr-3 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white group-hover:opacity-100 opacity-60 transition-all" />
        </div>
        <div
          className="flex w-[70%] dark:bg-[#202020] dark:hover:bg-[#171717] bg-[#27161a] hover:bg-[#27161a] rounded-xl transition-all duration-300 cursor-pointer h-14 items-center whitespace-nowrap"
          onClick={() => {
            setIsMenuExpanded(!isMenuExpanded);
          }}
        >
          <div className="w-[calc(100%-3rem)] left flex">
            <p className="transition-all text-xl font-normal text-gray-100 ml-3 mr-1 dark:text-gray-300">
              {text} /
            </p>
            <p className="transition-all text-xl font-bold text-gray-100 dark:text-gray-300 overflow-hidden text-ellipsis">
              {title}
            </p>
          </div>
          <div className="w-12 h-full right flex justify-center items-center text-gray-50">
            <ArrowUpIcon
              className={`h-6 w-6 transition-all duration-300 dark:opacity-60 ${
                isMenuExpanded && "rotate-180"
              }`}
            />
          </div>
        </div>
        <div
          onClick={() => {
            handleKey("ArrowRight");
          }}
          className="h-14 cursor-pointer w-14 group dark:bg-[#202020] dark:hover:bg-[#171717] bg-[#27161a] hover:bg-[#1f1115] rounded-xl flex justify-center items-center ml-3 mr-2 transition-all duration-300"
        >
          <ChevronRightIcon className="h-8 w-8 text-white group-hover:opacity-100 opacity-60 transition-all" />
        </div>
      </div>

      <div
        className={`w-full ${
          isMenuExpanded ? "opacity-100" : "opacity-0"
        } overflow-scroll transition-all duration-300 flex flex-col justify-around h-full`}
      >
        <div>
          <Search
            teachers={teachers}
            classes={classes}
            rooms={rooms}
            setIsMenuExpanded={setIsMenuExpanded}
            handleSelect={handleSelect}
          />

          <div className="mx-4 transition-all">
            {dropdowns?.map((dropdown) => (
              <Menu
                key={`dropdown-${dropdown.title}`}
                as="div"
                className="text-left w-full my-4"
              >
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="inline-flex w-full justify-center dark:text-gray-300 rounded-md bg-[#202020] py-4 text-lg font-medium text-white hover:bg-[#171717] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {dropdown.title}

                        <ChevronDownIcon
                          className={`ml-2 mt-1 -mr-1 h-6 w-6 text-white hover:text-gray-50 transition-all duration-300 ${
                            open && "rotate-180"
                          }`}
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute max-h-[35%] mt-3 overflow-y-scroll mx-4 right-0 left-0 origin-top-right divide-y divide-gray-100 dark:divide-[#323232] rounded-md bg-gray-50 dark:bg-[#202020] shadow-lg ring-0 focus:outline-none">
                        {dropdown.data.map((item) => (
                          <div className="px-2 py-2" key={item.name}>
                            <Menu.Item as={Fragment}>
                              {({ active }) => (
                                <Link
                                  href={`/${dropdown.link}/${item.value}`}
                                  onClick={() => {
                                    setIsMenuExpanded(false);
                                    handleSelect(dropdown.link, item.value);
                                  }}
                                  className={`${
                                    lastSelect ===
                                      `/${dropdown.link}/${item.value}` &&
                                    "bg-gray-200 dark:bg-[#171717]"
                                  } ${
                                    active
                                      ? "dark:bg-[#171717] dark:text-gray-300 text-black bg-gray-100 font-semibold"
                                      : "text-gray-900 dark:text-gray-300 font-semibold"
                                  } group flex w-full items-center rounded-md px-2 py-2 transition-all text-sm duration-300`}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          </div>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            ))}
            <div className="flex justify-center items-center w-full flex-col text-gray-50 dark:text-gray-300 text-center">
              {generatedDate && (
                <p>
                  Wygenerowano:{" "}
                  <span className="font-semibold">{generatedDate}</span>
                </p>
              )}
              {validDate && (
                <p>
                  Obowiązuje od:{" "}
                  <span className="font-semibold">{validDate}</span>
                </p>
              )}
              <Link
                href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${timeTableID}.html`}
                target="_blank"
                className="font-semibold"
              >
                Źródło danych
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center flex-col">
          <Footer small />
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
