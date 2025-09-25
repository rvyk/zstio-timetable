"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { TimetableDates } from "@/components/common/TimetableDates";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { cn } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import Image from "next/image";
import Link from "next/link";
import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";

interface TopbarProps {
  timetable?: OptivumTimetable;
}

export const Topbar: FC<TopbarProps> = ({ timetable }) => {
  const isClient = useIsClient();
  const [printTimestamp, setPrintTimestamp] = useState<string>("");
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printMode, setPrintMode] = useState<"week" | "day">("week");
  const selectedDayIndex = useSettingsWithoutStore(
    (state) => state.selectedDayIndex,
  );
  const dayNames = useMemo(() => timetable?.dayNames ?? [], [timetable]);
  const [printDayIndex, setPrintDayIndex] = useState<number>(selectedDayIndex);

  const updatePrintTimestamp = useCallback(() => {
    const formatter = new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "long",
      timeStyle: "short",
    });

    setPrintTimestamp(formatter.format(new Date()));
  }, []);

  const applyPrintPreferences = useCallback(
    (mode: "week" | "day", dayIndex: number) => {
      if (typeof document === "undefined") return;

      document.body.setAttribute("data-print-mode", mode);
      if (mode === "day") {
        document.body.setAttribute("data-print-day", dayIndex.toString());
      } else {
        document.body.removeAttribute("data-print-day");
      }
    },
    [],
  );

  const cleanupPrintPreferences = useCallback(() => {
    if (typeof document === "undefined") return;

    document.body.removeAttribute("data-print-mode");
    document.body.removeAttribute("data-print-day");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    updatePrintTimestamp();

    const handleBeforePrint = () => {
      updatePrintTimestamp();
    };

    const handleAfterPrint = () => {
      cleanupPrintPreferences();
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      cleanupPrintPreferences();
    };
  }, [cleanupPrintPreferences, updatePrintTimestamp]);

  useEffect(() => {
    if (!isPrintDialogOpen) return;

    const maxIndex = Math.max(dayNames.length - 1, 0);
    const safeIndex = Math.min(Math.max(selectedDayIndex, 0), maxIndex);
    setPrintDayIndex(safeIndex);
  }, [dayNames, isPrintDialogOpen, selectedDayIndex]);

  const handleConfirmPrint = useCallback(
    (options?: { mode?: "week" | "day"; dayIndex?: number }) => {
      if (typeof window === "undefined") return;

      const targetMode = options?.mode ?? printMode;
      const targetDay = options?.dayIndex ?? printDayIndex;
      const maxIndex = Math.max(dayNames.length - 1, 0);
      const safeDayIndex = Math.min(Math.max(targetDay, 0), maxIndex);

      applyPrintPreferences(targetMode, safeDayIndex);
      updatePrintTimestamp();
      setIsPrintDialogOpen(false);

      requestAnimationFrame(() => {
        window.print();
      });
    },
    [
      applyPrintPreferences,
      dayNames,
      printDayIndex,
      printMode,
      updatePrintTimestamp,
    ],
  );

  const openPrintDialog = useCallback(() => {
    if (!dayNames.length) {
      handleConfirmPrint({ mode: "week", dayIndex: 0 });
      return;
    }
    setPrintMode("week");
    setIsPrintDialogOpen(true);
  }, [dayNames, handleConfirmPrint]);

  const titleElement = useMemo(() => {
    if (timetable?.title) {
      return (
        <Fragment>
          Rozkład zajęć {TRANSLATION_DICT[timetable.type]}{" "}
          <span className="font-semibold">{timetable.title}</span>
        </Fragment>
      );
    } else {
      return "Nie znaleziono planu zajęć";
    }
  }, [timetable]);

  const printTitle = useMemo(() => {
    if (!timetable?.title) return "Plan lekcji";

    return `Plan lekcji ${TRANSLATION_DICT[timetable.type]} ${timetable.title}`;
  }, [timetable]);

  return (
    <div className="grid gap-2 max-md:px-3 max-md:pt-3 print:gap-4">
      <div className="grid gap-2 print:hidden">
        <div className="flex w-full justify-between max-md:items-center">
          <div className="flex gap-x-2 max-md:items-center">
            <SchoolLink />
            <div className="md:hidden">
              <ShortLessonSwitcherCell />
            </div>
          </div>
          <TopbarButtons onPrint={openPrintDialog} />
        </div>
        <div className="grid gap-1.5 max-md:hidden">
          <div className="inline-flex items-center gap-x-4">
            <h1 className="text-primary/90 xl:text-4.2xl max-w-2xl truncate text-3xl leading-tight font-semibold text-ellipsis">
              {titleElement}
            </h1>
            {timetable?.title && isClient && (
              <FavoriteStar
                item={{
                  name: timetable.title,
                  value: timetable.id.substring(1),
                  type: timetable.type,
                }}
              />
            )}
          </div>
          <TimetableDates timetable={timetable} />
        </div>
      </div>

      <div className="hidden print:flex print:flex-col print:gap-2 print:border-b print:border-black/10 print:pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-black/70">
          {timetable ? `Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}` : "Plan lekcji"}
        </p>
        <h1 className="text-3xl font-semibold text-black">{printTitle}</h1>
        <div className="text-sm text-black/80">
          <TimetableDates timetable={timetable} />
        </div>
        {printTimestamp && (
          <p className="text-sm font-medium text-black/70">
            Data wydruku: <span className="font-semibold text-black">{printTimestamp}</span>
          </p>
        )}
      </div>

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-xl gap-6">
          <DialogHeader>
            <DialogTitle>Drukowanie planu lekcji</DialogTitle>
            <DialogDescription>
              Wybierz zakres wydruku. Plan automatycznie przełączy się w jasny i czytelny motyw drukowania.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <PrintModeOption
                isActive={printMode === "week"}
                onClick={() => setPrintMode("week")}
                title="Cały plan"
                description="Wydrukuj wszystkie dni tygodnia na jednej tabeli."
              />
              <PrintModeOption
                isActive={printMode === "day"}
                onClick={() => setPrintMode("day")}
                title="Wybrany dzień"
                description="Wydrukuj tylko zajęcia z konkretnego dnia."
              />
            </div>

            {printMode === "day" && dayNames.length > 0 && (
              <div className="grid gap-2">
                <p className="text-sm font-medium text-primary/80">
                  Dzień tygodnia
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {dayNames.map((dayName, index) => (
                    <button
                      key={dayName}
                      type="button"
                      onClick={() => setPrintDayIndex(index)}
                      aria-pressed={printDayIndex === index}
                      className={cn(
                        "rounded-lg border border-black/10 px-3 py-2 text-left text-sm font-semibold transition-colors",
                        "hover:border-black/30 hover:bg-black/5",
                        "dark:border-white/15 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/10",
                        printDayIndex === index
                          ? "border-black bg-black/5 text-black dark:border-white dark:bg-white/15 dark:text-white"
                          : "text-black/70",
                      )}
                    >
                      {dayName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="button" onClick={() => handleConfirmPrint()}>
              Drukuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SchoolLink: FC = () => (
  <Link
    href={SCHOOL_WEBSITE}
    className="group inline-flex w-fit items-center gap-x-4"
  >
    <Image
      src={school_logo}
      alt={`Logo szkoły ${SCHOOL_SHORT}`}
      className="aspect-square w-10"
    />
    <p className="text-primary/70 hover:text-primary/90 text-sm font-medium transition-colors max-md:hidden xl:text-base">
      Wróć na stronę szkoły
    </p>
  </Link>
);

interface PrintModeOptionProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

const PrintModeOption: FC<PrintModeOptionProps> = ({
  isActive,
  onClick,
  title,
  description,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    className={cn(
      "rounded-xl border border-black/10 bg-white px-4 py-3 text-left transition-all",
      "hover:border-black/30 hover:shadow-sm",
      "dark:border-white/15 dark:bg-[#111111] dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/10",
      isActive
        ? "border-black bg-black/5 text-black dark:border-white dark:bg-white/15 dark:text-white"
        : "text-black/70",
    )}
  >
    <p className="text-base font-semibold">{title}</p>
    <p className="mt-1 text-sm leading-relaxed text-black/60 dark:text-white/60">
      {description}
    </p>
  </button>
);
