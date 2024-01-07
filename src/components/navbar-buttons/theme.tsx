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
        <SunIcon className="w-4 h-4 transition-none" />
      ) : (
        <MoonIcon className="w-4 h-4 transition-none" />
      )}
    </ButtonWrapper>
  );
};

export default ThemeButton;
