"use client";

import {
  SettingsContext,
  SettingsContextType,
} from "@/components/setting-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, normalHours, shortHours } from "@/lib/utils";
import { useContext } from "react";

const ShortHoursButton: React.FC = () => {
  const [isShortHours, setIsShortHours] = (
    useContext(SettingsContext) as SettingsContextType
  ).shortHours;
  const [hoursTime, setHoursTime] = (
    useContext(SettingsContext) as SettingsContextType
  ).hoursTime;

  const handleButton = (state: boolean) => {
    setIsShortHours(state);
    localStorage.setItem("shortHours", state.toString());
    setHoursTime(state ? shortHours : normalHours);
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
      <div className="flex">
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
              hoursTime !== normalHours &&
                hoursTime !== shortHours &&
                "!hidden",
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
