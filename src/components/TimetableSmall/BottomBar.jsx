import { Menu, Transition } from "@headlessui/react";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import Footer from "../Footer";
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";

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
  const dropdowns = [
    { data: classes, link: "class", title: "Oddziały" },
    { data: teachers, link: "teacher", title: "Nauczyciele" },
    { data: rooms, link: "room", title: "Sale" },
  ];

  useEffect(() => {
    const targetElement = document.querySelector("#bottomBar");
    if (isMenuExpanded && targetElement) {
      disableBodyScroll(targetElement);
      document.body.style.width = "100%";
      document.getElementsByTagName("html")[0].style.height = "100vh";
    } else if (targetElement) {
      enableBodyScroll(targetElement);
      document.body.style.width = "";
      document.getElementsByTagName("html")[0].style.height = "";
    }
    return function cleanup() {
      if (targetElement) clearAllBodyScrollLocks();
    };
  }, [isMenuExpanded]);

  return (
    <div
      id="bottomBar"
      className={`!fixed bottom-0 transition-all ${
        isMenuExpanded ? "h-full overflow-auto" : "h-[4.25rem]"
      } left-0 w-full flex flex-col bg-[#321c21] dark:bg-gray-900 duration-700 z-50`}
    >
      <div
        className={`h-24 relative mt-1.5 w-full flex justify-center items-center transition-all`}
      >
        <div
          onClick={() => {
            handleKey("ArrowLeft");
          }}
          className="h-14 w-14 cursor-pointer group dark:bg-[#0f1421] dark:hover:bg-[#0e131d] bg-[#27161a] hover:bg-[#1f1115] rounded-xl flex justify-center items-center ml-2 mr-3 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white group-hover:opacity-100 opacity-60 transition-all" />
        </div>
        <div
          className="flex w-[70%] dark:bg-[#0f1421] dark:hover:bg-[#0e131d] bg-[#27161a] hover:bg-[#27161a] rounded-xl transition-all duration-300 cursor-pointer h-14 items-center whitespace-nowrap"
          onClick={() => {
            setIsMenuExpanded(!isMenuExpanded);
          }}
        >
          <div className="w-[calc(100%-3rem)] left flex">
            <p className="transition-all text-xl font-normal text-gray-100 ml-3 mr-1 dark:text-gray-400">
              {text} /
            </p>
            <p className="transition-all text-xl font-bold text-gray-100 dark:text-gray-400 overflow-hidden text-ellipsis">
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
          className="h-14 cursor-pointer w-14 group dark:bg-[#0f1421] dark:hover:bg-[#0e131d] bg-[#27161a] hover:bg-[#1f1115] rounded-xl flex justify-center items-center ml-3 mr-2 transition-all duration-300"
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
          <div class="relative mx-4 my-4">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </div>
            <input
              class="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 ring-0 outline-none dark:bg-[#0f1421] dark:border-gray-800 dark:placeholder-gray-400 dark:text-white"
              placeholder="Wyszukaj klasę, nauczyciela i salę..."
            />
          </div>

          <div className="mx-4 transition-all">
            {dropdowns.map((dropdown) => (
              <Menu
                key={`dropdown-${dropdown.title}`}
                as="div"
                className="text-left w-full my-4"
              >
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 py-4 text-lg font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
                      <Menu.Items className="absolute max-h-[35%] mt-3 overflow-y-scroll mx-4 right-0 left-0 origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-md bg-gray-50 dark:bg-[#0f1421] shadow-lg ring-0 focus:outline-none">
                        {dropdown.data.map((item) => (
                          <div className="px-2 py-2" key={item.name}>
                            <Menu.Item as={Fragment}>
                              {({ active }) => (
                                <Link
                                  href={`/${dropdown.link}/${item.value}`}
                                  onClick={() => {
                                    setIsMenuExpanded(false);
                                  }}
                                  className={`${
                                    active
                                      ? "dark:bg-[#0e131d] dark:text-white text-black bg-gray-100 font-semibold"
                                      : "text-gray-900 dark:text-white font-semibold"
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
            <div className="flex justify-center items-center w-full flex-col text-gray-50 text-center">
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
