"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePwa } from "@/stores/pwa-hook";
import {
  useSettingsStore,
  useSettingsWithoutStore,
} from "@/stores/settings-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  BellIcon,
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
  const timetable = useTimetableStore((state) => state.timetable);
  const isSubstitutionPage = usePathname() === "/substitutions";
  const { toggleSettingsPanel, isSettingsPanelOpen } =
    useSettingsWithoutStore();
  const savedSettings = useSettingsStore();

  const [prompt, isInstalled] = usePwa();

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
          alert("Nie można zainstalować aplikacji");
        }
      },
      description: (
        <>
          Zainstaluj plan lekcji jako aplikację PWA, aby uzyskać szybki dostęp z
          ekranu głównego
        </>
      ),
    },
    {
      icon: Repeat2Icon,
      title: "Zastępstwa na planie lekcji",
      hidden: isSubstitutionPage,
      active: savedSettings.isSubstitutionShown,
      onClick: savedSettings.toggleSubstitution,
      description: (
        <>
          Zdecyduj, czy chcesz wyświetlać zastępstwa bezpośrednio na planie
          lekcji
        </>
      ),
    },
    {
      icon: BellIcon,
      title: "Powiadomienia",
      hidden: false,
      active: savedSettings.isNotificationEnabled,
      onClick: savedSettings.toggleNotification,
      description: (
        <>
          Otrzymuj powiadomienia PUSH o nowym planie lekcji lub o nowych
          zastępstwach
        </>
      ),
    },
    {
      icon: CalendarArrowDownIcon,
      title: "Dodaj do kalendarza",
      hidden: isSubstitutionPage,
      active: false,
      onClick: () => {},
      description: (
        <>
          Wyeksportuj obecnie przeglądany plan lekcji ({timetable?.title}), aby
          łatwo dodać go do swojego ulubionego kalendarza
        </>
      ),
    },
    {
      icon: CalculatorIcon,
      title: "Kalkulator skróconych lekcji",
      hidden: isSubstitutionPage,
      active: false,
      onClick: () => {},
      description: (
        <>
          Oblicz, o której godzinie skończysz lekcje na podstawie skróconego
          czasu ich trwania
        </>
      ),
    },
    {
      icon: Search,
      title: "Wyszukaj wolną salę",
      hidden: isSubstitutionPage,
      active: false,
      onClick: async () => {
        // console.log(await findEmptyRoom(4, 0));
      },
      description: (
        <>Znajdź wszystkie wolne sale, według numeru lekcji i dnia tygodnia</>
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
                      "bg-primary/10 hover:!bg-primary/15 dark:font-medium",
                    "group -m-2 flex gap-4 rounded-md p-2 text-left transition-all hover:bg-primary/10",
                  )}
                >
                  <div className="grid h-10 min-w-10 place-content-center rounded-sm border border-primary/10 bg-primary/5 text-primary/80">
                    <setting.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="grid">
                    <h2 className="text-base font-semibold text-primary/80">
                      {setting.title}
                    </h2>
                    <p className="text-sm font-medium text-primary/50">
                      {setting.description}
                    </p>
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
