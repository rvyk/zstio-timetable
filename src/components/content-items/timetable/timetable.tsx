"use client";

import BottomBar from "@/components/content-items/bottom-bar";
import {
  RenderTimeTable,
  RenderTimeTableMobile,
} from "@/components/content-items/timetable/render-timetable";
import { Table as TableType } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
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

  const pathname = usePathname();
  const router = useRouter();

  const handleArrowKey = useCallback(
    (timeTableList: List, key: string) => {
      const data = pathname.split("/")[1];
      if (data) {
        const currentNumber = parseInt(
          pathname.split("/").slice(-1).join() || "0",
        );
        const changeTo =
          key === "ArrowRight"
            ? currentNumber + 1
            : key === "ArrowLeft"
              ? currentNumber - 1
              : null;
        if (!changeTo) return;
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
            router.push(`/${data}/${changeTo}`, {
              scroll: false,
            });
          }
        }
      }
    },
    [pathname, router],
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
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
      </Head>
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
