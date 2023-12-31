import Substitutions from "@/components/Substitutions";
import fetchTimetable from "@/utils/fetchTimetable";
import fetchTimetableList from "@/utils/fetchTimetableList";
import { getSubstitutionsObject } from "@/utils/getter";
import { convertTextDate, removeUndefined } from "@/utils/helpers";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { GetStaticProps, NextPage } from "next/types";
import { useCallback, useEffect } from "react";
import Layout from "../components/Layout";

const MainRoute: NextPage<props> = ({ ...props }) => {
  const router = useRouter();

  if (router.query.all.toString() === "zastepstwa")
    return <Substitutions {...props} />;

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
    [props, router],
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
    "",
  );

  const {
    data: { classes = [], teachers = [], rooms = [] },
  } = await fetchTimetableList();

  const props: props = {
    status: ok,
    timeTableID: id,
    timeTable,
    classes,
    teachers,
    rooms,
    siteTitle: timeTable?.title,
    text,
    substitutions: await getSubstitutionsObject(),
  };

  return {
    props,
    revalidate: 3600,
  };
};

export default MainRoute;
