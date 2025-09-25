"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { TimetableDates } from "@/components/common/TimetableDates";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { OptivumTimetable } from "@/types/optivum";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";

interface TopbarProps {
  timetable?: OptivumTimetable;
}

export const Topbar: FC<TopbarProps> = ({ timetable }) => {
  const isClient = useIsClient();
  const [printTimestamp, setPrintTimestamp] = useState<string>("");

  const updatePrintTimestamp = useCallback(() => {
    const formatter = new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "long",
      timeStyle: "short",
    });

    setPrintTimestamp(formatter.format(new Date()));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    updatePrintTimestamp();

    const handleBeforePrint = () => {
      updatePrintTimestamp();
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [updatePrintTimestamp]);

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") return;

    updatePrintTimestamp();
    requestAnimationFrame(() => {
      window.print();
    });
  }, [updatePrintTimestamp]);

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
          <TopbarButtons onPrint={handlePrint} />
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
