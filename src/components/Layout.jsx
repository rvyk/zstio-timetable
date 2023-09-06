import React, { useEffect, useState } from "react";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import Navbar from "./Navbar";
import { initFlowbite } from "flowbite";
import DropdownRoom from "./Dropdowns/RoomDropdown";
import DropdownTeacher from "./Dropdowns/TeacherDropdown";
import DropdownClass from "./Dropdowns/ClassDropdown";
import Head from "next/head";

function Layout(props) {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <>
      <Head>
        <title>
          ZSTiO - Plan lekcji |{" "}
          {props?.timeTable ? props?.timeTable?.title : "Wczytywanie planu..."}
        </title>
        <meta
          property="og:title"
          content={`Sprawdź plan lekcji ${props?.siteTitle} | ZSTiO`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
        <Navbar />
        <Jumbotron {...props} />
        <Content {...props} />
        <DropdownRoom rooms={props.rooms} />
        <DropdownTeacher teachers={props.teachers} />
        <DropdownClass classes={props.classes} />
        <Footer />
      </div>
    </>
  );
}

export default Layout;
