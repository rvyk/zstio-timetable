import ResponsiveShortHourDialog from "@/components/content-items/render-short-hour";
import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const ShortHoursCalculator: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ResponsiveShortHourDialog
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
      <ButtonWrapper
        tooltipText="Oblicz skrocone lekcje"
        className={className}
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
