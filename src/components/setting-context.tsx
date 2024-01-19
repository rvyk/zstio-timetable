import React from "react";

export type SettingsContextType = {
  shortHours: [
    shortHours: boolean,
    setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>,
  ];
  hoursTime: [
    hoursTime: hourType[],
    setHoursTime: React.Dispatch<React.SetStateAction<hourType[]>>,
    defaultHours: hourType[],
  ];
};

export const SettingsContext = React.createContext<SettingsContextType | null>(
  null,
);

const SettingsProvider: React.FC<{
  defaultHours: hourType[];
  children: React.ReactNode;
}> = ({ defaultHours, children }) => {
  const [shortHours, setIsShortHours] = React.useState(
    typeof localStorage !== "undefined"
      ? localStorage?.getItem("shortHours") === "true"
      : false,
  );

  const [hoursTime, setHoursTime] = React.useState<hourType[]>(defaultHours);

  return (
    <SettingsContext.Provider
      value={{
        shortHours: [shortHours, setIsShortHours],
        hoursTime: [hoursTime, setHoursTime, defaultHours],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
