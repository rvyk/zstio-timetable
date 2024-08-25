"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { TimetableContext } from "../timetable-provider";

const CalendarButton: React.FC = () => {
  const optivumTimetable = useContext(TimetableContext);
  const [url, setUrl] = useState<string | null>();

  useEffect(() => {
    if (!optivumTimetable?.icalFile) return;

    const blob = new Blob([optivumTimetable.icalFile], {
      type: "text/calendar;charset=utf-8",
    });
    setUrl(URL.createObjectURL(blob));
  }, [optivumTimetable?.icalFile]);

  if (!url) return null;

  return (
    <a href={url} download={`${optivumTimetable?.title ?? "plan"}.ics`}>
      <ButtonWrapper tooltipText="Dodaj do kalendarza">
        <DocumentArrowDownIcon className="h-4 w-4" />
      </ButtonWrapper>
    </a>
  );
};

export default CalendarButton;
