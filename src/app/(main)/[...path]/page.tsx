import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { BottomBar } from "@/components/common/BottomBar";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableController } from "@/components/timetable/TimetableController";
import { Topbar } from "@/components/topbar/Topbar";
import { SCHOOL_NAME_ACCUSATIVE } from "@/constants/school";
import { TRANSLATION_DICT } from "@/constants/translations";
import { pageSeo } from "@/lib/seo";
import type { OptivumTimetable } from "@/types/optivum";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

interface PageParams {
  path?: string[];
}

const TIMETABLE_TYPES: readonly OptivumTimetable["type"][] = [
  "class",
  "teacher",
  "room",
] as const;

const isTimetableType = (
  value: string | undefined,
): value is OptivumTimetable["type"] =>
  TIMETABLE_TYPES.includes(value as OptivumTimetable["type"]);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const resolvedParams = await params;
  const [type, value] = resolvedParams.path ?? [];

  if (!isTimetableType(type) || !value) {
    // ta ścieżka i tak przekierowuje — niech nie zostawia po sobie indeksu
    return { robots: { index: false, follow: true } };
  }

  const timetable = await getOptivumTimetable(type, value);

  if (!timetable.title) {
    return { robots: { index: false, follow: true } };
  }

  return pageSeo(
    `Plan lekcji ${TRANSLATION_DICT[type]} ${timetable.title}`,
    `Aktualny plan lekcji ${TRANSLATION_DICT[type]} ${timetable.title} w ${SCHOOL_NAME_ACCUSATIVE}. Godziny zajęć, przedmioty, sale i nauczyciele na każdy dzień tygodnia.`,
    `/${type}/${value}`,
  );
};

const TimetablePage = async ({ params }: { params: Promise<PageParams> }) => {
  const resolvedParams = await params;
  const [type, value] = resolvedParams.path ?? [];

  const cookieStore = await cookies();
  const lastVisited = cookieStore.get("lastVisited")?.value ?? "";

  const validPattern = /^\/(class|teacher|room)\/\d+$/;
  const redirectTo = validPattern.test(lastVisited) ? lastVisited : "/class/1";

  if (!isTimetableType(type) || !value) {
    redirect(redirectTo);
  }

  const timetable = await getOptivumTimetable(type, value);

  return (
    <Fragment>
      <TimetableController timetable={timetable} />
      <main className="flex h-full w-full min-w-0 flex-1 flex-col gap-y-3 max-md:overflow-y-auto max-md:pb-[calc(4rem+env(safe-area-inset-bottom))] md:gap-y-3 md:overflow-hidden md:p-3">
        <Topbar timetable={timetable} />
        <Timetable timetable={timetable} />
        <BottomBar timetable={timetable} />
      </main>
    </Fragment>
  );
};

export async function generateStaticParams() {
  const { classes, rooms, teachers } = await getOptivumList();

  const classParams = classes.map((c) => ({ path: ["class", c.value] }));
  const roomParams = rooms?.map((r) => ({ path: ["room", r.value] })) ?? [];
  const teacherParams =
    teachers?.map((t) => ({ path: ["teacher", t.value] })) ?? [];

  return [...classParams, ...roomParams, ...teacherParams];
}

export default TimetablePage;
