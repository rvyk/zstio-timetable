"use client";

import { getCalendar } from "@/actions/getCalendar";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { usePwa } from "@/hooks/usePWA";
import { showErrorToast } from "@/hooks/useToast";
import { downloadFile } from "@/lib/downloadFile";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { LucideIcon } from "lucide-react";
import {
  BellIcon,
  CalendarArrowDownIcon,
  DownloadIcon,
  Search,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { useIsClient } from "usehooks-ts";

type SettingsItem = {
  key: string;
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  onClick: () => void;
  hidden?: boolean;
  active?: boolean;
};

const SettingButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  active,
}: Omit<SettingsItem, "key" | "hidden">) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full gap-3 rounded-md p-2.5 text-left transition-colors",
        "hover:bg-primary/[0.04] active:scale-[0.99]",
        active && "bg-primary/[0.04]",
      )}
    >
      <Icon
        className="text-primary/35 group-hover:text-accent-table mt-0.5 size-4 shrink-0 transition-colors"
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
    </button>
  );
};

const THEMES = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "Auto" },
] as const;

const ThemeSetting = () => {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const active = isClient ? (theme ?? "system") : "system";

  return (
    <div className="grid gap-2 p-2.5">
      <span className="text-primary/40 text-[11px] font-medium tracking-[0.06em] uppercase">
        Motyw
      </span>
      <div className="border-lines bg-accent grid grid-cols-3 gap-1 rounded-lg border p-[3px]">
        {THEMES.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            aria-pressed={active === option.value}
            className={cn(
              active === option.value
                ? "bg-foreground text-primary shadow-[var(--shadow-soft)]"
                : "text-primary/45 hover:text-primary",
              "rounded-md py-1.5 text-[11px] font-medium transition-colors",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SettingsList = ({ onSelect }: { onSelect?: () => void }) => {
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
        description: (
          <p>
            Zainstaluj plan lekcji jako aplikację PWA, aby uzyskać szybki dostęp
            z ekranu głównego
          </p>
        ),
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
        description: (
          <p>
            Wyeksportuj obecnie przeglądany plan lekcji ({timetable?.title}),
            aby łatwo dodać go do swojego ulubionego kalendarza
          </p>
        ),
      },
      {
        key: "freeRooms",
        icon: Search,
        title: "Wolne sale",
        hidden: timetable?.list.rooms?.length === 0,
        onClick: () => router.push("/sale"),
        description: (
          <p>
            Zobacz wolne sale w całym tygodniu naraz, z podziałem na dni i
            lekcje
          </p>
        ),
      },
    ],
    [isInstalled, prompt, savedSettings, timetable, router],
  );

  const visibleSettings = settings.filter((setting) => !setting.hidden);

  return (
    <div className="grid gap-0.5 p-1">
      {visibleSettings.map(({ key, onClick, ...setting }) => (
        <SettingButton
          key={key}
          {...setting}
          onClick={() => {
            onClick();
            onSelect?.();
          }}
        />
      ))}
      <hr className="border-lines my-1" />
      <ThemeSetting />
    </div>
  );
};

export const SettingsPanel = () => {
  const { toggleSettingsPanel, isSettingsPanelOpen } =
    useSettingsWithoutStore();

  return (
    <Sheet open={isSettingsPanelOpen} onOpenChange={toggleSettingsPanel}>
      <SheetContent className="flex flex-col justify-between gap-y-12 overflow-auto md:hidden">
        <div className="grid gap-5">
          <SheetHeader>
            <SheetTitle>Dodatkowe funkcje</SheetTitle>
            <VisuallyHidden>
              <SheetDescription>
                Panel z dodatkowymi funkcjami planu — umożliwia wyszukiwanie sal
                i zmianę ustawień.
              </SheetDescription>
            </VisuallyHidden>
            <Button
              onClick={toggleSettingsPanel}
              aria-label="Zamknij panel ustawień"
              variant="icon"
              size="icon"
            >
              <XIcon size={18} strokeWidth={2} />
            </Button>
          </SheetHeader>
          <div className="-mx-1.5">
            <SettingsList onSelect={toggleSettingsPanel} />
          </div>
        </div>
        <SheetFooter className="border-lines text-primary/35 border-t pt-5 text-[11px] leading-relaxed">
          © 2024 Made with ❤️ for ZSTiO by <br /> Szymański Paweł & Majcher
          Kacper <br />
          <Link
            className="hover:text-primary underline underline-offset-2 transition-colors"
            target="_blank"
            href="https://github.com/rvyk/zstio-timetable"
          >
            GitHub (GPLv3)
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
