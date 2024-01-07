import RenderLesson from "@/components/content-items/timetable/render-lesson";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortHours } from "@/lib/utils";
import { Table as TableType } from "@/types/timetable";
import Link from "next/link";
import React, { useState } from "react";
import ShortHoursButton from "./short-hours-button";

interface TimeTableProps {
  timeTable: TableType["timeTable"];
  substitutions: TableType["substitutions"];
}

const TimeTable: React.FC<TimeTableProps> = ({ timeTable, substitutions }) => {
  const [isShortHours, setIsShortHours] = useState(
    localStorage.getItem("shortHours") === "true",
  );

  const maxLessons = Math.max(
    Object.entries(timeTable.data.hours).length,
    ...timeTable.data.lessons.map((day) => day.length),
  );

  return (
    <Table>
      <TableCaption status={timeTable.status}>
        <div className="inline-flex rounded-md shadow-sm mr-2" role="group">
          <ShortHoursButton {...{ isShortHours, setIsShortHours }} />
        </div>
        <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-300">
          {timeTable?.data?.text} /
        </p>
        <p className="transition-all text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-300">
          {timeTable?.data?.title}
        </p>
      </TableCaption>
      <TableHeader />
      {Object.entries(timeTable.data?.hours).length > 1 ? (
        Object.entries(
          isShortHours
            ? shortHours.slice(0, maxLessons)
            : timeTable.data?.hours,
        )?.map(([key, hour]: [string, hourType], lessonIndex) => {
          const { number, timeFrom, timeTo } = hour;

          return (
            <tbody key={lessonIndex}>
              <TableRow key={lessonIndex} reverseColor={lessonIndex % 2 === 0}>
                <TableCell variant="number">
                  <div className="flex justify-center items-center flex-col">
                    {number}
                    {/* {new Date().getDay() < 6 && new Date().getDay() != 0 && (
                      <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                    )} */}
                  </div>
                </TableCell>

                <TableCell variant="number">
                  {timeFrom} - {timeTo}
                </TableCell>

                {timeTable.data?.lessons.map((day, index) => {
                  return (
                    <TableCell key={index}>
                      <RenderLesson
                        className={timeTable.data?.title}
                        day={day}
                        dayIndex={index}
                        lessonIndex={lessonIndex}
                        substitutions={substitutions.tables[0]}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            </tbody>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={7}
            scope="row"
            className="text-center font-semibold"
          >
            <p>Nie znaleziono żadnych lekcji</p>
          </TableCell>
        </TableRow>
      )}
      <TableFooter>
        <TableRow
          reverseColor={Object.entries(timeTable.data.hours).length % 2 == 0}
        >
          {timeTable.status && (
            <TableCell
              colSpan={5}
              scope="row"
              className="font-semibold !border-none"
            >
              {timeTable.data.generatedDate &&
                `Wygenerowano: ${timeTable.data.generatedDate}`}{" "}
              {timeTable.data.validDate &&
                `Obowiązuje od: ${timeTable.data.validDate}`}
            </TableCell>
          )}
          <TableCell
            colSpan={!timeTable.status ? 7 : 2}
            scope="row"
            className="font-semibold text-right "
          >
            <Link
              prefetch={false}
              href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${timeTable.data.id}.html`}
              target="_blank"
            >
              Źródło danych
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TimeTable;
