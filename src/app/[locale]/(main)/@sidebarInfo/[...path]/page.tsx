import {
  StoredTimetableInfo,
  TimetableInfo,
} from "@/components/sidebar/Sidebar";
import {
  getTimetable,
  isTimetableType,
  timetableStaticParams,
  type TimetableRouteParams,
} from "@/lib/timetableRoute";

const SidebarInfoSlot = async ({
  params,
}: {
  params: Promise<TimetableRouteParams>;
}) => {
  const [type, value] = (await params).path ?? [];

  if (!isTimetableType(type) || !value) {
    return <StoredTimetableInfo showTimetableDates />;
  }

  const timetable = await getTimetable(type, value);

  return <TimetableInfo timetable={timetable} showTimetableDates />;
};

export const generateStaticParams = timetableStaticParams;

export default SidebarInfoSlot;
