import ShortHoursButton from "@/components/content-items/timetable/short-hours-button";
import PWAButton from "@/components/navbar-buttons/pwa";
import RedirectButton from "@/components/navbar-buttons/redirect";
import RoomLookup from "@/components/navbar-buttons/room-lookup";
import ThemeButton from "@/components/navbar-buttons/theme";
import { useTheme } from "next-themes";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="relative z-30 flex justify-between rounded-b-lg bg-[#ffffff] p-2 shadow-sm transition-all dark:bg-[#202020] md:absolute md:right-2 md:top-2 md:justify-normal md:!bg-transparent md:p-0 md:shadow-none">
      <Link
        prefetch={false}
        href="https://zstiojar.edu.pl"
        className="relative h-11 w-11 md:hidden"
      >
        <Image
          alt="logo"
          src="/icon-72x72.png"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </Link>
      <div className="block md:hidden">
        <ShortHoursButton {...{ isShortHours, setIsShortHours }} />
      </div>
      <div>
        <PWAButton />
        {!isSubstitutions && <RoomLookup />}
        <RedirectButton />
        <ThemeButton toggleTheme={toggleTheme} resolvedTheme={resolvedTheme} />
      </div>
    </div>
  );
};

export default Navbar;
