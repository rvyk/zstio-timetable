import { Button } from "@/components/ui/button";
import { useSettingsWithoutStore } from "@/stores/settings-store";
import { getCookie } from "cookies-next";
import {
  FullscreenIcon,
  MenuIcon,
  MoonIcon,
  Repeat2Icon,
  SunMediumIcon,
  TableIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useCallback, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { Skeleton } from "../ui/skeleton";

export const TopbarButtons: FC = () => {
  const isClient = useIsClient();
  const pathname = usePathname();

  const lastVisited = useMemo(() => getCookie("lastVisited") ?? "/", []);
  const redirectFromSubstitutions = lastVisited as string;

  const isSubstitutionPage = pathname === "/substitutions";

  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleFullscreen = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );
  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [currentTheme, setTheme]);

  const buttons = [
    {
      icon: FullscreenIcon,
      href: null,
      action: toggleFullscreen,
      ariaLabel: "Przełącz na tryb pełnoekranowy (F/F11)",
      hidden: isSubstitutionPage,
    },
    {
      icon: currentTheme === "dark" ? SunMediumIcon : MoonIcon,
      href: null,
      action: toggleTheme,
      ariaLabel:
        currentTheme === "dark"
          ? "Przełącz na tryb jasny"
          : "Przełącz na tryb ciemny",
    },
    {
      icon: isSubstitutionPage ? TableIcon : Repeat2Icon,
      href: isSubstitutionPage ? redirectFromSubstitutions : "/substitutions",
      action: null,
      ariaLabel: isSubstitutionPage
        ? "Przejdź do planu zajęć"
        : "Przejdź do zastępstw",
    },
    {
      icon: MenuIcon,
      href: null,
      action: toggleSettingsPanel,
      ariaLabel: "Otwórz panel ustawień",
    },
  ];

  if (!isClient)
    return (
      <div className="inline-flex gap-x-2.5">
        {Array.from({
          length: buttons.filter((btn) => !btn.hidden).length,
        }).map((_, index) => (
          <Skeleton className="h-10 w-10" key={index} />
        ))}
      </div>
    );

  return (
    <div className="inline-flex gap-2.5">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;

        if (button.hidden) return null;

        return (
          <Button
            key={index}
            aria-label={button.ariaLabel}
            variant="icon"
            size="icon"
            onClick={button.action ?? undefined}
            asChild={Boolean(button.href)}
          >
            {button.href ? (
              <Link href={button.href}>
                <IconComponent size={20} strokeWidth={2.5} />
              </Link>
            ) : (
              <IconComponent size={20} strokeWidth={2.5} />
            )}
          </Button>
        );
      })}
    </div>
  );
};
