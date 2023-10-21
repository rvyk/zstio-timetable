import {
  ArrowDownIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";

function BottomBar({ handleKey, text, title }) {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <div
      className={`fixed transition-all ${
        isMenuExpanded ? "top-0" : "top-[88%]"
      } left-0 w-full flex justify-around bg-[#321c21] dark:bg-gray-900 h-full duration-700 z-50`}
    >
      <div className="h-24 w-full flex justify-center items-center -mt-2.5">
        <ArrowLeftCircleIcon
          className="h-10 w-10 text-white mr-3 ml-2 cursor-pointer opacity-60 hover:opacity-100 transition-all"
          onClick={() => {
            handleKey("ArrowLeft");
          }}
        />
        <div
          className="flex w-[70%] cursor-pointer h-14 border-2 border-[#27161a] dark:border-[#0f1421] items-center whitespace-nowrap"
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
              className={`h-6 w-6 transition-all duration-300  ${
                isMenuExpanded && "rotate-180"
              }`}
            />
          </div>
        </div>
        <ArrowRightCircleIcon
          className="h-10 w-10 text-white ml-3 mr-2 cursor-pointer opacity-60 hover:opacity-100 transition-all"
          onClick={() => {
            handleKey("ArrowRight");
          }}
        />
      </div>
    </div>
  );
}

export default BottomBar;
