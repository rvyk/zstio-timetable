import React from "react";

function ShortHours({ setIsShortHours, isShortHours }) {
  return (
    <>
      <button
        type="button"
        data-tooltip-id="content_tooltips"
        data-tooltip-content="Normalne lekcje - 45 minut"
        onClick={() => {
          setIsShortHours(false);
          localStorage.setItem("shortHours", false);
        }}
        className={` ${
          isShortHours
            ? "bg-white dark:bg-[#2b2b2b] dark:hover:bg-[#202020] hover:bg-gray-200 dark:border-[#2b2b2b]"
            : "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-[#171717] dark:bg-[#202020] dark:border-[#202020] text-white hover:text-gray-200 focus:text-gray-200"
        }  px-4 py-2 transition-all text-sm font-medium text-gray-900 border border-gray-200 rounded-l-lg focus:z-10 focus:ring-0 dark:text-white dark:hover:text-white dark:focus:text-white`}
      >
        {"45'"}
      </button>
      <button
        type="button"
        data-tooltip-id="content_tooltips"
        data-tooltip-content="Skrócone lekcje - 30 minut"
        onClick={() => {
          setIsShortHours(true);
          localStorage.setItem("shortHours", true);
        }}
        className={` ${
          isShortHours
            ? "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-[#171717] dark:bg-[#202020] dark:border-[#202020] text-white hover:text-gray-200 focus:text-gray-200"
            : "bg-white dark:bg-[#2b2b2b] dark:hover:bg-[#202020] hover:bg-gray-200 dark:border-[#2b2b2b]"
        } px-4 py-2 transition-all text-sm font-medium text-gray-900 border border-gray-200 rounded-r-lg focus:z-10 focus:ring-0 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
      >
        {"30'"}
      </button>
    </>
  );
}

export default ShortHours;
