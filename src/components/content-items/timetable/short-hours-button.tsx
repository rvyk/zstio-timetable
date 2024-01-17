import ResponsiveShortHourDialog from "@/components/content-items/render-short-hour";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ShortHoursButtonProps {
  setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>;
  isShortHours: boolean;
}

const ShortHoursButton: React.FC<ShortHoursButtonProps> = ({
  setIsShortHours,
  isShortHours,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isReady } = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isReady) return null;

  const handleButton = (state: boolean) => {
    localStorage.setItem("shortHours", state.toString());
    setIsShortHours(state);
  };

  const tooltips = [
    {
      text: "Normalne lekcje - 45 minut",
      value: false,
    },
    {
      text: "Skrócone lekcje - 30 minut",
      value: true,
    },
  ];

  return (
    <>
      <ResponsiveShortHourDialog
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />

      <div className="flex">
        <div className="hidden md:block">
          <Button
            variant="secondary"
            size="default"
            className="mr-2 rounded-lg bg-[#321c21] text-gray-50 hover:bg-[#480e0c] dark:bg-[#181818] dark:hover:bg-[#161616]"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            <CalculatorIcon className="text-dark-900 h-6 w-6 dark:text-white" />
          </Button>
        </div>
        <div className="relative">
          {tooltips.map((tooltip, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    handleButton(tooltip.value);
                  }}
                  className={cn(
                    "border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-gray-900 transition-all hover:bg-gray-200 focus:z-10 focus:ring-0 dark:border-none dark:bg-[#171717] dark:text-white dark:hover:bg-[#191919] dark:hover:text-white dark:focus:text-white",
                    index === 0 ? "rounded-l-lg" : "rounded-r-lg",
                  )}
                >
                  {tooltip.value ? "30'" : "45'"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip.text}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <div
            className={cn(
              "absolute top-0 h-full w-[50%] cursor-default bg-[#321c21] px-4 py-2 text-sm font-medium text-gray-50 transition-all hover:bg-[#480e0c] hover:text-gray-200 focus:text-gray-200 dark:border-none dark:bg-red-400 dark:text-white dark:hover:bg-red-500 dark:hover:text-white dark:focus:text-white",
              isShortHours
                ? "translate-x-[100%] transform rounded-r-lg"
                : "rounded-l-lg",
            )}
          >
            {isShortHours ? "30'" : "45'"}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortHoursButton;
