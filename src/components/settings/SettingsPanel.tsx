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
import { isOriginalDataSource } from "@/lib/dataSource";
import { downloadFile } from "@/lib/downloadFile";
import { cn } from "@/lib/utils";
import { useDataSourceStore } from "@/stores/dataSource";
import useModalsStore from "@/stores/modals";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  BellIcon,
  CalculatorIcon,
  CalendarArrowDownIcon,
  DownloadIcon,
  Search,
  XIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

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
        "group -m-2 flex gap-4 rounded-md p-2 text-left transition-all",
        "hover:bg-primary/10 dark:hover:bg-primary/10",
        active && "bg-primary/10 dark:font-medium",
      )}
    >
      <div className="grid h-10 min-w-10 place-content-center rounded-sm border border-primary/10 bg-primary/5 text-primary/80">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="grid gap-0.5">
        <h2 className="text-sm font-semibold text-primary/80 sm:text-base">
          {title}
        </h2>
        <div className="text-xs font-medium text-primary/50 sm:text-sm">
          {description}
        </div>
      </div>
    </button>
  );
};

export const SettingsPanel = () => {
  const toggleModal = useModalsStore((state) => state.toggleModal);
  const timetable = useTimetableStore((state) => state.timetable);
  const { selectedDataSource } = useDataSourceStore();
  const { toggleSettingsPanel, isSettingsPanelOpen } =
    useSettingsWithoutStore();
  const savedSettings = useSettingsStore();
  const [prompt, isInstalled] = usePwa();

  const isOriginalSource = isOriginalDataSource(selectedDataSource);

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
        description: (
          <p>Otrzymuj powiadomienia PUSH o nowym planie lekcji</p>
        ),
      },
      {
        key: "calendar",
        icon: CalendarArrowDownIcon,
        title: "Dodaj do kalendarza",
        hidden: !isOriginalSource,
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
        key: "calculator",
        icon: CalculatorIcon,
        title: "Kalkulator skróconych lekcji",
        onClick: () => toggleModal("shortenedLessonsCalculator"),
        description: (
          <p>
            Oblicz, o której godzinie skończysz lekcje na podstawie
            skróconego czasu ich trwania
          </p>
        ),
      },
      {
        key: "freeRooms",
        icon: Search,
        title: "Wyszukaj wolną salę",
        hidden: !isOriginalSource || timetable?.list.rooms?.length === 0,
        onClick: () => toggleModal("freeRoomsSearch"),
        description: (
          <p>
            Znajdź wszystkie wolne sale według numeru lekcji i dnia tygodnia
          </p>
        ),
      },
    ],
    [
      isInstalled,
      prompt,
      savedSettings,
      timetable,
      isOriginalSource,
      toggleModal,
    ],
  );

  const visibleSettings = settings.filter((setting) => !setting.hidden);

  return (
    <Sheet open={isSettingsPanelOpen} onOpenChange={toggleSettingsPanel}>
      <SheetContent className="flex flex-col justify-between gap-y-12 overflow-auto">
        <div className="grid gap-6">
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
              <XIcon size={20} strokeWidth={2.5} />
            </Button>
          </SheetHeader>
          <div className="grid gap-10 py-4">
            {visibleSettings.map(({ key, ...setting }) => (
              <SettingButton key={key} {...setting} />
            ))}
          </div>
        </div>
        <SheetFooter>
          © 2024 Made with ❤️ for ZSTiO by <br /> Szymański Paweł & Majcher
          Kacper <br />
          <Link
            className="underline"
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
