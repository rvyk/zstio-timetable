"use client";

import React, { useState } from "react";
import BottomBar from "./TimetableSmall/BottomBar";
import RenderTimetable from "./TimetableSmall/RenderTimetable";
import RenderNavbar from "./TimetableSmall/RenderNavbar";

function TimetableSmall({ handleKey, ...props }) {
  const [isShortHours, setIsShortHours] = useState(false);
  let {
    timeTable: { hours, lessons },
  } = props;

  return (
    <div className="flex flex-col min-w-full min-h-full dark:bg-[#202020]">
      <RenderNavbar
        isShortHours={isShortHours}
        setIsShortHours={setIsShortHours}
      />

      <RenderTimetable
        hours={hours}
        lessons={lessons}
        isShortHours={isShortHours}
        suppressHydrationWarning
      />

      <BottomBar handleKey={handleKey} {...props} />
    </div>
  );
}

export default TimetableSmall;
