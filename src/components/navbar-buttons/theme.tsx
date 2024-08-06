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
      <SunIcon className="absolute h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
    </ButtonWrapper>
  );
};

export default ThemeButton;
