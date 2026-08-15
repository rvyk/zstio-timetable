"use client";

import { getCalendar } from "@/lib/calendar";
import { DialogDescription, DialogTitle } from "@/components/ui/Dialog";
import { usePwa } from "@/hooks/usePWA";
import { showErrorToast } from "@/hooks/useToast";
import { downloadFile } from "@/lib/downloadFile";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { LucideIcon } from "lucide-react";
import {
  BellIcon,
  CalendarArrowDownIcon,
  DownloadIcon,
  PrinterIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useIsClient } from "usehooks-ts";

type SettingsItem = {
  key: string;
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  onClick?: () => void;
  href?: string;
  hidden?: boolean;
  active?: boolean;
};

const SettingButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  href,
  active,
  index = 0,
}: Omit<SettingsItem, "key" | "hidden"> & { index?: number }) => {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener" : undefined}
      onClick={onClick}
      style={{ animationDelay: `${60 + index * 35}ms` }}
      className={cn(
        "group animate-rise flex w-full gap-3 rounded-md p-2.5 text-left transition duration-150 max-md:min-h-11",
        "hover:bg-primary/4 active:scale-[0.99]",
        active && "bg-primary/4",
      )}
    >
      <Icon
        className="text-primary/45 group-hover:text-accent-table mt-0.5 size-4 shrink-0 transition duration-200 group-hover:scale-110"
        strokeWidth={1.75}
      />
      <div className="grid gap-1">
        <h2 className="text-primary text-[13px] leading-none font-medium tracking-tight">
          {title}
        </h2>
        <div className="text-primary/40 text-[11px] leading-relaxed">
          {description}
        </div>
      </div>
    </Tag>
  );
};

const THEMES = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "Auto" },
] as const;

/**
 * Zmiana motywu jest natychmiastowa. Klasa na `<html>` podmienia się w jednym
 * renderze, a na tę jedną klatkę gasimy przejścia — inaczej setki elementów
 * z `transition-colors` zaczynają przenikać naraz i to widać jako zacięcie.
 * Jedynym wyjątkiem jest pigułka wyboru: patrz `[data-keep-transition]`
 * w globals.css.
 */
const useThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const switchTheme = (value: string) => {
    const root = document.documentElement;
    root.dataset.themeInstant = "";
    flushSync(() => setTheme(value));
    // wymuszony reflow: nowe kolory są policzone, zanim przejścia wrócą,
    // więc nic nie zdąży zacząć się przenikać
    void document.body.offsetHeight;
    delete root.dataset.themeInstant;
  };

  return { theme, switchTheme };
};

const ThemeSetting = () => {
  const { theme, switchTheme } = useThemeSwitch();
  const isClient = useIsClient();
  const active = isClient ? (theme ?? "system") : "system";
  const activeIndex = Math.max(
    0,
    THEMES.findIndex((option) => option.value === active),
  );

  return (
    <div className="grid gap-2 p-2.5">
      <span className="text-primary/40 text-[11px] font-medium tracking-[0.06em] uppercase">
        Motyw
      </span>
      <div className="border-lines bg-accent relative grid grid-cols-3 rounded-lg border p-0.75">
        <span
          aria-hidden
          data-keep-transition
          className="ease-out-quint pointer-events-none absolute inset-y-0.75 left-0.75 flex transition-transform duration-300"
          style={{
            width: `calc((100% - 0.375rem) / 3)`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        >
          <span className="bg-foreground flex-1 rounded-md shadow-(--shadow-soft)" />
        </span>
        {THEMES.map((option) => (
          <button
            key={option.value}
            onClick={() => switchTheme(option.value)}
            aria-pressed={active === option.value}
            className={cn(
              active === option.value
                ? "text-primary"
                : "text-primary/45 hover:text-primary",
              "relative rounded-md py-1.5 text-[11px] font-medium transition-colors",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SettingsList = ({
  onSelect,
  includePrint,
}: {
  onSelect?: () => void;
  includePrint?: boolean;
}) => {
  const router = useRouter();
  const timetable = useTimetableStore((state) => state.timetable);
  const savedSettings = useSettingsStore();
  const [prompt, isInstalled] = usePwa();

  const settings = useMemo<SettingsItem[]>(
    () => [
      {
        key: "install",
        icon: DownloadIcon,
        title: "Zainstaluj aplikację",
        hidden: isInstalled,
        onClick: () => {
          if (prompt) {
            prompt.prompt();
            return;
          }

          showErrorToast(
            "Nie można zainstalować aplikacji",
            "Twoja przeglądarka nie obsługuje tej funkcji",
          );
        },
        description: <p>Szybki dostęp z ekranu głównego, działa offline</p>,
      },
      {
        key: "notifications",
        icon: BellIcon,
        title: "Powiadomienia",
        hidden: true,
        active: savedSettings.isNotificationEnabled,
        onClick: savedSettings.toggleNotification,
        description: <p>Otrzymuj powiadomienia PUSH o nowym planie lekcji</p>,
      },
      {
        key: "calendar",
        icon: CalendarArrowDownIcon,
        title: "Dodaj do kalendarza",
        onClick: async () => {
          if (!timetable?.lessons || timetable.lessons.length === 0) {
            showErrorToast(
              "Nie można wygenerować pliku kalendarza",
              "Brak wydarzeń do wyeksportowania w obecnym planie lekcji",
            );
            return;
          }

          try {
            const calendar = await getCalendar(
              timetable.lessons,
              Object.values(timetable.hours),
            );

            if (calendar.error ?? !calendar.value) {
              console.error(calendar.error);
              showErrorToast(
                "Nie można wygenerować pliku kalendarza",
                calendar.error?.message ?? "Wystąpił nieznany błąd",
              );
              return;
            }

            downloadFile({
              content: calendar.value,
              mimeType: "text/calendar;charset=utf-8",
              fileName: `${timetable.title}.ics`,
            });
          } catch (error) {
            console.error(error);
            showErrorToast(
              "Nie można wygenerować pliku kalendarza",
              "Wystąpił błąd podczas generowania pliku kalendarza",
            );
          }
        },
        description: <p>Pobierz plan {timetable?.title} jako plik .ics</p>,
      },
      {
        key: "print",
        icon: PrinterIcon,
        title: "Drukuj plan",
        hidden: !includePrint,
        href: "/print",
        description: <p>Wersja do druku i zapisu do PDF</p>,
      },
      {
        key: "freeRooms",
        icon: Search,
        title: "Wolne sale",
        hidden: timetable?.list.rooms?.length === 0,
        onClick: () => router.push("/free-rooms"),
        description: <p>Cały tydzień z podziałem na dni i lekcje</p>,
      },
    ],
    [isInstalled, prompt, savedSettings, timetable, router, includePrint],
  );

  const visibleSettings = settings.filter((setting) => !setting.hidden);

  return (
    <div className="grid gap-0.5 p-1">
      {visibleSettings.map(({ key, onClick, ...setting }, index) => (
        <SettingButton
          key={key}
          {...setting}
          index={index}
          onClick={() => {
            onClick?.();
            onSelect?.();
          }}
        />
      ))}
      <hr className="border-lines my-1" />
      <ThemeSetting />
    </div>
  );
};

const useAnchor = (
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  isOpen: boolean,
) => {
  const [anchor, setAnchor] = useState({ top: 64, right: 12 });

  const measure = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOpen, measure]);

  return anchor;
};

export const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const anchor = useAnchor(triggerRef, isOpen);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          ref={triggerRef}
          aria-label="Otwórz dodatkowe funkcje"
          className={cn(
            "border-lines bg-accent text-primary/70 active:bg-primary/5 active:text-primary grid size-11 place-content-center rounded-lg border transition duration-150 active:scale-90",
            "data-[state=open]:text-primary data-[state=open]:bg-foreground data-[state=open]:pointer-events-none data-[state=open]:relative data-[state=open]:z-60",
          )}
        >
          <SlidersHorizontal className="size-4.5" strokeWidth={2} />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out fixed inset-0 z-50 bg-black/45 backdrop-blur-xs md:hidden" />
        <DialogPrimitive.Content
          ref={contentRef}
          tabIndex={-1}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            contentRef.current?.focus();
          }}
          style={{ top: anchor.top, right: anchor.right }}
          className="border-lines bg-foreground data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out fixed z-50 grid max-h-[calc(100dvh-6rem)] w-[min(19rem,calc(100vw-4rem))] origin-top-right gap-4 overflow-y-auto rounded-xl border p-4 shadow-(--shadow-raised) md:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>Dodatkowe funkcje</DialogTitle>
            <DialogDescription>
              Instalacja aplikacji, eksport do kalendarza, druk, wolne sale i
              wybór motywu.
            </DialogDescription>
          </VisuallyHidden>

          <div className="-mx-1.5">
            <SettingsList onSelect={() => setIsOpen(false)} includePrint />
          </div>

          <p className="border-lines text-primary/35 border-t pt-3 text-center text-[11px] leading-relaxed">
            © 2024 Made with ❤️ for ZSTiO by <br /> Szymański Paweł & Majcher
            Kacper <br />
            <Link
              className="hover:text-primary underline underline-offset-2 transition-colors"
              target="_blank"
              href="https://github.com/rvyk/zstio-timetable"
            >
              GitHub (GPLv3)
            </Link>
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
