import BottomBar from "@/components/content-items/bottom-bar";
import {
  RenderTimeTable,
  RenderTimeTableMobile,
} from "@/components/content-items/timetable/render-timetable";
import { Table as TableType } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

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
  const router = useRouter();

  const handleArrowKey = useCallback(
    (timeTableList: List, key: string) => {
      // if (document.activeElement !== document.body) return;
      const data = router?.query?.all?.[0];
      if (data) {
        const currentNumber = parseInt(router.query.all?.[1] ?? "0");
        const changeTo =
          key === "ArrowRight" ? currentNumber + 1 : currentNumber - 1;
        const dataToPropertyMap: Record<string, string> = {
          class: "classes",
          room: "rooms",
          teacher: "teachers",
        };
        const propertyName = dataToPropertyMap[data];
        if (propertyName) {
          let maxNumber = 0;
          switch (propertyName) {
            case "classes":
              maxNumber = timeTableList.classes.length;
              break;
            case "teachers":
              maxNumber = timeTableList.teachers?.length || 0;
              break;
            case "rooms":
              maxNumber = timeTableList.rooms?.length || 0;
              break;
          }
          if (changeTo >= 1 && changeTo <= maxNumber) {
            router.push(`/${data}/${changeTo}`, undefined, {
              scroll: false,
            });
          }
        }
      }
    },
    [router],
  );

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

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleArrowKey(timeTableList, e.key);

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [timeTableList, handleArrowKey]);

  return (
    <>
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
    </>
  );
};

export default TimeTable;
