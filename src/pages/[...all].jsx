import fetchTimetable from "@/helpers/fetchTimetable";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import Layout from "../components/Layout";
import fetchTimetableList from "@/helpers/fetchTimetableList";
import removeUndefined from "@/helpers/removeUndefined";
import { useEffect } from "react";

const MainRoute = (props) => {
  useEffect(() => {
    if (!props.timeTable) {
      window.location.reload();
    }
  }, [props.timeTable]);
  return <Layout {...props} />;
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
  let status = false;
  let id = "";
  let timeTableData = null;
  let text;
  if (context.params?.all) {
    if (context.params.all[0] === "class") {
      id = `o${context.params.all[1]}`;
      text = "Oddziały";
    }
    if (context.params.all[0] === "teacher") {
      id = `n${context.params.all[1]}`;
      text = "Nauczyciele";
    }
    if (context.params.all[0] === "room") {
      id = `s${context.params.all[1]}`;
      text = "Sale";
    }
  }

  const response = await fetchTimetable(id);
  timeTableData = response.data;
  status = response.ok;
  const timetableList = new Table(timeTableData);
  const timeTable = {
    lessons: timetableList.getDays(),
    hours: timetableList.getHours(),
    generatedDate: timetableList.getGeneratedDate(),
    title: timetableList.getTitle(),
    validDate: timetableList.getValidFromDate(),
  };

  const list = await fetchTimetableList();
  const tableList = new TimetableList(list.data);
  const { classes, teachers, rooms } = tableList.getList();

  let siteTitle = `${text} / ${timeTable.title}`;
  return {
    props: {
      timeTable: removeUndefined(timeTable),
      classes,
      teachers,
      rooms,
      status,
      text,
      siteTitle,
    },
    revalidate: 3600,
  };
}

export default MainRoute;
