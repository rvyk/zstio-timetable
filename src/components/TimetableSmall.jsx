import React, { useState } from "react";
import BottomBar from "./TimetableSmall/BottomBar";
import RenderTimetable from "./TimetableSmall/RenderTimetable";
import RenderNavbar from "./TimetableSmall/RenderNavbar";

function TimetableSmall({ handleKey, ...props }) {
  const [isShortHours, setIsShortHours] = useState(false);
  let {
    status,
    text,
    timeTableID,
    timeTable: { hours, generatedDate, title, validDate, lessons },
  } = props;

  return (
    <div className="flex flex-col min-w-full min-h-full dark:bg-gray-900">
      <RenderNavbar
        isShortHours={isShortHours}
        setIsShortHours={setIsShortHours}
      />

      <RenderTimetable
        hours={hours}
        lessons={lessons}
        isShortHours={isShortHours}
      />

      <BottomBar handleKey={handleKey} text={text} title={title} />
    </div>
  );
}

export default TimetableSmall;
