import ShortHoursButton from "@/components/content-items/timetable/short-hours-button";
import ShortHoursCalculator from "@/components/content-items/timetable/short-hours-calculator";
import MoreButtons from "@/components/navbar-buttons/more-buttons";
import PWAButton from "@/components/navbar-buttons/pwa";
import RedirectButton from "@/components/navbar-buttons/redirect";
import RoomLookup from "@/components/navbar-buttons/room-lookup";
import ThemeButton from "@/components/navbar-buttons/theme";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

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

        {!isSubstitutions && <ShortHoursButton />}
      </div>

      <div className="flex items-center justify-center">
        {!isSubstitutions && (
          <div className="block md:hidden">
            <NavigationMenu>
              <NavigationMenuList>
                <div className="flex flex-row">
                  <NavigationMenuItem>
                    <MoreButtons />
                    <NavigationMenuContent className="flex flex-col items-center justify-around rounded py-1.5">
                      <RoomLookup />
                      <div className="h-1"></div>
                      <ShortHoursCalculator />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
        <RedirectButton />
        <div className="hidden md:block">
          {!isSubstitutions && <RoomLookup />}
          <PWAButton />
        </div>
        <ThemeButton toggleTheme={toggleTheme} resolvedTheme={resolvedTheme} />
      </div>
    </div>
  );
};

export default Navbar;
