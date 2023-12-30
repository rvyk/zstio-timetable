import React, { useEffect, useState } from "react";

function ShortHours({
  setIsShortHours,
  isShortHours,
}: {
  setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>;
  isShortHours: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <button
        type="button"
        data-tooltip-id="content_tooltips"
        data-tooltip-content="Normalne lekcje - 45 minut"
        onClick={() => {
          setIsShortHours(false);
          localStorage.setItem("shortHours", "false");
        }}
        className={` ${
          isShortHours
            ? "bg-white dark:bg-[#202020] lg:dark:bg-[#171717] dark:hover:bg-[#191919] hover:bg-gray-200 dark:border-none"
            : "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-red-500 dark:bg-red-400 dark:border-none text-white hover:text-gray-200 focus:text-gray-200"
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
          localStorage.setItem("shortHours", "true");
        }}
        className={` ${
          isShortHours
            ? "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-red-500 dark:bg-red-400 dark:border-none text-white hover:text-gray-200 focus:text-gray-200"
            : "bg-white dark:bg-[#202020] lg:dark:bg-[#171717] dark:hover:bg-[#191919] hover:bg-gray-200 dark:border-none"
        } px-4 py-2 transition-all text-sm font-medium text-gray-900 border border-gray-200 rounded-r-lg focus:z-10 focus:ring-0 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
      >
        {"30'"}
      </button>
    </>
  );
}

export default ShortHours;
