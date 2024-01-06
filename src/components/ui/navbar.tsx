import PWAButton from "@/components/navbar-buttons/pwa";
import RedirectButton from "@/components/navbar-buttons/redirect";
import RoomLookup from "@/components/navbar-buttons/room-lookup";
import ThemeButton from "@/components/navbar-buttons/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function Navbar() {
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
    <div className="absolute top-2 right-2 z-30 transition-all flex">
      <TooltipProvider>
        <PWAButton />
        {!isSubstitutions && <RoomLookup />}
        <RedirectButton />
        <ThemeButton toggleTheme={toggleTheme} resolvedTheme={resolvedTheme} />
      </TooltipProvider>
    </div>
  );
}

export default Navbar;
