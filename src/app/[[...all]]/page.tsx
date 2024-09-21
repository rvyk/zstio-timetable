import { TimetableController } from "@/components/timetable-controller";
import { Timetable } from "@/components/timetable/timetable";
import { Topbar } from "@/components/topbar/topbar";
import { fetchOptivumList } from "@/lib/fetchers/optivum-list";
import { fetchOptivumTimetable } from "@/lib/fetchers/optivum-timetable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 3600;

export const generateMetadata = async ({
  params,
}: {
  params: { all: [string?, string?] } | Record<string, never>;
}): Promise<{ title: string }> => {
  if (!("all" in params) || !params.all[0] || !params.all[1]) {
    return { title: "" };
  }

  const [param1, param2] = params.all as [string, string];
  const timetable = await fetchOptivumTimetable(param1, param2);

  return { title: timetable.title };
};

const TimetablePage = async ({
  params,
}: {
  params: { all: [string?, string?] } | Record<string, never>;
}) => {
  if (!("all" in params) || !params.all[0] || !params.all[1]) {
    const redirectTo = cookies().get("lastVisited")?.value ?? "/class/1";
    redirect(redirectTo);
  }

  const [param1, param2] = params.all as [string, string];
  const timetable = await fetchOptivumTimetable(param1, param2);

  return (
    <React.Fragment>
      <TimetableController timetable={timetable} />
      <div className="flex h-full w-full flex-col gap-y-6 overflow-hidden p-8">
        <Topbar {...{ timetable }} />
        <Timetable {...{ timetable }} />
      </div>
    </React.Fragment>
  );
};

export async function generateStaticParams() {
  const { classes, rooms, teachers } = await fetchOptivumList();

  return [
    { all: [] },
    ...classes.map((c) => ({ all: ["class", c.value] })),
    ...(rooms ?? []).map((r) => ({ all: ["room", r.value] })),
    ...(teachers ?? []).map((t) => ({ all: ["teacher", t.value] })),
  ];
}

export default TimetablePage;
