"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { TimetableDates } from "@/components/common/TimetableDates";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { OptivumTimetable } from "@/types/optivum";
import { ArrowLeftFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";

interface TopbarProps {
  timetable?: OptivumTimetable;
}

export const Topbar: FC<TopbarProps> = ({ timetable }) => {
  const isClient = useIsClient();

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
    <div className="grid gap-2 max-md:px-3 max-md:pt-3">
      <div className="flex w-full justify-between max-md:items-center">
        <div className="flex gap-x-2 max-md:items-center">
          <SchoolLink />
          <div className="md:hidden">
            <ShortLessonSwitcherCell />
          </div>
        </div>
        <TopbarButtons />
      </div>
      <div className="grid gap-1.5 max-md:hidden">
        <div className="inline-flex items-center gap-x-4">
          <h1 className="max-w-2xl truncate text-ellipsis text-3xl font-semibold leading-tight text-primary/90 xl:text-4.2xl">
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
    <div className="inline-flex items-center gap-x-2 text-primary/70 transition-colors group-hover:text-primary/90 max-md:hidden">
      <ArrowLeftFromLine size={20} strokeWidth={2.5} />
      <p className="text-sm font-medium xl:text-base">Wróć na stronę szkoły</p>
    </div>
  </Link>
);

