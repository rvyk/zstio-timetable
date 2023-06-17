import { useEffect } from "react";
import fetchTimetable from "@/helpers/fetchTimetable";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import Content from "./components/Content";
import DropdownClass from "./components/Dropdowns/ClassDropdown";
import DropdownRoom from "./components/Dropdowns/RoomDropdown";
import DropdownTeacher from "./components/Dropdowns/TeacherDropdown";
import Footer from "./components/Footer";
import Jumbotron from "./components/Jumbotron";
import Layout from "./components/Layout";
import ThemeChanger from "./components/ThemeChanger";
import fetchTimetableList from "@/helpers/fetchTimetableList";

const MainRoute = ({ timeTable }) => {
  const { lessons, hours, generatedDate, title } = timeTable;
  return (
    <Layout>
      <ThemeChanger />
      <Jumbotron title={title} />
      <Content lessons={lessons} hours={hours} generatedDate={generatedDate} />
      <DropdownRoom />
      <DropdownTeacher />
      <DropdownClass />
      <Footer />
    </Layout>
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
  let timeTableResponse = null;
  if (context.params?.all) {
    if (context.params.all[0] === "class") id = `o${context.params.all[1]}`;
    if (context.params.all[0] === "teacher") id = `n${context.params.all[1]}`;
    if (context.params.all[0] === "room") id = `s${context.params.all[1]}`;
  }

  await fetchTimetable(id).then((response) => {
    timeTableResponse = response.data;
  });
  const timetableList = new Table(timeTableResponse);
  const timeTable = {
    lessons: timetableList.getDays(),
    hours: timetableList.getHours(),
    generatedDate: timetableList.getGeneratedDate(),
    title: timetableList.getTitle(),
  };

  return {
    props: {
      timeTable,
    },
    revalidate: 12 * 3600,
  };
}

export default MainRoute;
