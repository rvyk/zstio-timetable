"use client";

import { useSettingsWithoutStore } from "@/stores/settings-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { OptivumTimetable } from "@/types/optivum";
import { List } from "@majusss/timetable-parser";
import { setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const Controller = ({ timetable }: { timetable: OptivumTimetable }) => {
  const setTimetable = useTimetableStore((state) => state.setTimetable);
  const toggleFullscreenMode = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );
  const pathname = usePathname();
  const router = useRouter();

  const navigateTo = (link: string) => {
    router.push(link);
    setCookie("lastVisited", link, {
      path: "/",
    });
  };

  const handleArrowKey = useCallback(
    (timeTableList: List, key: string) => {
      const data = pathname.split("/")[1];
      const currentNumber = parseInt(pathname.split("/").pop() || "0");

      if (!data || isNaN(currentNumber)) return;

      const changeTo =
        key === "ArrowRight"
          ? currentNumber + 1
          : key === "ArrowLeft"
            ? currentNumber - 1
            : null;

      if (changeTo === null) return;

      const dataToPropertyMap: Record<string, keyof List> = {
        class: "classes",
        room: "rooms",
        teacher: "teachers",
      };

      const propertyName = dataToPropertyMap[data];
      if (!propertyName) return;

      const maxNumber = timeTableList[propertyName]?.length || 0;

      if (changeTo >= 1 && changeTo <= maxNumber) {
        navigateTo(`/${data}/${changeTo}`);
      } else if (changeTo < 1) {
        switch (data) {
          case "class":
            if (timeTableList?.rooms)
              navigateTo(`/room/${timeTableList.rooms.length}`);
            break;
          case "teacher":
            navigateTo(`/class/${timeTableList.classes.length}`);
            break;
          case "room":
            if (timeTableList?.teachers)
              navigateTo(`/teacher/${timeTableList.teachers.length}`);
            break;
        }
      } else if (changeTo > maxNumber) {
        switch (data) {
          case "class":
            if (timeTableList?.teachers) navigateTo("/teacher/1");
            break;
          case "teacher":
            if (timeTableList.rooms) navigateTo("/room/1");
            break;
          case "room":
            navigateTo("/class/1");
            break;
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router],
  );

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        handleArrowKey(
          timetable?.list || {
            classes: [],
          },
          e.key,
        );
      }

      if (["F11", "f"].includes(e.key)) {
        e.preventDefault();
        toggleFullscreenMode();
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleArrowKey, timetable?.list, toggleFullscreenMode]);

  useEffect(() => {
    setTimetable(timetable);
  }, [timetable, setTimetable]);

  return null;
};

export default Controller;
