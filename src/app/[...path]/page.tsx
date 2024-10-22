import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { BottomBar } from "@/components/common/BottomBar";
import { FreeRoomsResultModal } from "@/components/modals/FreeRoomsResult";
import { FreeRoomsSearchModal } from "@/components/modals/FreeRoomsSearch";
import { ShortenedLessonsCalculatorModal } from "@/components/modals/ShortenedLessonsCalculator";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableController } from "@/components/timetable/TimetableController";
import { Topbar } from "@/components/topbar/Topbar";
import { Fragment } from "react";

interface PageParams {
  path?: string[];
}

export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}) => {
  const params = await props.params;
  const [type, value] = params.path ?? [];

  if (!type || !value) {
    return { title: "" };
  }

  const timetable = await getOptivumTimetable(type, value);

  return { title: timetable.title };
};

const TimetablePage = async (props: { params: Promise<PageParams> }) => {
  const params = await props.params;
  const [type, value] = params.path ?? [];

  const timetable = await getOptivumTimetable(type, value);

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
