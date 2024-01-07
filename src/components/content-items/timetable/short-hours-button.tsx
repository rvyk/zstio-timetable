import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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
  const { isReady } = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isReady) return null;

  const handleButton = (state: boolean) => {
    setIsShortHours(state);
    localStorage.setItem("shortHours", state.toString());
  };

  const shortHoursStyles = {
    default:
      "px-4 py-2 transition-all text-sm font-medium text-gray-900 border border-gray-200 focus:z-10 focus:ring-0 dark:text-white dark:hover:text-white dark:focus:text-white",
    normal:
      "bg-white dark:bg-[#202020] lg:dark:bg-[#171717] dark:hover:bg-[#191919] hover:bg-gray-200 dark:border-none",
    short:
      "bg-[#321c21] hover:bg-[#480e0c] dark:hover:bg-red-500 dark:bg-red-400 dark:border-none text-white hover:text-gray-200 focus:text-gray-200",
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
      {tooltips.map((tooltip, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <button
              type="button"
              onClick={() => {
                handleButton(tooltip.value);
              }}
              className={cn(
                shortHoursStyles.default,
                index === 0 ? "rounded-l-lg" : "rounded-r-lg",
                isShortHours === tooltip.value
                  ? shortHoursStyles.short
                  : shortHoursStyles.normal,
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
    </>
  );
};

export default ShortHoursButton;
