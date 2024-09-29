import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { Timetable } from "@/components/timetable/Timetable";
import { TimetableController } from "@/components/timetable/TimetableController";
import { Topbar } from "@/components/topbar/Topbar";

export const dynamic = "force-dynamic";

interface PageParams {
  path?: string[];
}

export const generateMetadata = async ({ params }: { params: PageParams }) => {
  const [type, value] = params.path ?? [];

  if (!type || !value) {
    return { title: "" };
  }

  const timetable = await getOptivumTimetable(type, value);
  return { title: timetable.title };
};

const TimetablePage = async ({ params }: { params: PageParams }) => {
  const [type, value] = params.path ?? [];

  if (!type || !value) {
    const redirectTo = cookies().get("lastVisited")?.value ?? "/class/1";
    redirect(redirectTo);
  }

  const timetable = await getOptivumTimetable(type, value);

  return (
    <Fragment>
      <TimetableController timetable={timetable} />
      <div className="flex h-full w-full flex-col gap-y-6 overflow-hidden p-8">
        <Topbar timetable={timetable} />
        <Timetable timetable={timetable} />
      </div>
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
