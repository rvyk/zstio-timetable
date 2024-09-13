"use client";

import { useTimetableStore } from "@/stores/timetable-store";
import { OptivumTimetable } from "@/types/optivum";
import { List } from "@majusss/timetable-parser";
import { setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const Controller = ({ timetable }: { timetable: OptivumTimetable }) => {
  const setTimetable = useTimetableStore((state) => state.setTimetable);
  const pathname = usePathname();
  const router = useRouter();

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
        const link = `/${data}/${changeTo}`;

        router.push(link, { scroll: false });
        setCookie("lastVisited", link, {
          path: "/",
        });
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // e.preventDefault(); // Prevent scrolling
      handleArrowKey(timetable?.list || { classes: [] }, e.key);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleArrowKey, timetable?.list]);

  useEffect(() => {
    setTimetable(timetable);
  }, [timetable, setTimetable]);

  return null;
};

export default Controller;
