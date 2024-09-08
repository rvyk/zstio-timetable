"use client";

import { useTimetableStore } from "@/hooks/useTimetable";
import { cn } from "@/lib/utils";
import logo_zstio from "@/resources/logo-zstio.png";
import {
  ArrowLeftFromLine,
  Menu,
  MoonIcon,
  Repeat2,
  StarIcon,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";
import { Button } from "./ui/button";

export const Topbar: React.FC = () => {
  const timetable = useTimetableStore((state) => state.timetable);

  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-3">
        <Link
          href="https://zstiojar.edu.pl"
          className="group inline-flex w-fit items-center gap-x-4"
        >
          <Image
            src={logo_zstio}
            alt="Logo szkoły ZSTiO"
            className="aspect-square w-10"
          />
          <div className="inline-flex gap-x-2 text-primary/70 transition-colors group-hover:text-primary/90">
            <ArrowLeftFromLine size={20} strokeWidth={2.5} />
            <p className="text-base font-medium">Wróć na stronę szkoły</p>
          </div>
        </Link>
        <div className="grid">
          <div className="inline-flex items-center gap-x-4">
            <h1 className="text-4.2xl font-semibold text-primary dark:text-primary/90">
              Plan oddziału {timetable?.title}
            </h1>
            <StarIcon size={24} strokeWidth={2.5} className="stroke-star" />
          </div>
          <p className="text-base font-medium text-primary/70">
            Wygenerowano:{" "}
            <span className="font-semibold text-primary/90">2024-09-02</span>,
            Obowiązuje od:{" "}
            <span className="font-semibold text-primary/90">2024-09-02</span>
          </p>
        </div>
      </div>
      <TopbarButtons />
    </div>
  );
};

const TopbarButtons: React.FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const isClient = useIsClient();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const buttons = [
    {
      icon: theme === "dark" && isClient ? SunMedium : MoonIcon,
      href: null,
      action: toggleTheme,
      show: resolvedTheme || !isClient,
    },
    {
      icon: Repeat2,
      href: "/zastepstwa",
      action: null,
      show: true,
    },
    {
      icon: Menu,
      href: null,
      action: () => {},
      show: true,
    },
  ];

  return (
    <div className="inline-flex gap-2.5">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="icon"
          size="icon"
          className={cn(!button.show && "hidden")}
          onClick={button.action ?? (() => {})}
          asChild={button.href !== null}
        >
          {button.href !== null ? (
            <Link href={button.href}>
              <button.icon size={20} strokeWidth={2.5} />
            </Link>
          ) : (
            <button.icon size={20} strokeWidth={2.5} />
          )}
        </Button>
      ))}
    </div>
  );
};
