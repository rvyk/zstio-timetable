import React from "react";
import Content from "../components/Content";
import DropdownClass from "../components/Dropdowns/ClassDropdown";
import DropdownRoom from "../components/Dropdowns/RoomDropdown";
import DropdownTeacher from "../components/Dropdowns/TeacherDropdown";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import ThemeChanger from "../components/ThemeChanger";
import Head from "next/head";

function Layout({ title, lessons, hours, generatedDate }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Plan lekcji ZSTIO w odświeżonym stylu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
        <ThemeChanger />
        <Jumbotron title={title} />
        <Content
          lessons={lessons}
          hours={hours}
          generatedDate={generatedDate}
        />
        <DropdownRoom />
        <DropdownTeacher />
        <DropdownClass />
        <Footer />
      </div>
    </>
  );
}

export default Layout;
