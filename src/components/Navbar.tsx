import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import ChangeButton from "./Navbar/ChangeButton";
import InstallPWA from "./Navbar/InstallPWA";
import SearchButton from "./Navbar/SearchButton";
import SnowEastereggButton from "./Navbar/SnowEastereggButton";
import ThemeButton from "./Navbar/ThemeButton";

function Navbar(
  {
    searchDialog,
    setSearchDialog,
    isSnowing,
    setIsSnowing,
    inTimetable,
  }: {
    searchDialog: boolean;
    setSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
    isSnowing: boolean;
    setIsSnowing: React.Dispatch<React.SetStateAction<boolean>>;
    inTimetable: boolean;
  },
) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.cookie = `selectedTheme=${newTheme}; path=/; domain=${window?.location?.hostname
      ?.split(".")
      .slice(-3)
      .join(".")};`;
  };

  useEffect(() => {
    setIsMounted(true);
    const theme = document.cookie.replace(
      /(?:(?:^|.*;\s*)selectedTheme\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
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
      {resolvedTheme != undefined && (
        <div className="absolute top-2 right-2 z-30 transition-all flex">
          <InstallPWA />
          {new Date().getMonth() === 11 && (
            <SnowEastereggButton
              isSnowing={isSnowing}
              setIsSnowing={setIsSnowing}
            />
          )}
          {!!setSearchDialog && (
            <SearchButton
              searchDialog={searchDialog}
              setSearchDialog={setSearchDialog}
            />
          )}
          {process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL && (
            <ChangeButton inTimetable={inTimetable} />
          )}
          <ThemeButton
            toggleTheme={toggleTheme}
            resolvedTheme={resolvedTheme}
          />
          <Tooltip
            id="navbar_tooltips"
            className="!bg-[#2B161B] dark:!text-gray-300 dark:!bg-[#161616] text-center"
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
