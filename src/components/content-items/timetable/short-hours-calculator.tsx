import ResponsiveShortHourDialog from "@/components/content-items/render-short-hour";
import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import {
  SettingsContext,
  SettingsContextType,
} from "@/components/setting-context";
import { cn, normalHours, shortHours } from "@/lib/utils";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

const ShortHoursCalculator: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoursTime] = (useContext(SettingsContext) as SettingsContextType)
    ?.hoursTime;

  return (
    <>
      <ResponsiveShortHourDialog
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
      <ButtonWrapper
        tooltipText="Oblicz skrocone lekcje"
        className={cn(
          className,
          hoursTime !== normalHours &&
            hoursTime !== shortHours &&
            "!bg-[#321c21] hover:!bg-[#480e0c] dark:!bg-red-400 dark:hover:!bg-red-500",
        )}
        onClick={() => {
          setIsDrawerOpen(true);
        }}
      >
        <CalculatorIcon className="h-4 w-4" />
      </ButtonWrapper>
    </>
  );
};

export default ShortHoursCalculator;
