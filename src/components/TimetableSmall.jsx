"use client";

import React from "react";
// import BottomBar from "./TimetableSmall/BottomBar";
import RenderTimetable from "./TimetableSmall/RenderTimetable";
import RenderNavbar from "./TimetableSmall/RenderNavbar";
import dynamic from "next/dynamic";

const BottomBar = dynamic(() => import("./TimetableSmall/BottomBar"));

function TimetableSmall({
  handleKey,
  setIsShortHours,
  isShortHours,
  substitutions,
  ...props
}) {
  let {
    timeTable: { hours, lessons },
  } = props;

  return (
    <div className="flex flex-col min-w-full dark:bg-[#202020]">
      <RenderNavbar
        isShortHours={isShortHours}
        setIsShortHours={setIsShortHours}
      />

      <RenderTimetable
        hours={hours}
        lessons={lessons}
        isShortHours={isShortHours}
        substitutions={substitutions}
      />

      <BottomBar handleKey={handleKey} {...props} />
    </div>
  );
}

export default TimetableSmall;
