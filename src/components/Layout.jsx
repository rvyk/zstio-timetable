import React, { useEffect, useState } from "react";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import Navbar from "./Navbar";
import { initFlowbite } from "flowbite";
import { useRouter } from "next/router";

function Layout({ title, lessons, hours, generatedDate, children }) {
  useEffect(() => {
    initFlowbite();
  }, []);

  const [text, setText] = useState("");
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query.all && Array.isArray(query.all)) {
      const path = query.all.join("/");
      if (path.includes("class/")) {
        setText("Oddziały");
      } else if (path.includes("teacher/")) {
        setText("Nauczyciele");
      } else if (path.includes("room/")) {
        setText("Sale");
      }
    }
  }, [query.all]);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
      <Navbar />
      <Jumbotron title={title} text={text} />
      <Content
        lessons={lessons}
        hours={hours}
        generatedDate={generatedDate}
        title={title}
        text={text}
      />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
