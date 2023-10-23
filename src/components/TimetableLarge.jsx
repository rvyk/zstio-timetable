"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import TableLoading from "./TableLoading";
import {Tooltip} from "react-tooltip";
import axios from "axios";
import RenderTableHeader from "./Timetable/RenderTableHeader";
import RenderTableFooter from "./Timetable/RenderTableFooter";
import RenderTableRow from "./Timetable/RenderTableRow";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function TimetableLarge(props) {
  const [isShortHours, setIsShortHours] = useState(false);
  const [substitutions, setSubstitutions] = useState({});

  let {
    status,
    text,
    timeTableID,
    timeTable: { hours, generatedDate, title, validDate, lessons },
  } = props;

  useEffect(() => {
    const storedShortHours = JSON.parse(localStorage.getItem("shortHours"));
    if (storedShortHours !== null) {
      setIsShortHours(storedShortHours);
    }
  }, []);

  const getTeacher = async (title) => {
    const teachers = await axios.get("/teachers.json");
    if (typeof teachers?.data != "object") {
      return undefined;
    }
    const result = teachers.data?.filter((teacher) => teacher.name === title);
    if (result?.length === 1) return result[0].full.split(" ")[0];
  };

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
                      <ArrowPathIcon className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-[#2B161B] dark:fill-blue-800" />
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
        className="!bg-[#2B161B] dark:!text-gray-200 dark:!bg-gray-800 text-center"
      />
    </>
  );
}

export default TimetableLarge;
