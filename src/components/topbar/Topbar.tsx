"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { translationDict } from "@/constants/translations";
import { OptivumTimetable } from "@/types/optivum";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { ArrowLeftFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./Buttons";
import { SCHOOL_WEBSITE, SCHOOL_SHORT } from "@/constants/school";

interface TopbarProps {
  timetable?: OptivumTimetable;
  substitutions?: SubstitutionsPage;
}

export const Topbar: FC<TopbarProps> = ({ timetable, substitutions }) => {
  const isClient = useIsClient();
  const isSubstitutionsPage = Boolean(substitutions);

  const titleElement = useMemo(() => {
    if (isSubstitutionsPage && substitutions) {
      return substitutions.heading;
    } else if (timetable?.title) {
      return (
        <Fragment>
          Rozkład zajęć {translationDict[timetable.type]}{" "}
          <span className="font-semibold">{timetable.title}</span>
        </Fragment>
      );
    } else {
      return "Nie znaleziono planu zajęć";
    }
  }, [isSubstitutionsPage, substitutions, timetable]);

  return (
    <div className="grid gap-2 max-md:px-3 max-md:pt-3">
      <div className="flex w-full justify-between max-md:items-center">
        <div className="flex gap-x-2 max-md:items-center">
          <SchoolLink />
          {!isSubstitutionsPage && (
            <div className="md:hidden">
              <ShortLessonSwitcherCell />
            </div>
          )}
        </div>
        <TopbarButtons />
      </div>
      <div className="grid gap-1.5 max-md:hidden">
        <div className="inline-flex items-center gap-x-4">
          <h1 className="max-w-2xl truncate text-ellipsis text-3xl font-semibold leading-tight text-primary/90 xl:text-4.2xl">
            {titleElement}
          </h1>
          {timetable?.title && isClient && !isSubstitutionsPage && (
            <FavoriteStar
              item={{
                name: timetable.title,
                value: timetable.id.substring(1),
                type: timetable.type,
              }}
            />
          )}
        </div>
        {isSubstitutionsPage ? (
          substitutions && (
            <p className="text-sm font-medium text-primary/70 xl:text-base">
              {substitutions.timeRange}
            </p>
          )
        ) : (
          <Dates timetable={timetable} />
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
    <div className="inline-flex items-center gap-x-2 text-primary/70 transition-colors group-hover:text-primary/90 max-md:hidden">
      <ArrowLeftFromLine size={20} strokeWidth={2.5} />
      <p className="text-sm font-medium xl:text-base">Wróć na stronę szkoły</p>
    </div>
  </Link>
);

const Dates: FC<{ timetable?: OptivumTimetable }> = ({ timetable }) => {
  const hasNoLessons = useMemo(
    () =>
      timetable?.lessons?.some((innerArray) => innerArray.length === 0) ?? true,
    [timetable?.lessons],
  );

  const dateElements = useMemo(() => {
    if (hasNoLessons || !timetable) return null;

    const elements = [];

    if (timetable.generatedDate && timetable.generatedDate !== "Invalid date") {
      elements.push(
        <Fragment key="generatedDate">
          Wygenerowano:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.generatedDate}
          </span>
        </Fragment>,
      );
    }

    if (timetable.validDate) {
      elements.push(
        <Fragment key="validDate">
          Obowiązuje od:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.validDate}
          </span>
        </Fragment>,
      );
    }

    return elements.reduce<(string | JSX.Element)[]>(
      (acc, curr, index, array) => {
        if (index < array.length - 1) {
          return [...acc, curr, ", "];
        } else {
          return [...acc, curr];
        }
      },
      [],
    );
  }, [hasNoLessons, timetable]);

  if (hasNoLessons) {
    return (
      <p className="text-base font-medium text-primary/50">
        Szukany plan zajęć{" "}
        <span className="font-semibold text-primary/90">({timetable?.id})</span>{" "}
        nie mógł zostać znaleziony.
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-primary/70 xl:text-base">
      {dateElements}
    </p>
  );
};
