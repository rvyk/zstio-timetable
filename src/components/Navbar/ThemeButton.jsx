import React from "react";
import { SunIcon } from "@heroicons/react/20/solid";
import { MoonIcon } from "@heroicons/react/24/outline";
function ThemeButton({ toggleTheme, resolvedTheme }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-tooltip-id="navbar_tooltips"
      data-tooltip-content="Zmień motyw"
      className="flex transition-all items-center p-3 mr-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-[#2B161B] dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
    >
      {resolvedTheme === "light" ? (
        <SunIcon className="w-4 h-4 transition-none" />
      ) : (
        <MoonIcon className="w-4 h-4 transition-none" />
      )}
    </button>
  );
}

export default ThemeButton;
