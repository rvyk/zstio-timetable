"use client";

import React from "react";
import RenderTimetable from "./TimetableSmall/RenderTimetable";
import RenderNavbar from "./TimetableSmall/RenderNavbar";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Loading from "./Loading";
import LoadingTable from "./Table/LoadingTable";

const BottomBar = dynamic(() => import("./TimetableSmall/BottomBar"));

function TimetableSmall({
  handleKey,
  setIsShortHours,
  isShortHours,
  substitutions,
  ...props
}) {
  const { isReady } = useRouter();

  let {
    timeTable: { hours, lessons },
  } = props;

  if (!isReady) {
    return <LoadingTable small />;
  }

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
