"use client";

import { setLastVisitedCookie } from "@/lib/utils";
import { useTimetableStore } from "@/stores/timetable";
import { OptivumTimetable } from "@/types/optivum";
import { List } from "@majusss/timetable-parser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const DOUBLE_TAP_DELAY = 300;
const MOBILE_VIEW_QUERY = "(max-width: 768px)";

const TYPE_TO_LIST = {
  class: "classes",
  teacher: "teachers",
  room: "rooms",
} as const satisfies Record<OptivumTimetable["type"], keyof List>;

const TYPE_CYCLE = ["class", "teacher", "room"] as const;

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

      const items = timeTableList[TYPE_TO_LIST[type]];
      if (!items) return;

      const currentIndex = items.findIndex((val) => val.value == currentNumber);
      if (currentIndex === -1) return;

      const nextIndex = increment ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0 || nextIndex >= items.length) {
        const step = increment ? 1 : -1;
        const nextType =
          TYPE_CYCLE[
            (TYPE_CYCLE.indexOf(type) + step + TYPE_CYCLE.length) %
              TYPE_CYCLE.length
          ];
        if (!nextType) return;

        const nextItems = timeTableList[TYPE_TO_LIST[nextType]];
        if (!nextItems?.length) return;

        const target = increment
          ? nextItems[0]
          : nextItems[nextItems.length - 1];
        if (target) navigateTo(`/${nextType}/${target.value}`);
        return;
      }

      const nextValue = items[nextIndex]?.value;
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
      if (event.pointerType !== "touch") return;

      const isMobileView = window.matchMedia(MOBILE_VIEW_QUERY).matches;
      if (!isMobileView) return;

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
