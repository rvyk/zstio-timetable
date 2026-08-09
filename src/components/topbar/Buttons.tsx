import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSettingsWithoutStore } from "@/stores/settings";
import { PrinterIcon, SlidersHorizontal } from "lucide-react";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";

export const TopbarButtons: FC = () => {
  const isClient = useIsClient();

  const toggleSettingsPanel = useSettingsWithoutStore(
    (state) => state.toggleSettingsPanel,
  );

  const buttons = [
    {
      icon: PrinterIcon,
      action: () => window.open("/print", "_blank"),
      ariaLabel: "Drukuj plan",
    },
    {
      icon: SlidersHorizontal,
      action: toggleSettingsPanel,
      ariaLabel: "Otwórz dodatkowe funkcje",
    },
  ];

  if (!isClient)
    return (
      <div className="inline-flex gap-x-2.5">
        {Array.from({ length: buttons.length }).map((_, index) => (
          <Skeleton className="h-10 w-10" key={index} />
        ))}
      </div>
    );

  return (
    <div className="inline-flex gap-2.5">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;

        return (
          <Button
            key={index}
            aria-label={button.ariaLabel}
            variant="icon"
            size="icon"
            onClick={button.action}
          >
            <IconComponent strokeWidth={2.5} className="size-4 sm:size-5" />
          </Button>
        );
      })}
    </div>
  );
};
