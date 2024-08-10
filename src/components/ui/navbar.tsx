"use client";

import ShortHoursCalculator from "@/components/content-items/timetable/short-hours-calculator";
import PWAButton from "@/components/navbar-buttons/pwa";
import RedirectButton from "@/components/navbar-buttons/redirect";
import RoomLookup from "@/components/navbar-buttons/room-lookup";

import useBetterMediaQuery from "@/lib/useMediaQueryClient";
import zstioLogo72 from "@/media/icon-72x72.png";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import ShortHoursButton from "../content-items/timetable/short-hours-button";
import CalendarButton from "../navbar-buttons/calendar";
import MoreButtons from "../navbar-buttons/more-buttons";
import SubscribeButton from "../navbar-buttons/subscribe";
import ThemeButton from "../navbar-buttons/theme";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isIndex = pathname === "/" || pathname === null;
  const isSubstitutions = pathname === "/zastepstwa";
  const isMobile = useBetterMediaQuery("(max-width: 767.5px)");

  if (isIndex) return null;

  return (
    <div className="relative z-30 flex justify-between rounded-b-lg bg-[#ffffff] p-2 shadow-sm transition-all dark:bg-[#202020] md:absolute md:right-2 md:top-2 md:!bg-transparent md:p-0 md:shadow-none">
      {isMobile && (
        <div className="flex items-center gap-2">
          <div className="relative h-11 w-11">
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

      <div className="relative flex items-center justify-center gap-2">
        {!isSubstitutions && (
          <Menu as="div" className="w-full text-left">
            {({ open }) => (
              <>
                {isMobile && (
                  <Menu.Button as="div">
                    <MoreButtons />
                  </Menu.Button>
                )}
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute mt-2.5 max-h-48 w-fit -translate-x-1 overflow-y-scroll rounded-lg border-0 bg-white p-1 shadow dark:bg-[#131313]">
                    <div className="flex w-fit flex-col space-y-1">
                      <SubscribeButton />
                      <RoomLookup />
                      <ShortHoursCalculator />
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        )}
        <PWAButton />
        {!isMobile && <CalendarButton />}
        {!isMobile && <SubscribeButton />}
        {!isSubstitutions && !isMobile && <RoomLookup />}
        <RedirectButton />
        <ThemeButton />
      </div>
    </div>
  );
};

export default Navbar;
