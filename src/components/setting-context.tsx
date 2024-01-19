import React from "react";

export type SettingsContextType = {
  shortHours: [
    shortHours: boolean,
    setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>,
  ];
};

export const SettingsContext = React.createContext<SettingsContextType | null>(
  null,
);

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shortHours, setIsShortHours] = React.useState(
    typeof localStorage !== "undefined"
      ? localStorage?.getItem("shortHours") === "true"
      : false,
  );

  return (
    <SettingsContext.Provider
      value={{ shortHours: [shortHours, setIsShortHours] }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
