import fetchTimetable from "@/helpers/fetchTimetable";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import Layout from "../components/Layout";
import fetchTimetableList from "@/helpers/fetchTimetableList";
import removeUndefined from "@/helpers/removeUndefined";
import Head from "next/head";

const MainRoute = ({ timeTable }) => {
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
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-32x32.png"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-192x192.png"
          sizes="192x192"
        ></link>
        <link
          rel="apple-touch-icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-180x180.png"
        ></link>
        <meta
          name="msapplication-TileImage"
          content="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-270x270.png"
        ></meta>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.4/flowbite.min.js"
          async
        ></script>
      </Head>
      <Layout
        title={title}
        lessons={lessons}
        hours={hours}
        generatedDate={generatedDate}
      />
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

  return {
    props: {
      timeTable: removeUndefined(timeTable),
    },
    revalidate: 12 * 3600,
  };
}

export default MainRoute;
