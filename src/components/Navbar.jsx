import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InstallPWA from "./InstallPWA";
import { Tooltip } from "react-tooltip";
import { SunIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathRoundedSquareIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

function Navbar() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log(window?.location?.hostname);
    document.cookie = `selectedTheme=${newTheme}; path=/; domain=${(window?.location?.hostname)
      .split(".")
      .slice(-2)
      .join(".")};`;
  };

  useEffect(() => {
    setIsMounted(true);
    const theme = document.cookie.replace(
      /(?:(?:^|.*;\s*)selectedTheme\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (theme) {
      setTheme(theme);
    }
  }, [setTheme]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-screen h-14 block lg:absolute top-0">
      <div className="absolute top-2 left-2 z-50 md:hidden transition-all">
        <Link href={"https://zstiojar.edu.pl"}>
          <img
            alt="logo"
            className="w-20 h-20 mr-4"
            src={"/icon-192x192.png"}
          />
        </Link>
      </div>
      {resolvedTheme != undefined && (
        <div className="absolute top-2 right-2 z-50 transition-all flex">
          <button
            data-tooltip-id="navbar_tooltips"
            data-tooltip-content="Zainstaluj apkę"
          >
            <InstallPWA />
          </button>
          <Link
            href={"https://zastepstwa.awfulworld.space/"}
            data-tooltip-id="navbar_tooltips"
            data-tooltip-content="Przejdź do zastępstw"
            className="flex transition-all items-center p-3 mr-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-[#2B161B] dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <ArrowPathRoundedSquareIcon className="h-4 w-4 transition-none" />
          </Link>
          <Tooltip
            id="navbar_tooltips"
            className="!bg-[#2B161B] dark:!text-gray-200 dark:!bg-gray-800"
          />
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
        </div>
      )}
    </div>
  );
}

export default Navbar;
