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
import dynamic from "next/dynamic";
import SearchForEmptyRoom from "./SearchForEmptyRoom";
import { getSubstitutions } from "../utils/getter";

const Footer = dynamic(() => import("./Footer"));

function Layout({ handleKey, ...props }) {
  const [isShortHours, setIsShortHours] = useState(false);
  const [substitutions, setSubstitutions] = useState({});
  const [searchDialog, setSearchDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("shortHours")) return;
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
            setSearchDialog={setSearchDialog}
            searchDialog={searchDialog}
            handleKey={handleKey}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
            substitutions={substitutions}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
          />
        </div>
        <div className="hidden justify-center lg:flex flex-col w-full items-center">
          <Navbar
            searchDialog={searchDialog}
            setSearchDialog={setSearchDialog}
          />
          <JumbotronLarge {...props} />
          <TimetableLarge
            {...props}
            substitutions={substitutions}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
          />
          <Footer small={false} />
          <SearchForEmptyRoom
            setSelectedDay={setSelectedDay}
            searchDialog={searchDialog}
            setSearchDialog={setSearchDialog}
          />
        </div>
        <DropdownRoom rooms={rooms} />
        <DropdownTeacher teachers={teachers} />
        <DropdownClass classes={classes} />
      </div>
    </>
  );
}

export default Layout;
