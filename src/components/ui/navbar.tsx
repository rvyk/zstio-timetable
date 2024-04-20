"use client";

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
import useBetterMediaQuery from "@/lib/useMediaQueryClient";
import zstioLogo72 from "@/media/icon-72x72.png";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isIndex = pathname === "/" || pathname === null;
  const isSubstitutions = pathname === "/zastepstwa";
  const isMobile = useBetterMediaQuery("(max-width: 767.5px)");

  if (isIndex) return null;

  return (
    <div className="relative z-30 flex justify-between rounded-b-lg bg-[#ffffff] p-2 shadow-sm transition-all dark:bg-[#202020] md:absolute md:right-2 md:top-2 md:!bg-transparent md:p-0 md:shadow-none">
      {isMobile && (
        <div className="flex items-center">
          <div className="relative mr-2 h-11 w-11">
            <Link prefetch={false} href="https://zstiojar.edu.pl">
              <Image
                alt="logo"
                src={zstioLogo72}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                priority
              />
            </Link>
          </div>

          {!isSubstitutions && <ShortHoursButton />}
        </div>
      )}

      <div className="flex items-center justify-center">
        {!isSubstitutions && (
          <div className="">
            <NavigationMenu>
              <NavigationMenuList>
                <div className="flex flex-row">
                  <NavigationMenuItem>
                    {isMobile && <MoreButtons />}
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
        <PWAButton />
        <RedirectButton />
        <div>{!isSubstitutions && !isMobile && <RoomLookup />}</div>
        <ThemeButton />
      </div>
    </div>
  );
};

export default Navbar;
