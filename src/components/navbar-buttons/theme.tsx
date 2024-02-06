import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ThemeButtonProps {
  toggleTheme: () => void;
  resolvedTheme: string;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  toggleTheme,
  resolvedTheme,
}) => {
  return (
    <ButtonWrapper tooltipText="Zmień motyw" onClick={toggleTheme}>
      {resolvedTheme === "light" ? (
        <SunIcon className="h-4 w-4 transition-none" />
      ) : (
        <MoonIcon className="h-4 w-4 transition-none" />
      )}
    </ButtonWrapper>
  );
};

export default ThemeButton;
