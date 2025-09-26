"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { TimetableDates } from "@/components/common/TimetableDates";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { TimetablePrintSheet } from "@/components/print/TimetablePrintSheet";
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
import { SHORT_HOURS } from "@/constants/settings";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { cn } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import Image from "next/image";
import Link from "next/link";
import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIsClient } from "usehooks-ts";
import { useReactToPrint } from "react-to-print";
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
  const lessonType = useSettingsStore((state) => state.lessonType);
  const hoursAdjustIndex = useSettingsStore((state) => state.hoursAdjustIndex);
  const dayNames = useMemo(() => timetable?.dayNames ?? [], [timetable]);
  const [printDayIndex, setPrintDayIndex] = useState<number>(selectedDayIndex);
  const [pendingPrintOptions, setPendingPrintOptions] = useState<
    | {
        mode: "week" | "day";
        dayIndex: number;
      }
    | null
  >(null);
  const [printSheetOptions, setPrintSheetOptions] = useState<{
    mode: "week" | "day";
    dayIndex: number;
  }>({
    mode: "week",
    dayIndex: 0,
  });
  const [shouldTriggerPrint, setShouldTriggerPrint] = useState(false);

  const hours = useMemo(() => {
    if (!timetable) return [];

    if (lessonType === "custom") {
      return adjustShortenedLessons(
        hoursAdjustIndex,
        Object.values(timetable.hours),
      );
    }

    if (lessonType === "short") {
      return Object.values(SHORT_HOURS);
    }

    return Object.values(timetable.hours);
  }, [hoursAdjustIndex, lessonType, timetable]);

  const lessons = useMemo(() => timetable?.lessons ?? [], [timetable]);

  const maxLessons = useMemo(() => {
    const lessonCounts = lessons.map((day) => day.length);
    const hourCount = timetable ? Object.keys(timetable.hours).length : 0;
    const adjustedHoursCount = hours.length;

    return Math.max(hourCount, adjustedHoursCount, ...lessonCounts, 0);
  }, [hours, lessons, timetable]);

  const printableHours = useMemo(
    () => hours.slice(0, maxLessons),
    [hours, maxLessons],
  );

  const printTitle = useMemo(() => {
    if (!timetable?.title) return "Plan lekcji";

    return `Plan lekcji ${TRANSLATION_DICT[timetable.type]} ${timetable.title}`;
  }, [timetable]);

  const printSheetRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: printSheetRef,
    documentTitle: printTitle,
    pageStyle: `
      @page { margin: 18mm 14mm; }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        -webkit-print-color-adjust: exact !important;
      }
    `,
  });

  const updatePrintTimestamp = useCallback(() => {
    const formatter = new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "long",
      timeStyle: "short",
    });

    setPrintTimestamp(formatter.format(new Date()));
  }, []);

  useEffect(() => {
    if (!isPrintDialogOpen) return;

    const maxIndex = Math.max(dayNames.length - 1, 0);
    const safeIndex = Math.min(Math.max(selectedDayIndex, 0), maxIndex);
    setPrintDayIndex(safeIndex);
  }, [dayNames, isPrintDialogOpen, selectedDayIndex]);

  const handleConfirmPrint = useCallback(
    (options?: { mode?: "week" | "day"; dayIndex?: number }) => {
      const targetMode = options?.mode ?? printMode;
      const targetDay = options?.dayIndex ?? printDayIndex;
      const maxIndex = Math.max(dayNames.length - 1, 0);
      const safeDayIndex = Math.min(Math.max(targetDay, 0), maxIndex);

      setPendingPrintOptions({ mode: targetMode, dayIndex: safeDayIndex });
      setIsPrintDialogOpen(false);
    },
    [dayNames, printDayIndex, printMode],
  );

  useEffect(() => {
    if (!pendingPrintOptions) return;
    if (isPrintDialogOpen) return;

    setPrintSheetOptions(pendingPrintOptions);
    setPendingPrintOptions(null);
    setShouldTriggerPrint(true);
  }, [isPrintDialogOpen, pendingPrintOptions]);

  useEffect(() => {
    if (!shouldTriggerPrint) return;

    const raf = requestAnimationFrame(() => {
      updatePrintTimestamp();

      handlePrint();

      setShouldTriggerPrint(false);
    });

    return () => cancelAnimationFrame(raf);
  }, [handlePrint, shouldTriggerPrint, updatePrintTimestamp]);

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

      <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-0 z-[-1]">
        <TimetablePrintSheet
          ref={printSheetRef}
          timetable={timetable}
          hours={printableHours}
          lessons={lessons}
          dayNames={dayNames}
          mode={printSheetOptions.mode}
          dayIndex={printSheetOptions.dayIndex}
          printTimestamp={printTimestamp}
        />
      </div>
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
