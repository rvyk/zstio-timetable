import React from "react";
import Navbar from "./../Navbar";
import Link from "next/link";

function RenderNavbar({ isShortHours, setIsShortHours }) {
  return (
    <div className="flex items-center w-full">
      <div className="ml-2 flex justify-center items-center mx-4">
        <Link href={"https://zstiojar.edu.pl"}>
          <img
            alt="logo"
            className="w-16 h-16 mr-4 object-contain"
            src={"/icon-152x152.png"}
          />
        </Link>
      </div>
      <div className="inline-flex rounded-md shadow-sm mr-2" role="group">
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
              ? "bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
              : "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-gray-950 dark:bg-gray-900 text-white hover:text-gray-200 focus:text-gray-200"
          }  px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-l-lg focus:z-10 focus:ring-0 dark:border-gray-600 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
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
              ? "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-gray-950 dark:bg-gray-900 text-white hover:text-gray-200 focus:text-gray-200"
              : "bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
          } px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-r-lg focus:z-10 focus:ring-0 dark:border-gray-600 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
        >
          {"30'"}
        </button>
      </div>

      <Navbar />
    </div>
  );
}

export default RenderNavbar;
