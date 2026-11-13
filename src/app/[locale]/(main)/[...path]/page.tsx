import { BottomBar } from "@/components/common/BottomBar";
import { PlanChanges } from "@/components/common/PlanChanges";
import { SchoolNews } from "@/components/common/SchoolNews";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableController } from "@/components/timetable/TimetableController";
import { Topbar } from "@/components/topbar/Topbar";
import { SCHOOL_NAME_ACCUSATIVE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { warsawToday } from "@/lib/dates";
import { pageSeo, siteSeo } from "@/lib/seo";
import {
  getTimetable,
  isTimetableType,
  timetableStaticParams,
  type TimetableRouteParams,
} from "@/lib/timetableRoute";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<TimetableRouteParams>;
}): Promise<Metadata> => {
  const resolvedParams = await params;
  const [type, value] = resolvedParams.path ?? [];

  if (!isTimetableType(type) || !value) {
    return { robots: { index: false, follow: true } };
  }

  const timetable = await getTimetable(type, value);

  if (!timetable.title) {
    return {
      ...siteSeo(`/${type}/${value}`),
      robots: { index: false, follow: true },
    };
  }

  return pageSeo(
    `Plan lekcji ${TRANSLATION_DICT[type]} ${timetable.title}`,
    `Aktualny plan lekcji ${TRANSLATION_DICT[type]} ${timetable.title} w ${SCHOOL_NAME_ACCUSATIVE}. Godziny zajęć, przedmioty, sale i nauczyciele na każdy dzień tygodnia.`,
    `/${type}/${value}`,
  );
};

const TimetablePage = async ({
  params,
}: {
  params: Promise<TimetableRouteParams>;
}) => {
  const resolvedParams = await params;
  const [type, value] = resolvedParams.path ?? [];

  if (!isTimetableType(type) || !value) {
    redirect("/");
  }

  const timetable = await getTimetable(type, value);

  return (
    <Fragment>
      <TimetableController timetable={timetable} />
      <main className="flex h-full w-full min-w-0 flex-1 flex-col gap-y-3 max-md:overflow-y-auto max-md:pb-[calc(4rem+env(safe-area-inset-bottom))] md:gap-y-3 md:overflow-hidden md:p-3">
        <Topbar timetable={timetable} />
        <SchoolNews />
        <PlanChanges timetable={timetable} />
        <Timetable timetable={timetable} renderedOn={warsawToday()} />
        <BottomBar timetable={timetable} />
      </main>
    </Fragment>
  );
};

export const generateStaticParams = timetableStaticParams;

export default TimetablePage;
