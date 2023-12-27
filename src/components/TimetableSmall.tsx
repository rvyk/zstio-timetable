import React from "react";
import RenderTimetable from "./TimetableSmall/RenderTimetable";
import RenderNavbar from "./TimetableSmall/RenderNavbar";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import LoadingTable from "./Table/LoadingTable";
import Message from "./Message";

const BottomBar = dynamic(() => import("./TimetableSmall/BottomBar"));

function TimetableSmall({
  handleKey,
  setIsShortHours,
  isShortHours,
  searchDialog,
  setSearchDialog,
  selectedDay,
  setSelectedDay,
  ...props
}) {
  const { isReady } = useRouter();

  let { timeTable: { hours = {}, lessons = [[], [], [], [], []] } = {} } =
    props;

  if (!isReady) {
    return <LoadingTable small={true} />;
  }

  return (
    <div className="flex flex-col min-w-full dark:bg-[#202020]">
      <RenderNavbar
        setSearchDialog={setSearchDialog}
        searchDialog={searchDialog}
        isShortHours={isShortHours}
        setIsShortHours={setIsShortHours}
      />
      <Message />
      <RenderTimetable
        setSelectedDay={setSelectedDay}
        selectedDay={selectedDay}
        hours={hours}
        lessons={lessons}
        isShortHours={isShortHours}
        substitutions={props.substitutions}
      />

      <BottomBar handleKey={handleKey} {...props} />
    </div>
  );
}

export default TimetableSmall;
