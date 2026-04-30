"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { TimetableDates } from "@/components/common/TimetableDates";
import { SidebarContent } from "@/components/sidebar/Sidebar";
import SidebarContext from "@/components/sidebar/Context";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { OptivumTimetable } from "@/types/optivum";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";

interface TopbarProps {
  timetable?: OptivumTimetable;
  isOffline?: boolean;
}

export const Topbar: FC<TopbarProps> = ({ timetable, isOffline }) => {
  const isClient = useIsClient();

  const titleElement = useMemo(() => {
    if (timetable?.title) {
      return (
        <Fragment>
          Rozkład zajęć {TRANSLATION_DICT[timetable.type]}{" "}
          <span className="font-semibold">{timetable.title}</span>
        </Fragment>
      );
    } else if (isOffline) {
      return "Brak połączenia z siecią";
    } else {
      return "Nie znaleziono planu zajęć";
    }
  }, [timetable, isOffline]);

  return (
    <div className="grid gap-4 max-md:px-3 max-md:pt-3">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-x-2">
          <SchoolLink />
          <div className="md:hidden">
            <ShortLessonSwitcherCell />
          </div>
        </div>
        <TopbarButtons />
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
      <div className="hidden md:block xl:hidden">
        <SidebarContext.Provider value={{ isPreview: false }}>
          <SidebarContent showTimetableDates={false} layout="horizontal" showInfo={false} />
        </SidebarContext.Provider>
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
