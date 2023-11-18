import Link from "next/link";
import React from "react";
import {
  AcademicCapIcon,
  ChevronDownIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Image from "next/legacy/image";
import Loading from "./Loading";

function JumbotronLarge(props) {
  let { text, status, classes, teachers, rooms, timeTable } = props;

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <div className="flex justify-center items-center mb-4 md:mb-0 -ml-0 md:-ml-16">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 mr-4 hidden md:block"
        >
          <Image
            alt="logo"
            src={"/icon-192x192.png"}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
        <h1 className="transition-all text-5xl font-bold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-gray-100">
          Plan lekcji <span className="font-extrabold">ZSTiO</span>
        </h1>
      </div>
      {!status ? (
        <>
          {status === undefined ? (
            <Loading />
          ) : (
            <div className="flex justify-center mb-5 flex-wrap items-center ">
              <p className="transition-all text-xl font-normal mr-1 hidden sm:flex text-gray-500 lg:text-2xl dark:text-gray-400">
                Nie znaleziono pasującego planu lekcji
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {timeTable?.title && text.length > 0 ? (
            <div className="flex justify-center mb-5 flex-wrap items-center ">
              <p className="transition-all text-xl font-normal mr-1 hidden sm:flex text-gray-500 lg:text-2xl dark:text-gray-400">
                {text} /
              </p>
              <p className="transition-all text-xl font-bold text-gray-500 lg:text-2xl dark:text-gray-400">
                {timeTable?.title}
              </p>
            </div>
          ) : (
            <Loading />
          )}
        </>
      )}

      {timeTable?.title && status && (
        <>
          {classes.length > 0 && (
            <Item
              dropdownId={"dropdownSearchClass"}
              dropdownToggleId={"dropdownClass"}
              item={"Oddziały"}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
            </Item>
          )}

          {teachers.length > 0 && (
            <Item
              dropdownId={"dropdownSearchTeacher"}
              dropdownToggleId={"dropdownTeacher"}
              item={"Nauczyciele"}
            >
              <UsersIcon className="h-5 w-5 mr-2" />
            </Item>
          )}

          {rooms.length > 0 && (
            <Item
              dropdownId={"dropdownSearchRoom"}
              dropdownToggleId={"dropdownRoom"}
              item={"Sale"}
            >
              <MapPinIcon className="h-5 w-5 mr-2" />
            </Item>
          )}
        </>
      )}
    </div>
  );
}

export default JumbotronLarge;

function Item({ dropdownId, dropdownToggleId, item, children }) {
  return (
    <button
      id={dropdownId}
      data-dropdown-toggle={dropdownToggleId}
      data-dropdown-placement="bottom"
      className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
      type="button"
    >
      {children}
      {item} <ChevronDownIcon className="w-4 h-4 ml-2" />
    </button>
  );
}
