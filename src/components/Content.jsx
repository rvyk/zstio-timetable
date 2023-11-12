"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TableLoading from "./TableLoading";
import { Tooltip } from "react-tooltip";
import shortHours from "./shortHours";
import axios from "axios";

function Content(props) {
  const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
  const [isShortHours, setIsShortHours] = useState(false);
  const [substitutions, setSubstitutions] = useState({});

  // Destructuring does not work properly on some hosts, so it is required to do it this way.
  let status = props?.status,
    text = props?.text,
    hours = props?.timeTable?.hours,
    generatedDate = props?.timeTable?.generatedDate,
    title = props?.timeTable?.title,
    validDate = props?.timeTable?.validDate,
    timeTableID = props?.timeTableID,
    lessons = props?.timeTable?.lessons;

  useEffect(() => {
    const storedShortHours = JSON.parse(localStorage.getItem("shortHours"));
    if (storedShortHours !== null) {
      setIsShortHours(storedShortHours);
    }
  }, []);

  useEffect(() => {
    async function getSubstitutions() {
      let search =
        text === "Oddziały"
          ? "branch"
          : text === "Nauczyciele"
          ? "teacher"
          : undefined;
      if (search) {
        const substitutionsRes = await axios.get(
          `/api/getSubstitutions?search=${search}&query=${title}`,
        );
        const shortDayNames = ["pon", "wt", "śr", "czw", "pt", "sob", "nie"];
        const match =
          substitutionsRes.data?.tables[0]?.time.match(/\([^)]*\)/i);

        if (match && match.length > 0) {
          const dayIndex = shortDayNames.indexOf(
            match[0].substring(1).replace(".)", ""),
          );
          if (dayIndex > 0) {
            setSubstitutions({
              dayIndex,
              zastepstwa: substitutionsRes.data.tables[0].zastepstwa,
            });
          }
        } else {
          setSubstitutions({});
        }
      }
    }

    getSubstitutions();
  }, [substitutions, text, title]);

  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();
  const maxLessons =
    typeof hours == "object" &&
    Math.max(Object.entries(hours).length, ...lessons.map((day) => day.length));

  const renderTableHeader = () => {
    return (
      <thead className="text-xs transition-all duration-200 text-[#ffffff] bg-[#2B161B] uppercase dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            <div className="flex items-center justify-center">Lekcja</div>
          </th>
          <th scope="col" className="px-8 py-3">
            <div className="flex items-center justify-center">Godz.</div>
          </th>
          {daysOfWeek.map((day) => (
            <th scope="col" className="px-6 py-3" key={day}>
              <div className="flex items-center justify-center">{day}</div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableRow = () => {
    return (
      <tbody>
        {Object.entries(hours).length > 1 ? (
          Object.entries(
            isShortHours ? shortHours.slice(0, maxLessons) : hours,
          )?.map(([key, item], index) => {
            const { number, timeFrom, timeTo } = item;
            const [fromHour, fromMinutes] = timeFrom.split(":");
            const [toHour, toMinutes] = timeTo.split(":");
            const isAfterFromTime =
              currentHour > Number(fromHour) ||
              (currentHour === Number(fromHour) &&
                currentMinutes >= Number(fromMinutes));
            const isBeforeToTime =
              currentHour < Number(toHour) ||
              (currentHour === Number(toHour) &&
                currentMinutes < Number(toMinutes));
            const isWithinTimeRange = isAfterFromTime && isBeforeToTime;

            let minutesRemaining = 0;
            if (isWithinTimeRange) {
              const endTime = new Date();
              endTime.setHours(Number(toHour), Number(toMinutes), 0);
              const timeDifference = endTime - new Date();
              minutesRemaining = Math.ceil(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
              );
            }
            return (
              <tr
                className={`text-gray-600 dark:text-gray-300 border-b ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } dark:border-gray-600`}
                key={index}
              >
                <td
                  className={`py-4 text-center h-full border-r last:border-none font-semibold dark:border-gray-600`}
                >
                  <div className="flex justify-center items-center flex-col">
                    {number}
                    {isWithinTimeRange && minutesRemaining > 0 && (
                      <div className="bg-blue-100 mt-1 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                        <p>{minutesRemaining == 1 ? "ZOSTAŁA" : "ZOSTAŁO"}</p>
                        <p>{`${minutesRemaining} MIN`}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-center border-r last:border-none dark:border-gray-600">
                  {timeFrom} - {timeTo}
                </td>

                {lessons?.map((day, lessonIndex) => (
                  <td
                    className="px-6 py-4 whitespace-nowrap border-r last:border-none dark:border-gray-600"
                    key={`${day}-${lessonIndex}`}
                  >
                    {day[number - 1]?.map((lesson, subIndex) => (
                      <div
                        key={`${day}-${lessonIndex}-${subIndex}`}
                        className="flex"
                      >
                        <div
                          className={`font-semibold mr-1 ${
                            lessonIndex == substitutions.dayIndex &&
                            substitutions.zastepstwa.filter(
                              (zastepstwo) =>
                                zastepstwo.lesson.split(",")[0] - 1 == index,
                            ).length > 0
                              ? "bg-red-500"
                              : ""
                          }`}
                        >
                          {lesson?.subject}
                        </div>

                        {lesson?.groupName ? (
                          <p className="flex items-center mr-1">
                            {`(${lesson?.groupName})`}
                          </p>
                        ) : (
                          day[number - 1].length > 1 && (
                            <p className="flex items-center mr-1">
                              {`(${subIndex + 1}/${day[number - 1].length})`}
                            </p>
                          )
                        )}

                        {lesson?.className && lesson?.classId && (
                          <Link
                            href={`/class/${lesson?.classId}`}
                            className="flex items-center mr-1"
                          >
                            {lesson?.className}
                          </Link>
                        )}

                        {lesson?.teacher && lesson?.teacherId && (
                          <Link
                            href={`/teacher/${lesson?.teacherId}`}
                            className="flex items-center mr-1"
                          >
                            {lesson?.teacher}
                          </Link>
                        )}

                        {lesson?.roomId && lesson?.room && (
                          <Link
                            href={`/room/${lesson?.roomId}`}
                            className="flex items-center"
                          >
                            {lesson?.room}
                          </Link>
                        )}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition-all">
            <td
              scope="row"
              colSpan={7}
              className="px-6 py-4 font-semibold text-center text-gray-900 whitespace-nowrap dark:text-white transition-all"
            >
              Nie znaleziono żadnych lekcji
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  const renderTableFooter = () => {
    return (
      <tfoot
        className={`bg-[#2B161B] ${
          Object.entries(hours)?.length % 2 == 0
            ? "bg-white dark:bg-gray-800"
            : "bg-gray-100 dark:bg-gray-700"
        }`}
      >
        <tr className="font-semibold text-gray-900 dark:text-white">
          {status && (
            <td
              scope="row"
              colSpan={5}
              className="px-6 py-4 font-semibold w-1 text-left text-gray-900 whitespace-nowrap dark:text-gray-100 transition-all"
            >
              {generatedDate && `Wygenerowano: ${generatedDate}`}{" "}
              {validDate && `Obowiązuje od: ${validDate}`}
            </td>
          )}
          <td
            scope="row"
            colSpan={!status ? 7 : 2}
            className="px-6 py-4 font-semibold w-1 text-right text-gray-900 whitespace-nowrap dark:text-gray-100 transition-all"
          >
            <Link
              href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${timeTableID}.html`}
              target="_blank"
            >
              Źródło danych
            </Link>
          </td>
        </tr>
      </tfoot>
    );
  };

  return (
    <>
      {typeof hours == "object" ? (
        <div
          id="timetable"
          className="relative overflow-x-auto shadow-md md:rounded-xl w-[90%] transition-all duration-100"
        >
          <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-400">
            <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              {!status ? (
                <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-400">
                  Nie znaleziono pasującego planu lekcji
                </p>
              ) : (
                <>
                  {title && text.length > 0 ? (
                    <div className="flex items-center">
                      <div
                        className="inline-flex rounded-md shadow-sm mr-2"
                        role="group"
                      >
                        <button
                          type="button"
                          data-tooltip-id="content_tooltips"
                          data-tooltip-content="Normalne lekcje - 45 minut"
                          onClick={() => {
                            setIsShortHours(false);
                            localStorage.setItem("shortHours", false);
                          }}
                          className={` ${
                            isShortHours
                              ? "bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
                              : "bg-[#73110e] hover:bg-[#480e0c] dark:hover:bg-gray-950 dark:bg-gray-900 text-white hover:text-gray-200 focus:text-gray-200"
                          } transition-all duration-200 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-l-lg focus:z-10 focus:ring-0 dark:border-gray-600 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
                        >
                          {"45'"}
                        </button>
                        <button
                          type="button"
                          data-tooltip-id="content_tooltips"
                          data-tooltip-content="Skrócone lekcje - 30 minut"
                          onClick={() => {
                            setIsShortHours(true);
                            localStorage.setItem("shortHours", true);
                          }}
                          className={` ${
                            isShortHours
                              ? "bg-[#73110e] hover:bg-[#480e0c] dark:hover:bg-gray-950 dark:bg-gray-900 text-white hover:text-gray-200 focus:text-gray-200"
                              : "bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
                          } transition-all duration-200 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-r-lg focus:z-10 focus:ring-0 dark:border-gray-600 dark:text-white dark:hover:text-white dark:focus:ring-blue-500 dark:focus:text-white`}
                        >
                          {"30'"}
                        </button>
                      </div>
                      <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-400">
                        {text} /
                      </p>
                      <p className="transition-all text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-400">
                        {title}
                      </p>
                    </div>
                  ) : (
                    <div
                      role="status"
                      className="transition-all lg:text-xl w-full flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-[#2B161B] dark:fill-blue-800"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </>
              )}
            </caption>

            {renderTableHeader()}
            {renderTableRow()}
            {renderTableFooter()}
          </table>
        </div>
      ) : (
        <TableLoading />
      )}
      <Tooltip
        id="content_tooltips"
        className="!bg-[#2B161B] dark:!text-gray-200 dark:!bg-gray-800"
      />
    </>
  );
}

export default Content;
