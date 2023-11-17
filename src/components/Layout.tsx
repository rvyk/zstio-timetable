import React, { useEffect, useState } from "react";
import TimetableLarge from "./TimetableLarge";
import JumbotronLarge from "./JumbotronLarge";
import Navbar from "./Navbar";
import { initFlowbite } from "flowbite";
import DropdownRoom from "./Dropdowns/RoomDropdown";
import DropdownTeacher from "./Dropdowns/TeacherDropdown";
import DropdownClass from "./Dropdowns/ClassDropdown";
import Head from "next/head";
import TimetableSmall from "./TimetableSmall";
import { getSubstitutions } from "@/utils/getter";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"));

function Layout({ handleKey, ...props }) {
  const [isShortHours, setIsShortHours] = useState(false);
  const [substitutions, setSubstitutions] = useState({});

  useEffect(() => {
    const storedShortHours = JSON.parse(localStorage.getItem("shortHours"));
    if (storedShortHours !== null) {
      setIsShortHours(storedShortHours);
    }
  }, []);

  let {
    rooms,
    teachers,
    classes,
    text,
    siteTitle,
    timeTable: { title },
  } = props;

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    const substitutionsGetter = async () => {
      let substitutions = await getSubstitutions(text, title);
      setSubstitutions(substitutions);
    };

    substitutionsGetter();
  }, [text, title]);

  return (
    <>
      <Head>
        <title>
          {title
            ? `ZSTiO - Plan lekcji | ${title}`
            : "ZSTiO - Plan lekcji | Wczytywanie planu..."}
        </title>
        <meta
          property="og:title"
          content={`Sprawdź plan lekcji ${siteTitle} | ZSTiO`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen w-screen flex flex-col lg:justify-center lg:items-center lg:bg-[#F7F3F5] bg-[#fff] dark:bg-[#202020] lg:dark:bg-[#171717] transition-all">
        <div className="flex justify-center lg:hidden w-full ">
          <TimetableSmall
            {...props}
            handleKey={handleKey}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
            substitutions={substitutions}
          />
        </div>
        <div className="hidden justify-center lg:flex flex-col w-full items-center">
          <Navbar />
          <JumbotronLarge {...props} />
          <TimetableLarge
            {...props}
            substitutions={substitutions}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
          />
          <Footer small={false} />
        </div>
        <DropdownRoom rooms={rooms} />
        <DropdownTeacher teachers={teachers} />
        <DropdownClass classes={classes} />
      </div>
    </>
  );
}

export default Layout;
