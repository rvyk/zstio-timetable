import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import axios from "axios";

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

export async function getServerSideProps(context) {
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

  const host = context.req.headers.host;
  const protocol = host === "localhost:3000" ? "http" : "https";

  const validateStatus = (status) => status === 200 || status === 404;

  const timeTableReq = await axios.get(
    `${protocol}://${host}/api/timetable/getTimetable?id=${id}`,
    {
      validateStatus,
    }
  );

  const listReq = await axios.get(`${protocol}://${host}/api/timetable/list`, {
    validateStatus,
  });

  const isStatusOK = listReq.status === 200 && timeTableReq.status === 200;
  const { classes, teachers, rooms } = listReq.data;

  if (isStatusOK) {
    return {
      props: {
        status: true,
        timeTable: timeTableReq.data,
        classes,
        teachers,
        rooms,
        timeTableID: id,
        siteTitle: timeTableReq.data.title,
        text,
      },
    };
  }

  return {
    props: {
      status: false,
    },
  };
}

export default MainRoute;
