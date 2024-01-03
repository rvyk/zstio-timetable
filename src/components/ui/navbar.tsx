import RedirectButton from "@/components/navbar-buttons/redirect";
import ThemeButton from "@/components/navbar-buttons/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PWAButton from "../navbar-buttons/pwa";

function Navbar() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

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

  if (!resolvedTheme || !isClient) return null;

  return (
    <div className="w-screen h-14 block lg:absolute top-0">
      <div className="absolute top-2 right-2 z-30 transition-all flex">
        <TooltipProvider>
          <PWAButton />
          <ThemeButton
            toggleTheme={toggleTheme}
            resolvedTheme={resolvedTheme}
          />
          <RedirectButton />
        </TooltipProvider>
      </div>
    </div>
  );
}

export default Navbar;
