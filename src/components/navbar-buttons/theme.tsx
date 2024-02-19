"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import React from "react";

const ThemeButton: React.FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!resolvedTheme) return null;

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
