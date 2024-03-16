"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React from "react";
import { FaMoon as Moon, FaSun as Sun } from "react-icons/fa6";

const ModeToggle = React.forwardRef<HTMLButtonElement>((props, ref) => {
    const { setTheme, theme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button variant="ghost" size="icon" ref={ref} onClick={toggleTheme} {...props}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
});

ModeToggle.displayName = "Theme";

export default ModeToggle;
