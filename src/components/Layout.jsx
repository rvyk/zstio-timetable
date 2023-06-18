import React, { useEffect } from "react";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import ThemeChanger from "../components/ThemeChanger";

function Layout({ title, lessons, hours, generatedDate, children }) {
  useEffect(() => {
    if (typeof FB !== "undefined") {
      FB.refresh();
    }
  }, []);
  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
      <ThemeChanger />
      <Jumbotron title={title} />
      <Content lessons={lessons} hours={hours} generatedDate={generatedDate} />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
