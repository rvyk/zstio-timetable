import { normalHours, shortHours } from "@/lib/utils";
import React from "react";

export type SettingsContextType = {
  shortHours: [
    shortHours: boolean,
    setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>,
  ];
  hoursTime: [
    hoursTime: hourType[],
    setHoursTime: React.Dispatch<React.SetStateAction<hourType[]>>,
  ];
};

export const SettingsContext = React.createContext<SettingsContextType | null>(
  null,
);

const SettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }: {children: React.ReactNode}) => {
  const [shortHoursBool, setIsShortHours] = React.useState(
    typeof localStorage !== "undefined"
      ? localStorage?.getItem("shortHours") === "true"
      : false,
  );

  const [hoursTime, setHoursTime] = React.useState<hourType[]>(normalHours);

  return (
    <SettingsContext.Provider
      value={{
        shortHours: [shortHoursBool, setIsShortHours],
        hoursTime: [shortHoursBool ? shortHours : hoursTime , setHoursTime],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
