import { Button } from "@/components/ui/button";
import { useSettingsWithoutStore } from "@/stores/settings-store";
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

export const TopbarButtons: FC = () => {
  const isClient = useIsClient();
  const pathname = usePathname();
  const isSubstitutionPage = pathname === "/substitutions";

  const { theme, setTheme, systemTheme } = useTheme();
  const toggleFullscreenMode = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );
  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );

  const toggleTheme = useCallback(() => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  }, [theme, setTheme, systemTheme]);

  const buttons = useMemo(() => {
    if (isClient) {
      return [
        {
          icon: theme === "dark" ? SunMediumIcon : MoonIcon,
          href: null,
          action: toggleTheme,
          ariaLabel:
            theme === "dark"
              ? "Przełącz na jasny tryb"
              : "Przełącz na ciemny tryb",
        },
        {
          icon: isSubstitutionPage ? TableIcon : Repeat2Icon,
          href: isSubstitutionPage ? "/" : "/substitutions",
          action: null,
          ariaLabel: isSubstitutionPage
            ? "Przejdź do planu zajęć"
            : "Przejdź do zastępstw",
        },
        {
          icon: FullscreenIcon,
          href: null,
          action: toggleFullscreenMode,
          ariaLabel: "Przełącz tryb pełnoekranowy",
        },
        {
          icon: MenuIcon,
          href: null,
          action: toggleSettingsPanel,
          ariaLabel: "Otwórz panel ustawień",
        },
      ];
    }
  }, [
    isClient,
    theme,
    toggleTheme,
    isSubstitutionPage,
    toggleFullscreenMode,
    toggleSettingsPanel,
  ]);

  return (
    <div className="inline-flex gap-2.5">
      {buttons?.map((button, index) => {
        const IconComponent = button.icon;
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
TopbarButtons.displayName = "TopbarButtons";
