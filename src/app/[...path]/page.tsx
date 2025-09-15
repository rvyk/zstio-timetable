import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { BottomBar } from "@/components/common/BottomBar";
import { FreeRoomsResultModal } from "@/components/modals/FreeRoomsResult";
import { FreeRoomsSearchModal } from "@/components/modals/FreeRoomsSearch";
import { ShortenedLessonsCalculatorModal } from "@/components/modals/ShortenedLessonsCalculator";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableController } from "@/components/timetable/TimetableController";
import { Topbar } from "@/components/topbar/Topbar";
import { DATA_SOURCE_COOKIE_NAME } from "@/lib/dataSource";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import type { Metadata } from "next";
import type { OptivumTimetable } from "@/types/optivum";

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
  params: PageParams;
}): Promise<Metadata> => {
  const [type, value] = params.path ?? [];

  if (!isTimetableType(type) || !value) {
    return { title: "" };
  }

  const timetable = await getOptivumTimetable(type, value);

  return { title: timetable.title };
};

const TimetablePage = async ({ params }: { params: PageParams }) => {
  const [type, value] = params.path ?? [];

  if (!isTimetableType(type) || !value) {
    notFound();
  }

  const cookieStore = cookies();
  const requestedDataSource = cookieStore.get(DATA_SOURCE_COOKIE_NAME)?.value;

  const timetable = await getOptivumTimetable(
    type,
    value,
    requestedDataSource,
  );

  return (
    <Fragment>
      <TimetableController timetable={timetable} />
      <div className="flex h-full w-full flex-col gap-y-3 max-md:overflow-y-auto md:gap-y-6 md:overflow-hidden md:p-8">
        <Topbar timetable={timetable} />
        <Timetable timetable={timetable} />
        <BottomBar timetable={timetable} />
      </div>
      <FreeRoomsSearchModal />
      <FreeRoomsResultModal />
      <ShortenedLessonsCalculatorModal />
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
