import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import fetchTimetableList from "@/utils/fetchTimetableList";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import fetchTimetable from "@/utils/fetchTimetable";
import removeUndefined from "@/utils/removeUndefined";

const MainRoute = (props) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const data = router.query.all[0];
        if (data) {
          const currentNumber = parseInt(router.query.all[1]);
          const changeTo =
            e.key === "ArrowRight" ? currentNumber + 1 : currentNumber - 1;
          const dataToPropertyMap = {
            class: "classes",
            room: "rooms",
            teacher: "teachers",
          };
          const propertyName = dataToPropertyMap[data];
          if (propertyName) {
            const maxNumber = props[propertyName].length;
            if (changeTo >= 1 && changeTo <= maxNumber) {
              router.push(`/${data}/${changeTo}`);
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props, router]);

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
  const { params } = context;
  const param0 = params?.all[0];
  const param1 = params?.all[1];

  let id = "";
  let text = "";

  switch (param0) {
    case "class":
      id = `o${param1}`;
      text = "Oddziały";
      break;
    case "teacher":
      id = `n${param1}`;
      text = "Nauczyciele";
      break;
    case "room":
      id = `s${param1}`;
      text = "Sale";
      break;
  }

  const timetableList = await fetchTimetable(id);
  const timetableListData = new Table(timetableList.data);

  const timeTable = {
    lessons: timetableListData.getDays(),
    hours: timetableListData.getHours(),
    generatedDate: timetableListData.getGeneratedDate(),
    title: timetableListData.getTitle(),
    validDate: timetableListData.getVersionInfo(),
  };

  const list = await fetchTimetableList();
  const tableList = new TimetableList(list.data);
  const { classes, teachers, rooms } = tableList.getList();

  return {
    props: {
      status: timetableList.ok,
      timeTable: removeUndefined(timeTable),
      classes,
      teachers,
      rooms,
      timeTableID: id,
      siteTitle: timeTable.title,
      text,
    },
    revalidate: 3600,
  };
}

export default MainRoute;
