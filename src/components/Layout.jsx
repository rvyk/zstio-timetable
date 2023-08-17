import React, { useEffect, useState } from "react";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import Navbar from "./Navbar";
import { initFlowbite } from "flowbite";

function Layout({
  title,
  lessons,
  hours,
  generatedDate,
  validDate,
  text,
  children,
  status,
}) {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
      <Navbar />
      <Jumbotron title={title} text={text} status={status} />
      <Content
        lessons={lessons}
        hours={hours}
        generatedDate={generatedDate}
        title={title}
        text={text}
        validDate={validDate}
        status={status}
      />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
