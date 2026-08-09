"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { OptivumTimetable } from "@/types/optivum";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";

interface TopbarProps {
  timetable?: OptivumTimetable;
  isOffline?: boolean;
  /** Poza planem nie ma czego skracać — np. na ekranie wolnych sal. */
  showLessonSwitcher?: boolean;
}

export const Topbar: FC<TopbarProps> = ({
  timetable,
  isOffline,
  showLessonSwitcher = true,
}) => {
  const isClient = useIsClient();

  const { eyebrow, title } = useMemo(() => {
    if (timetable?.title) {
      return {
        eyebrow: `Rozkład zajęć ${TRANSLATION_DICT[timetable.type]}`,
        title: timetable.title,
      };
    }
    if (isOffline) {
      return { eyebrow: "Tryb offline", title: "Brak połączenia z siecią" };
    }
    return { eyebrow: "Plan lekcji", title: "Nie znaleziono planu zajęć" };
  }, [timetable, isOffline]);

  return (
    <header className="grid gap-3 px-3 pt-3 md:hidden">
      <div className="flex w-full items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-x-2">
          <SchoolLink />
          {showLessonSwitcher && <ShortLessonSwitcherCell />}
        </div>
        <TopbarButtons />
      </div>

      <div className="grid gap-2 max-md:hidden">
        <p className="text-primary/45 text-xs font-medium tracking-[0.08em] uppercase">
          {eyebrow}
        </p>
        <div className="inline-flex items-center gap-x-3">
          <h1 className="text-primary max-w-2xl truncate text-3xl leading-none font-semibold tracking-[-0.03em] text-ellipsis xl:text-[2.5rem]">
            {title}
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
      </div>
    </header>
  );
};

const SchoolLink: FC = () => (
  <Link href={SCHOOL_WEBSITE} aria-label={`Strona szkoły ${SCHOOL_SHORT}`}>
    <Image
      src={school_logo}
      alt=""
      className="aspect-square w-9 active:scale-95"
    />
  </Link>
);
