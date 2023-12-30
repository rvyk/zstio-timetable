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
}: props & {
  handleKey: (key: string) => void;
  setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>;
  isShortHours: boolean;
  searchDialog: boolean;
  setSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { isReady } = useRouter();

  let {
    timeTable: { hours = [], lessons = [[], [], [], [], []] } = {
      hours: [],
      generatedDate: "",
      title: "",
      validDate: "",
      lessons: [[], [], [], [], []],
    },
  }: props = props;

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
        substitutions={props.substitutions.tables[0]}
      />

      <BottomBar handleKey={handleKey} {...props} />
    </div>
  );
}

export default TimetableSmall;
