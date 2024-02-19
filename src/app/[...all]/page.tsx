import Layout from "@/components/layout";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import fetchTimetable from "@/lib/fetchers/fetchTimetable";
import fetchTimetableList from "@/lib/fetchers/fetchTimetableList";
import { Table, TimeTable } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import { NextPage } from "next";

export const revalidate = 3600;

const MainRoute: NextPage<{ params: { all: string[] } }> = async ({
  params,
}) => {
  if (!["class", "teacher", "room", "zastepstwa"].includes(params.all[0]))
    return null;
  const { timeTable } = await fetchTimetable(params.all[0], params.all[1]);

  // console.log(params.all[0], params.all[1], timeTable.data.title);

  const {
    data: { classes = [], teachers = [], rooms = [] },
  } = (await fetchTimetableList()) as { data: List };

  const props: Table = {
    timeTable: timeTable ?? ({} as TimeTable),
    timeTableList: {
      classes,
      teachers,
      rooms,
    },
    substitutions: await fetchSubstitutions(),
  };

  return <Layout props={props} />;
};

export const generateStaticParams = async () => {
  const { data, ok } = await fetchTimetableList();

  if (!ok) {
    return [{ slug: "" }];
  }

  const { classes, teachers, rooms } = data as List;

  const paths = [
    ...(classes?.map(
      (classItem: { value: string }) => `/class/${classItem.value}`,
    ) || []),
    ...(teachers?.map(
      (teacherItem: { value: string }) => `/teacher/${teacherItem.value}`,
    ) || []),
    ...(rooms?.map(
      (roomItem: { value: string }) => `/room/${roomItem.value}`,
    ) || []),
  ];

  return paths.map((slug) => ({ slug }));
};

export default MainRoute;
