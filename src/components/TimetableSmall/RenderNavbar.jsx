import React from "react";
import Navbar from "./../Navbar";
import Link from "next/link";
import ShortHours from "../Table/ShortHours";

function RenderNavbar({ isShortHours, setIsShortHours }) {
  return (
    <div className="flex items-center w-full bg-[#F7F3F5] dark:bg-[#3b3b3b]">
      <div className="ml-2 flex justify-center items-center mx-4">
        <Link href={"https://zstiojar.edu.pl"}>
          <img
            alt="logo"
            className="w-16 h-16 mr-4 object-contain"
            src={"/icon-152x152.png"}
          />
        </Link>
      </div>
      <div
        className="inline-flex -mt-1.5 rounded-md shadow-sm mr-2"
        role="group"
      >
        <ShortHours
          setIsShortHours={setIsShortHours}
          isShortHours={isShortHours}
        />
      </div>

      <Navbar />
    </div>
  );
}

export default RenderNavbar;
