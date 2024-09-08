import SyncTimetableWithStore from "@/components/sync-timetable-with-store";
import fetchOptivumList from "@/lib/fetchers/optivum-list";
import fetchOptivumTimetable from "@/lib/fetchers/optivum-timetable";
import { OptivumTimetable } from "@/types/optivum";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 3600;

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

  if (!timetable) {
    return <div>No timetable available.</div>;
  }

  return (
    <>
      <SyncTimetableWithStore timetable={timetable} />
      <div></div>
    </>
  );
};

export async function generateStaticParams() {
  const { classes, rooms, teachers } = await fetchOptivumList();

  return [
    ...classes.map((c) => ({ all: ["class", c.value] })),
    ...(rooms ?? []).map((r) => ({ all: ["room", r.value] })),
    ...(teachers ?? []).map((t) => ({ all: ["teacher", t.value] })),
  ];
}

export default TimetablePage;
