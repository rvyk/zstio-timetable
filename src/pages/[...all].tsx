import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import fetchTimetableList from "@/utils/fetchTimetableList";
import fetchTimetable from "@/utils/fetchTimetable";
import { convertTextDate, removeUndefined } from "@/utils/helpers";
import { GetStaticPaths } from "next";
import { GetStaticProps } from "next/types";
import axios from "axios";
import { load } from "cheerio";
import Zastepstwa from "@/components/Zastepstwa";

const MainRoute = ({ ...props }) => {
  const router = useRouter();

  if (router.query.all.toString() === "zastepstwa") {
    return <Zastepstwa {...props} />;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
              router.push(`/${data}/${changeTo}`, undefined, { scroll: false });
            }
          }
        }
      },
      [props, router]
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    }, [handleKey]);

    return <Layout {...props} handleKey={handleKey} />;
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, ok } = await fetchTimetableList();

  if (!ok) {
    return {
      paths: [],
      fallback: "blocking",
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
    fallback: "blocking",
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

  const timeTable = removeUndefined(
    {
      lessons: timetableListData?.getDays(),
      hours: timetableListData?.getHours(),
      generatedDate: timetableListData?.getGeneratedDate(),
      title: timetableListData?.getTitle(),
      validDate: convertTextDate(timetableListData?.getVersionInfo()),
      days: timetableListData?.getDays(),
    },
    ""
  );

  const { data } = await fetchTimetableList();
  const { classes, teachers, rooms } = data;

  const substitutions = {
    time: "Wystąpił błąd podczas pobierania danych",
    tables: [] as tables[],
  };

  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL);

    const $ = load(response.data);
    substitutions.time = $("h2").text().trim();

    $("table").each((_index, table) => {
      const rows = $(table).find("tr");
      const zastepstwa: substitutions[] = [];

      rows.slice(1).each((_i, row) => {
        const columns = $(row).find("td");
        const [
          lesson,
          teacher,
          branch,
          subject,
          classValue,
          caseValue,
          message,
        ] = columns.map((_index, column) => $(column).text().trim()).get();

        if (lesson) {
          zastepstwa.push({
            lesson,
            teacher,
            branch,
            subject,
            class: classValue,
            case: caseValue,
            message,
          });
        }
      });

      substitutions.tables.push({
        time: rows.first().text().trim(),
        zastepstwa: zastepstwa,
      });
    });
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      status: ok,
      timeTable,
      classes,
      teachers,
      rooms,
      timeTableID: id,
      siteTitle: timeTable?.title,
      text,
      substitutions,
    },
    revalidate: 3600,
  };
};

export default MainRoute;
