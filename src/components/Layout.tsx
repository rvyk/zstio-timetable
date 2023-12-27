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
import Snow from "./SnowEasteregg";
import Message from "./Message";

const Footer = dynamic(() => import("./Footer"));

function Layout({ handleKey, ...props }) {
  const [isShortHours, setIsShortHours] = useState(false);
  const [isSnowing, setIsSnowing] = useState(false);

  const [searchDialog, setSearchDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("shortHours")) return;
    const storedShortHours = JSON.parse(localStorage.getItem("shortHours"));
    if (storedShortHours !== null) {
      setIsShortHours(storedShortHours);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("isSnowing")) return;
    const storedIsSnowing = JSON.parse(localStorage.getItem("isSnowing"));
    if (storedIsSnowing !== null) {
      setIsSnowing(storedIsSnowing);
    }
  }, []);

  let {
    rooms = [],
    teachers = [],
    classes = [],
    text = "",
    siteTitle = "",
    timeTable: { title = "" } = {},
  } = props;

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <>
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
        <title>{`${siteTitle} ${siteTitle && "|"} ZSTiO - Plan lekcji`}</title>
        <meta
          property="og:title"
          content={`${siteTitle} ${siteTitle && "|"} ZSTiO - Plan lekcji`}
        />
      </Head>
      <div className="min-h-screen w-screen flex flex-col lg:justify-center lg:items-center lg:bg-[#F7F3F5] bg-[#fff] dark:bg-[#202020] lg:dark:bg-[#171717] transition-all">
        <div className="flex justify-center lg:hidden w-full">
          <TimetableSmall
            {...props}
            setSearchDialog={setSearchDialog}
            searchDialog={searchDialog}
            handleKey={handleKey}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
          />
        </div>
        <div className="hidden justify-center lg:flex flex-col w-full items-center">
          <Snow isSnowing={isSnowing} />
          <Message />
          <Navbar
            inTimetable={true}
            searchDialog={searchDialog}
            setSearchDialog={setSearchDialog}
            isSnowing={isSnowing}
            setIsSnowing={setIsSnowing}
          />
          <JumbotronLarge {...props} />
          <TimetableLarge
            {...props}
            isShortHours={isShortHours}
            setIsShortHours={setIsShortHours}
          />
          <Footer />
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
