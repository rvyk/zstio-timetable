import fetchTimetable from "@/helpers/fetchTimetable";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import Layout from "../components/Layout";
import fetchTimetableList from "@/helpers/fetchTimetableList";
import removeUndefined from "@/helpers/removeUndefined";
import { useEffect } from "react";
import { useRouter } from "next/router";

const MainRoute = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (!props.timeTable) {
      router.reload();
    }
  }, [props.timeTable, router]);

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
  let text = "";
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
  const timeTableObj = {
    lessons: timetableList.getDays(),
    hours: timetableList.getHours(),
    generatedDate: timetableList.getGeneratedDate(),
    title: timetableList.getTitle(),
    validDate: timetableList.getValidFromDate(),
  };

  const list = await fetchTimetableList();
  const tableList = new TimetableList(list.data);
  const { classes, teachers, rooms } = tableList.getList();

  let siteTitle = `${text} / ${timeTableObj.title}`;

  const timeTable = removeUndefined(timeTableObj);

  if (timeTable) {
    return {
      props: {
        timeTable,
        classes,
        teachers,
        rooms,
        status,
        text,
        siteTitle,
        timeTableID: id,
      },
      revalidate: 3600,
    };
  }
}

export default MainRoute;
