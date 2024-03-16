"use client";

import React from "react";

// export type SettingsContextType = {
//     shortHours: [shortHours: boolean, setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>];
//     hoursTime: [hoursTime: hourType[], setHoursTime: React.Dispatch<React.SetStateAction<hourType[]>>];
// };

export const SettingsContext = React.createContext</*SettingsContextType |*/ null>(null);

const SettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shortHoursBool, setIsShortHours] = React.useState(
    typeof localStorage !== "undefined" ? localStorage?.getItem("shortHours") === "true" : false,
  );

  // const [hoursTime, setHoursTime] = React.useState<hourType[]>(normalHours);

  // useEffect(() => {
  //     if (shortHoursBool) setHoursTime(shortHours);
  // }, [shortHoursBool]);

  return (
    <SettingsContext.Provider
      /*
                {shortHours: [shortHoursBool, setIsShortHours],
                hoursTime: [hoursTime, setHoursTime],}
             */
      value={null}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
