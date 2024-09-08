"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  GraduationCap,
  LucideIcon,
  MapPin,
  Search,
  StarIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-full max-w-xs border-r border-accent/10 bg-foreground pr-1.5 dark:border-primary/10">
      <div className="mr-3 flex h-full w-full flex-col justify-between space-y-16 overflow-y-auto overflow-x-hidden p-6 pr-3.5">
        <div className="grid gap-9">
          <div className="inline-flex h-12 w-full items-center gap-x-3 rounded-sm border border-accent/10 bg-accent-secondary p-3 dark:border-primary/10">
            <Search className="text-primary/70" size={20} strokeWidth={2.5} />
            <input
              type="text"
              className="w-full bg-transparent text-sm font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none"
              placeholder="Szukaj..."
            />
          </div>
          <SidebarDropdowns />
        </div>
        <p className="text-sm font-semibold text-primary/90">
          Źródło danych <br />
          <Link
            href="https://zstio-elektronika.pl/plan/"
            target="_blank"
            className="text-xs font-medium text-primary/70 underline"
          >
            https://zstio-elektronika.pl/plan/
          </Link>
        </p>
      </div>
    </div>
  );
};

const SidebarDropdowns: React.FC = () => {
  return (
    <div className="grid gap-5">
      <Dropdown title="Ulubione" icon={StarIcon} />
      <hr className="h-px w-full border border-primary/10" />
      <Dropdown title="Oddziały" icon={GraduationCap} />
      <Dropdown title="Nauczyciele" icon={Users} />
      <Dropdown title="Sale" icon={MapPin} />
    </div>
  );
};

const Dropdown: React.FC<{
  title: string;
  icon: LucideIcon;
  data?: Array<{
    title: string;
    href: string;
  }>;
}> = ({ title, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!isOpen && ref && ref.current !== null)
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    else if (ref.current !== null) ref.current.style.maxHeight = "0";
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className="group relative w-full cursor-pointer"
      >
        <div
          className={cn(
            isOpen && "!opacity-100",
            "absolute -left-2 -top-1.5 z-10 h-[calc(100%+12px)] w-[calc(100%+16px)] rounded-md bg-accent/90 opacity-0 transition-all group-hover:opacity-100",
          )}
        ></div>
        <div className="relative z-20 inline-flex w-full items-center justify-between">
          <div className="inline-flex items-center gap-x-3.5">
            <div className="grid h-10 w-10 place-content-center rounded-sm border border-primary/10 bg-accent transition-all group-hover:bg-primary/5 group-hover:dark:bg-accent">
              <Icon
                className="text-primary/80 transition-all group-hover:text-primary/90"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-sm font-semibold text-primary/80 group-hover:text-primary/90">
              {title}
            </p>
          </div>
          <ChevronDown
            className={cn(
              isOpen && "rotate-180",
              "text-primary/80 transition-all",
            )}
            size={20}
          />
        </div>
      </button>
      <div
        style={{
          maxHeight: 0,
        }}
        ref={ref}
        className={cn(
          "relative -ml-2 w-[calc(100%+16px)] overflow-hidden transition-[max-height] duration-300",
        )}
      >
        <div className="mt-4 grid gap-2 rounded-md bg-accent/90 p-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <Link
              href="/"
              key={i}
              className="rounded-md border border-transparent py-3 pl-6 pr-3 text-sm font-semibold text-primary transition-all hover:border-primary/5 hover:bg-primary/5 hover:dark:bg-primary/5"
            >
              3TP
            </Link>
          ))}
          <hr className="my-4 h-px w-full border border-accent/10 dark:border-primary/10" />
          <button
            onClick={handleClick}
            className="rounded-md border border-primary/5 bg-primary/5 py-3 text-center text-sm font-semibold text-primary dark:border-primary/10 dark:bg-primary/10"
          >
            Zwiń listę
          </button>
        </div>
      </div>
    </div>
  );
};
