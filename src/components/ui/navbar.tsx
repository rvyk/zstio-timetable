import PWAButton from "@/components/navbar-buttons/pwa";
import RedirectButton from "@/components/navbar-buttons/redirect";
import ThemeButton from "@/components/navbar-buttons/theme";
import { useTheme } from "next-themes";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ShortHoursButton from "../content-items/timetable/short-hours-button";
import ShortHoursCalculator from "../content-items/timetable/short-hours-calculator";
import MoreButtons from "../navbar-buttons/more-buttons";
import RoomLookup from "../navbar-buttons/room-lookup";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "./navigation-menu";

const Navbar: React.FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  const [isShortHours, setIsShortHours] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("shortHours") === "true",
  );

  const pathname = usePathname();
  const isIndex = pathname === "/";
  const isSubstitutions = pathname === "/zastepstwa";

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!resolvedTheme || !isClient || isIndex) return null;

  return (
    <div className="relative z-30 flex justify-between rounded-b-lg bg-[#ffffff] p-2 shadow-sm transition-all dark:bg-[#202020] md:absolute md:right-2 md:top-2 md:!bg-transparent md:p-0 md:shadow-none">
      <div className="flex items-center md:hidden">
        <div className="relative mr-2 h-11 w-11">
          <Link prefetch={false} href="https://zstiojar.edu.pl">
            <Image
              alt="logo"
              src="/icon-72x72.png"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </Link>
        </div>

        {!isSubstitutions && (
          <ShortHoursButton {...{ isShortHours, setIsShortHours }} />
        )}
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <div className="flex flex-row">
            <div className="hidden md:block">
              <PWAButton />
              <RoomLookup />
            </div>

            <NavigationMenuItem>
              <div className="relative md:hidden ">
                <MoreButtons />
                <NavigationMenuContent className="flex flex-col items-center justify-around rounded py-1.5">
                  <RoomLookup />
                  <div className="h-1"></div>
                  <ShortHoursCalculator />
                </NavigationMenuContent>
              </div>
            </NavigationMenuItem>

            <RedirectButton />
            <ThemeButton
              toggleTheme={toggleTheme}
              resolvedTheme={resolvedTheme}
            />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
