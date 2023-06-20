import fetchTimetable from "@/helpers/fetchTimetable";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import Layout from "../components/Layout";
import fetchTimetableList from "@/helpers/fetchTimetableList";
import removeUndefined from "@/helpers/removeUndefined";
import Head from "next/head";
import DropdownRoom from "@/components/Dropdowns/RoomDropdown";
import DropdownTeacher from "@/components/Dropdowns/TeacherDropdown";
import DropdownClass from "@/components/Dropdowns/ClassDropdown";

const MainRoute = ({ timeTable, classes, teachers, rooms }) => {
  const { lessons, hours, generatedDate, title } = timeTable;
  return (
    <>
      <Head>
        <title>ZSTIO - Plan lekcji</title>
        <meta
          name="description"
          content="Plan lekcji ZSTIO w odświeżonym stylu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout
        title={title}
        lessons={lessons}
        hours={hours}
        generatedDate={generatedDate}
      >
        <DropdownRoom rooms={rooms} />
        <DropdownTeacher teachers={teachers} />
        <DropdownClass classes={classes} />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const list = await fetchTimetableList();
  const tableList = new TimetableList(list.data);

  const { classes, teachers, rooms } = tableList.getList();
  const classesPaths = classes?.map((classItem) => `/class/${classItem.value}`);
  const teachersPaths = teachers?.map(
    (teacherItem) => `/teacher/${teacherItem.value}`
  );
  const roomsPaths = rooms?.map((roomItem) => `/room/${roomItem.value}`);

  return {
    paths: [...classesPaths, ...teachersPaths, ...roomsPaths],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  let id = "";
  let timeTableData = null;
  if (context.params?.all) {
    if (context.params.all[0] === "class") id = `o${context.params.all[1]}`;
    if (context.params.all[0] === "teacher") id = `n${context.params.all[1]}`;
    if (context.params.all[0] === "room") id = `s${context.params.all[1]}`;
  }

  const response = await fetchTimetable(id);
  timeTableData = response.data;

  const timetableList = new Table(timeTableData);
  const timeTable = {
    lessons: timetableList.getDays(),
    hours: timetableList.getHours(),
    generatedDate: timetableList.getGeneratedDate(),
    title: timetableList.getTitle(),
  };

  const list = await fetchTimetableList();
  const tableList = new TimetableList(list.data);
  const { classes, teachers, rooms } = tableList.getList();
  return {
    props: {
      timeTable: removeUndefined(timeTable),
      classes,
      teachers,
      rooms,
    },
    revalidate: 12 * 3600,
  };
}

export default MainRoute;
