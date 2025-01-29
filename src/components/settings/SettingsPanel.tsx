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
import useModalsStore from "@/stores/modals";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  BellIcon,
  Blend,
  CalculatorIcon,
  CalendarArrowDownIcon,
  DownloadIcon,
  Repeat2Icon,
  Search,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SettingsPanel = () => {
  const toggleModal = useModalsStore((state) => state.toggleModal);
  const timetable = useTimetableStore((state) => state.timetable);
  const { toggleSettingsPanel, isSettingsPanelOpen } =
    useSettingsWithoutStore();
  const savedSettings = useSettingsStore();
  const [prompt, isInstalled] = usePwa();

  const isSubstitutionPage = ["/substitutions", "/zastepstwa"].includes(
    usePathname(),
  );

  const settings = [
    {
      icon: DownloadIcon,
      title: "Zainstaluj aplikację",
      hidden: isInstalled,
      active: false,
      onClick: () => {
        if (prompt) {
          prompt.prompt();
        } else {
          showErrorToast(
            "Nie można zainstalować aplikacji",
            "Twoja przeglądarka nie obsługuje tej funkcji",
          );
        }
      },
      description: (
        <p>
          Zainstaluj plan lekcji jako aplikację PWA, aby uzyskać szybki dostęp z
          ekranu głównego
        </p>
      ),
    },
    {
      icon: Repeat2Icon,
      title: "Zastępstwa na planie lekcji",
      hidden: isSubstitutionPage || !process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL,
      active: savedSettings.isSubstitutionShown,
      onClick: () => {
        savedSettings.toggleSubstitution();
        if (savedSettings.isShowDiffsEnabled) {
          savedSettings.toggleShowDiffs();
        }
      },
      description: (
        <p>
          Zdecyduj, czy chcesz wyświetlać zastępstwa bezpośrednio na planie
          lekcji
        </p>
      ),
    },
    {
      icon: Blend,
      title: "Porównaj plany lekcji",
      hidden: isSubstitutionPage || !process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL,
      active: savedSettings.isShowDiffsEnabled,
      onClick: () => {
        savedSettings.toggleShowDiffs();
        if (savedSettings.isSubstitutionShown) {
          savedSettings.toggleSubstitution();
        }
      },
      description: (
        <p>
          Porównaj aktualny plan lekcji z nowym planem, aby zobaczyć różnice
        </p>
      ),
    },
    {
      icon: BellIcon,
      title: "Powiadomienia",
      hidden: true,
      active: savedSettings.isNotificationEnabled,
      onClick: savedSettings.toggleNotification,
      description: (
        <p>
          Otrzymuj powiadomienia PUSH o nowym planie lekcji lub o nowych
          zastępstwach
        </p>
      ),
    },
    {
      icon: CalendarArrowDownIcon,
      title: "Dodaj do kalendarza",
      hidden: isSubstitutionPage,
      active: false,
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
            `Wystąpił błąd podczas generowania pliku kalendarza`,
          );
        }
      },
      description: (
        <p>
          Wyeksportuj obecnie przeglądany plan lekcji ({timetable?.title}), aby
          łatwo dodać go do swojego ulubionego kalendarza
        </p>
      ),
    },
    {
      icon: CalculatorIcon,
      title: "Kalkulator skróconych lekcji",
      hidden: isSubstitutionPage,
      active: false,
      onClick: () => toggleModal("shortenedLessonsCalculator"),
      description: (
        <p>
          Oblicz, o której godzinie skończysz lekcje na podstawie skróconego
          czasu ich trwania
        </p>
      ),
    },
    {
      icon: Search,
      title: "Wyszukaj wolną salę",
      hidden: isSubstitutionPage || timetable?.list.rooms?.length === 0,
      active: false,
      onClick: () => toggleModal("freeRoomsSearch"),
      description: (
        <p>Znajdź wszystkie wolne sale, według numeru lekcji i dnia tygodnia</p>
      ),
    },
  ];

  return (
    <Sheet open={isSettingsPanelOpen} onOpenChange={toggleSettingsPanel}>
      <SheetContent className="flex flex-col justify-between gap-y-12 overflow-auto">
        <div className="grid gap-6">
          <SheetHeader>
            <SheetTitle>Dodatkowe funkcje</SheetTitle>
            <VisuallyHidden>
              <SheetDescription>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe,
                sapiente.
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
            {settings.map((setting, index) => {
              if (setting.hidden) return null;
              return (
                <button
                  key={index}
                  onClick={setting.onClick}
                  className={cn(
                    setting.active &&
                      "bg-primary/10 dark:font-medium md:hover:!bg-primary/15",
                    "group -m-2 flex gap-4 rounded-md p-2 text-left transition-all md:hover:bg-primary/10",
                  )}
                >
                  <div className="grid h-10 min-w-10 place-content-center rounded-sm border border-primary/10 bg-primary/5 text-primary/80">
                    <setting.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="grid">
                    <h2 className="text-sm font-semibold text-primary/80 sm:text-base">
                      {setting.title}
                    </h2>
                    <div className="text-xs font-medium text-primary/50 sm:text-sm">
                      {setting.description}
                    </div>
                  </div>
                </button>
              );
            })}
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
