"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { getIcs } from "@/lib/calendar";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext } from "react";
import { TimetableContext } from "../timetable-provider";

const CalendarButton: React.FC = () => {
  const optivumTimetable = useContext(TimetableContext);

  const getLinkUrl = useCallback(() => {
    if (!optivumTimetable?.lessons) return;

    const { error, value } = getIcs(optivumTimetable?.lessons);

    if (error) {
      console.error(error);
      return;
    }

    if (value) {
      return URL.createObjectURL(
        new File([value], `${optivumTimetable.title}.ics`, {
          type: "text/calendar",
        }),
      );
    }
  }, [optivumTimetable?.lessons, optivumTimetable?.title]);

  return (
    <ButtonWrapper tooltipText="Pobierz do kalendarza">
      <a
        download={`${optivumTimetable?.title ?? "plan"}.ics`}
        href={getLinkUrl()}
      >
        <DocumentArrowDownIcon className="h-4 w-4" />
      </a>
    </ButtonWrapper>
  );
};

export default CalendarButton;
