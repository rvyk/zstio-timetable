import Controller from "@/components/controller";
import { Topbar } from "@/components/topbar";
import { fetchOptivumList } from "@/lib/fetchers/optivum-list";
import { fetchOptivumTimetable } from "@/lib/fetchers/optivum-timetable";
import { OptivumTimetable } from "@/types/optivum";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 3600;

export const generateMetadata = async ({
  params,
}: {
  params: { all: string[] };
}): Promise<{ title: string }> => {
  if (!params.all || params.all.length < 2) {
    return { title: "Wczytywanie..." };
  }

  const [param1, param2] = params.all;
  const timetable = await fetchOptivumTimetable(param1, param2);

  return { title: timetable.title };
};

const TimetablePage = async ({ params }: { params: { all: string[] } }) => {
  if (!params?.all) {
    const redirectTo = cookies().get("lastVisited")?.value ?? "/class/1";
    redirect(redirectTo);
  }

  const [param1, param2] = params?.all;

  const timetable: OptivumTimetable = await fetchOptivumTimetable(
    param1,
    param2,
  );

  return (
    <React.Fragment>
      <Controller timetable={timetable} />
      <div className="flex w-full flex-col p-8">
        <Topbar {...{ timetable }} />
        {/* <Timetable /> */}
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
