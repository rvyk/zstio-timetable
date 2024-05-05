"use client";

import BottomBar from "@/components/content-items/bottom-bar";
import {
  RenderTimeTable,
  RenderTimeTableMobile,
} from "@/components/content-items/timetable/render-timetable";
import { TimetableContext } from "@/components/timetable-provider";
import useBetterMediaQuery from "@/lib/useMediaQueryClient";
import { List } from "@wulkanowy/timetable-parser";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import SkeletonLoading from "../skeleton-loading";

const TimeTable = () => {
  const optivumTimetable = useContext(TimetableContext);

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

  const maxLessons =
    Math.max(
      Object.entries(optivumTimetable?.hours || {}).length,
      ...(optivumTimetable?.lessons ?? []).map((day) => day.length),
    ) || 0;

  useEffect(() => {
    const day = new Date().getDay();
    setSelectedDay(day >= 6 || day == 0 ? 0 : day - 1);
  }, [setSelectedDay]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) =>
      handleArrowKey(
        optivumTimetable?.list || {
          classes: [],
        },
        e.key,
      );

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [handleArrowKey, optivumTimetable?.list]);

  const isMobile = useBetterMediaQuery("(max-width: 767.5px)");

  if (!optivumTimetable) return <SkeletonLoading />;

  return (
    <>
      {isMobile ? (
        <>
          <RenderTimeTableMobile
            {...{ maxLessons, selectedDay, setSelectedDay }}
          />
          <BottomBar />
        </>
      ) : (
        <RenderTimeTable maxLessons={maxLessons} />
      )}
    </>
  );
};

export default TimeTable;
