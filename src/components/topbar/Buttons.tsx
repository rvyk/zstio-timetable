import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSettingsWithoutStore } from "@/stores/settings";
import { MenuIcon, MoonIcon, PrinterIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useCallback } from "react";
import { useIsClient } from "usehooks-ts";

interface TopbarButtonsProps {
  onPrint: () => void;
}

export const TopbarButtons: FC<TopbarButtonsProps> = ({ onPrint }) => {
  const isClient = useIsClient();

  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [currentTheme, setTheme]);

  const buttons = [
    {
      icon: PrinterIcon,
      href: null,
      action: onPrint,
      ariaLabel: "Drukuj plan lekcji",
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
      icon: MenuIcon,
      href: null,
      action: toggleSettingsPanel,
      ariaLabel: "Otwórz panel ustawień",
    },
  ];

  if (!isClient)
    return (
      <div className="inline-flex gap-x-2.5 print:hidden">
        {Array.from({ length: buttons.length }).map((_, index) => (
          <Skeleton className="h-10 w-10" key={index} />
        ))}
      </div>
    );

  return (
    <div className="inline-flex gap-2.5 print:hidden">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;

        return (
          <Button
            key={index}
            aria-label={button.ariaLabel}
            variant="icon"
            size="icon"
            onClick={button.action}
            type="button"
          >
            <IconComponent strokeWidth={2.5} className="size-4 sm:size-5" />
          </Button>
        );
      })}
    </div>
  );
};
