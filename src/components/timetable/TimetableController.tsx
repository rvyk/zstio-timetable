"use client";

import { setLastVisitedCookie } from "@/lib/utils";
import { useTimetableStore } from "@/stores/timetable";
import { OptivumTimetable } from "@/types/optivum";
import { List } from "@majusss/timetable-parser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const DOUBLE_TAP_DELAY = 300;

export const TimetableController = ({
  timetable,
}: {
  timetable: OptivumTimetable;
}) => {
  const setTimetable = useTimetableStore((state) => state.setTimetable);
  const router = useRouter();

  const navigateTo = useCallback(
    (link: string) => {
      router.push(link);
      setLastVisitedCookie(link);
    },
    [router],
  );

  const handleArrowKey = useCallback(
    (increment: boolean) => {
      const timeTableList = timetable.list;

      const type = timetable.type;
      const currentNumber = timetable.id.slice(1);

      const typePropertyName = {
        class: "classes",
        teacher: "teachers",
        room: "rooms",
      }[type];

      if (!typePropertyName) return;

      const currentIndex = timeTableList[
        typePropertyName as keyof List
      ]?.findIndex((val) => val.value == currentNumber);

      if (currentIndex == undefined) return;

      const nextIndex = increment ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex == timeTableList[typePropertyName as keyof List]?.length) {
        switch (type) {
          case "class":
            navigateTo(`/teacher/${timeTableList.classes[0].value}`);
            break;
          case "teacher":
            if (timeTableList.teachers)
              navigateTo(`/room/${timeTableList.teachers[0].value}`);
            break;
          case "room":
            if (timeTableList.rooms)
              navigateTo(`/class/${timeTableList.rooms[0].value}`);
            break;
        }
        return;
      }

      if (nextIndex == -1) {
        switch (type) {
          case "class":
            if (timeTableList.rooms)
              navigateTo(
                `/room/${timeTableList.rooms[timeTableList.rooms.length - 1].value}`,
              );
            break;
          case "teacher":
            navigateTo(
              `/class/${timeTableList.classes[timeTableList.classes.length - 1].value}`,
            );
            break;
          case "room":
            if (timeTableList.teachers)
              navigateTo(
                `/teacher/${timeTableList.teachers[timeTableList.teachers.length - 1].value}`,
              );
            break;
        }
      }

      const nextValue =
        timeTableList[typePropertyName as keyof List]?.[nextIndex]?.value;

      if (!nextValue) return;

      navigateTo(`/${type}/${nextValue}`);
    },
    [navigateTo, timetable.id, timetable.list, timetable.type],
  );

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        handleArrowKey(e.key == "ArrowRight");
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleArrowKey, timetable.list]);

  const lastTapTimestamp = useRef(0);

  useEffect(() => {
    const handlePointerUp = (event: PointerEvent) => {
      if (!["mouse", "touch"].includes(event.pointerType)) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, label")) {
        lastTapTimestamp.current = Date.now();
        return;
      }

      const now = Date.now();

      if (now - lastTapTimestamp.current < DOUBLE_TAP_DELAY) {
        const isRightSide = event.clientX >= window.innerWidth / 2;
        handleArrowKey(isRightSide);
        lastTapTimestamp.current = 0;
      } else {
        lastTapTimestamp.current = now;
      }
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [handleArrowKey]);

  useEffect(() => {
    setTimetable(timetable);
  }, [timetable, setTimetable]);

  return null;
};
