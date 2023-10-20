import Link from "next/link";
import React from "react";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";

function Jumbotron(props) {
  let {
    text,
    status,
    classes,
    teachers,
    rooms,
    timeTable: { title },
  } = props;

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <div className="flex justify-center items-center mb-4 md:mb-0 -ml-0 md:-ml-16">
        <Link href={"https://zstiojar.edu.pl"} className="hidden md:block">
          <img
            alt="logo"
            className="w-20 h-20 mr-4"
            src={"/icon-192x192.png"}
          />
        </Link>
        <h1 className="transition-all text-5xl font-extrabold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-gray-100">
          Plan lekcji
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
          {title && text.length > 0 ? (
            <div className="flex justify-center mb-5 flex-wrap items-center ">
              <p className="transition-all text-xl font-normal mr-1 hidden sm:flex text-gray-500 lg:text-2xl dark:text-gray-400">
                {text} /
              </p>
              <p className="transition-all text-xl font-bold text-gray-500 lg:text-2xl dark:text-gray-400">
                {title}
              </p>
            </div>
          ) : (
            <Loading />
          )}
        </>
      )}

      {title && status && (
        <>
          {classes.length > 0 && (
            <Item
              dropdownId={"dropdownSearchClass"}
              dropdownToggleId={"dropdownClass"}
              item={"Oddziały"}
            />
          )}

          {teachers.length > 0 && (
            <Item
              dropdownId={"dropdownSearchTeacher"}
              dropdownToggleId={"dropdownTeacher"}
              item={"Nauczyciele"}
            />
          )}

          {rooms.length > 0 && (
            <Item
              dropdownId={"dropdownSearchRoom"}
              dropdownToggleId={"dropdownRoom"}
              item={"Sale"}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Jumbotron;

function Item({ dropdownId, dropdownToggleId, item }) {
  return (
    <button
      id={dropdownId}
      data-dropdown-toggle={dropdownToggleId}
      data-dropdown-placement="bottom"
      className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-transparent dark:text-gray-300 hover:dark:text-white dark:border-gray-400 dark:hover:bg-gra-700"
      type="button"
    >
      <MapPinIcon className="h-5 w-5 mr-2" />
      {item} <ChevronDownIcon className="w-4 h-4 ml-2" />
    </button>
  );
}

function Loading() {
  return (
    <div
      role="status"
      className="my-4 transition-all lg:text-xl w-full flex justify-center"
    >
      <ArrowPathIcon className="w-7 h-7 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2B161B] dark:fill-blue-800" />
    </div>
  );
}
