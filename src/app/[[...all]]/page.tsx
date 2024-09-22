import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { TimetableController } from "@/components/timetable-controller";
import { Timetable } from "@/components/timetable/timetable";
import { Topbar } from "@/components/topbar/topbar";
import { fetchOptivumList } from "@/lib/fetchers/optivum-list";
import { fetchOptivumTimetable } from "@/lib/fetchers/optivum-timetable";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

interface PageParams {
  all?: string[];
}

export const generateMetadata = async ({ params }: { params: PageParams }) => {
  const [type, value] = params.all ?? [];

  if (!type || !value) {
    return { title: "" };
  }

  const timetable = await fetchOptivumTimetable(type, value);
  return { title: timetable.title };
};

const TimetablePage = async ({ params }: { params: PageParams }) => {
  const [type, value] = params.all ?? [];

  if (!type || !value) {
    const redirectTo = cookies().get("lastVisited")?.value ?? "/class/1";
    redirect(redirectTo);
  }

  const timetable = await fetchOptivumTimetable(type, value);

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
  const { classes, rooms, teachers } = await fetchOptivumList();

  const classParams = classes.map((c) => ({ all: ["class", c.value] }));
  const roomParams = rooms?.map((r) => ({ all: ["room", r.value] })) ?? [];
  const teacherParams =
    teachers?.map((t) => ({ all: ["teacher", t.value] })) ?? [];

  return [...classParams, ...roomParams, ...teacherParams];
}

export default TimetablePage;
