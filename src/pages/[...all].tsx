import Layout from "@/components/layout";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import fetchTimetable from "@/lib/fetchers/fetchTimetable";
import fetchTimetableList from "@/lib/fetchers/fetchTimetableList";
import { Table, TimeTableData } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

const MainRoute: NextPage<Table> = ({ ...props }) => {
  return <Layout props={props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, ok } = await fetchTimetableList();

  if (!ok) {
    return {
      paths: [],
      fallback: "blocking",
    };
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

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context?.params) return { props: {} };

  const { data: timeTable, ok } = await fetchTimetable(context);

  const {
    data: { classes = [], teachers = [], rooms = [] },
  } = (await fetchTimetableList()) as { data: List };

  const props: Table = {
    status: ok,
    timeTable: timeTable ?? ({} as TimeTableData),
    timeTableList: {
      classes,
      teachers,
      rooms,
    },
    substitutions: await fetchSubstitutions(),
  };

  return {
    props,
    revalidate: 3600,
  };
};

export default MainRoute;
