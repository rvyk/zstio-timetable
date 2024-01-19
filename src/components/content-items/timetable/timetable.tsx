import BottomBar from "@/components/content-items/bottom-bar";
import {
  RenderTimeTable,
  RenderTimeTableMobile,
} from "@/components/content-items/timetable/render-timetable";
import { Table as TableType } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import React, { useEffect, useState } from "react";

interface TimeTableProps {
  timeTable: TableType["timeTable"];
  timeTableList: List;
  substitutions: TableType["substitutions"];
}

const TimeTable: React.FC<TimeTableProps> = ({
  timeTable,
  timeTableList,
  substitutions,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const maxLessons = timeTable.status
    ? Math.max(
        Object.entries(timeTable.data.hours).length,
        ...timeTable.data.lessons.map((day) => day.length),
      )
    : 0;

  useEffect(() => {
    let day = new Date().getDay();
    setSelectedDay(day >= 6 || day == 0 ? 0 : day - 1);
  }, [setSelectedDay]);

  return (
    <div>
      <div className="hidden md:block">
        {timeTable.status && (
          <RenderTimeTable
            {...{
              timeTable,
              maxLessons,
              substitutions,
            }}
          />
        )}
      </div>
      <div className="block md:hidden">
        <RenderTimeTableMobile
          {...{
            timeTable,
            maxLessons,
            selectedDay,
            setSelectedDay,
            substitutions,
          }}
        />

        <BottomBar {...{ timeTable, timeTableList }} />
      </div>
    </div>
  );
};

export default TimeTable;
