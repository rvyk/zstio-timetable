import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import fetchTimetableList from "@/utils/fetchTimetableList";
import fetchTimetable from "@/utils/fetchTimetable";
import { convertTextDate, removeUndefined } from "@/utils/helpers";
import { GetStaticPaths } from "next";
import { GetStaticProps } from "next/types";

const MainRoute = ({ ...props }) => {
  const router = useRouter();

  const handleKey = useCallback(
    (key: string) => {
      const data = router?.query?.all[0];
      if (data) {
        const currentNumber = parseInt(router.query.all[1]);
        const changeTo =
          key === "ArrowRight" ? currentNumber + 1 : currentNumber - 1;
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
    },
    [props, router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleKey(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props, router, handleKey]);

  useEffect(() => {
    // We use several servers, so we use this console.log to verify connectivity to the servers.
    if (process.env.NEXT_PUBLIC_SERVER_ID) {
      console.log(
        `%cConnected with SERVER #${process.env.NEXT_PUBLIC_SERVER_ID}`,
        "background: lime; color: white; font-size: x-large; text-align: center; border-radius: 15px; margin: 20px 0px 20px 0px; font-weight: bold; padding: 10px; width: full; "
      );
    }
  }, []);

  return <Layout {...props} handleKey={handleKey} />;
};

export const getStaticPaths: GetStaticPaths = async (params) => {
  const { data, ok } = await fetchTimetableList();

  if (!ok) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const { classes, teachers, rooms } = data;

  const paths = [
    ...(classes?.map((classItem) => `/class/${classItem.value}`) || []),
    ...(teachers?.map((teacherItem) => `/teacher/${teacherItem.value}`) || []),
    ...(rooms?.map((roomItem) => `/room/${roomItem.value}`) || []),
  ];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context?.params) return { props: {} };
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

  const { data: timetableListData, ok } = await fetchTimetable(id);

  const timeTable = {
    lessons: timetableListData?.getDays(),
    hours: timetableListData?.getHours(),
    generatedDate: timetableListData?.getGeneratedDate(),
    title: timetableListData?.getTitle(),
    validDate: convertTextDate(timetableListData?.getVersionInfo()),
    days: timetableListData?.getDays(),
  };

  const { data } = await fetchTimetableList();
  const { classes, teachers, rooms } = data;

  const readyTimeTable = removeUndefined(timeTable, "");

  return {
    props: {
      status: ok,
      timeTable: readyTimeTable,
      classes,
      teachers,
      rooms,
      timeTableID: id,
      siteTitle: readyTimeTable?.title,
      text,
    },
    revalidate: 3600,
  };
};

export default MainRoute;
