import React, { useEffect, useState } from "react";
import { Table, TimetableList } from "@wulkanowy/timetable-parser";
import fetchTimetable from "@/helpers/fetchTimetable";
import Link from "next/link";
import TableLoading from "./TableLoading";

function Content({ lessons, hours, generatedDate }) {
  const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[90%] transition-all">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs transition-all text-[#ffffff] bg-[#2B161B] uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center justify-center">Nr</div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center justify-center">Godz</div>
            </th>
            {daysOfWeek.map((day) => (
              <th scope="col" className="px-6 py-3" key={day}>
                <div className="flex items-center justify-center">{day}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(hours).map(([key, item], index) => (
            <tr
              className={`border-b ${
                index % 2 == 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-700"
              } dark:border-gray-700`}
              key={index}
            >
              <td className="border-r py-4 text-center h-full last:border-none font-semibold dark:border-gray-700">
                {item.number}
              </td>
              <td className="text-center border-r last:border-none dark:border-gray-700">
                {item.timeFrom} - {item.timeTo}
              </td>
              {lessons.map((day, lessonIndex) => (
                <td
                  className="px-6 py-4 whitespace-nowrap border-r last:border-none dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  key={`${day}-${lessonIndex}`}
                >
                  {day[key - 1]?.map((lesson, subIndex) => (
                    <div
                      key={`${day}-${lessonIndex}-${subIndex}`}
                      className="flex"
                    >
                      <div className="font-semibold mr-1">
                        {lesson?.subject}
                      </div>
                      <Link
                        href={`/teacher/${lesson?.teacherId}`}
                        className="flex items-center mr-1"
                      >
                        {lesson?.teacher}
                      </Link>
                      <Link
                        href={`/class/${lesson?.roomId}`}
                        className="flex items-center"
                      >
                        {lesson?.room}
                      </Link>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot
          className={`bg-[#2B161B] ${
            hours.length % 2 != 0
              ? "bg-white dark:bg-gray-800"
              : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <tr class="font-semibold text-gray-900 dark:text-white">
            <td
              scope="row"
              colSpan={5}
              className="px-6 py-4 font-semibold w-1 text-left text-gray-900 whitespace-nowrap dark:text-white transition-all"
            >
              Wygenerowany dnia: {generatedDate}
            </td>
            <td
              scope="row"
              colSpan={2}
              className="px-6 py-4 font-semibold w-1 text-right text-gray-900 whitespace-nowrap dark:text-white transition-all"
            >
              <Link href={"http://www.zstio-elektronika.pl/plan/index.html"}>
                Źródło danych
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Content;
