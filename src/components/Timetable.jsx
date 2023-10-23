"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import TableLoading from "./TableLoading";
import {Tooltip} from "react-tooltip";
import axios from "axios";
import teachersList from "/public/teachers.json";
import RenderTableHeader from "./Timetable/RenderTableHeader";
import RenderTableFooter from "./Timetable/RenderTableFooter";
import RenderTableRow from "./Timetable/RenderTableRow";

function Timetable(props) {
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

  function getTeacher(title) {
    try {
      const result = teachersList?.filter((teacher) => teacher.name === title);
      if (result?.length === 1) return result[0].full.split(" ")[0];
    } catch (e) {
      console.log("FAILED TO GET TEACHER NAME FROM HIST SHORT FORM");
    }
    return undefined;
  }

  useEffect(() => {
    async function getSubstitutions() {
      const search =
        text === "Oddziały"
          ? "branch"
          : text === "Nauczyciele"
            ? "teacher"
            : undefined;
      const query = search === "teacher" ? getTeacher(title) : (title.includes(" ") ? title.split(" ")[0] : title);

      if (search && query) {
        try {
          const substitutionsRes = await axios.get(
            `/api/getSubstitutions?search=${search}&query=${query}`
          );
          const shortDayNames = ["pon", "wt", "śr", "czw", "pt", "sob", "nie"];
          const match =
            substitutionsRes.data?.tables[0]?.time.match(/\([^)]*\)/i);

          if (match && match.length > 0) {
            const dayIndex = shortDayNames.indexOf(
              match[0].substring(1).replace(".)", "")
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
        } catch (e) {
          setSubstitutions({});
        }
      }
    }

    getSubstitutions();
  }, [text, title]);

  return (
    <>
      {typeof hours == "object" ? (
        <div
          id="timetable"
          className="relative overflow-x-auto shadow-md md:rounded-xl w-[90%] transition-all duration-100"
        >
          <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-400">
            <caption
              className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
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
                      <p
                        className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-400">
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

            <RenderTableHeader/>
            <RenderTableRow
              hours={hours}
              isShortHours={isShortHours}
              lessons={lessons}
              substitutions={substitutions}
            />
            <RenderTableFooter
              status={status}
              hours={hours}
              validDate={validDate}
              generatedDate={generatedDate}
              timeTableID={timeTableID}
            />
          </table>
        </div>
      ) : (
        <TableLoading/>
      )}
      <Tooltip
        id="content_tooltips"
        className="!bg-[#2B161B] dark:!text-gray-200 dark:!bg-gray-800"
      />
    </>
  );
}

export default Timetable;
