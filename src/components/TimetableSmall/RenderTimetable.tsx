import shortHours from "@/utils/shortHours";
import {
  AcademicCapIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CurrentLesson from "../Table/CurrentLesson";
import { getSubstitution, getSubstitutionForGroup } from "@/utils/getter";
import { cases, days } from "@/utils/helpers";

function RenderTimetable({
  hours,
  lessons,
  isShortHours,
  substitutions,
  selectedDay,
  setSelectedDay,
}) {
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  const maxLessons =
    typeof hours == "object" &&
    Math.max(Object.entries(hours).length, ...lessons.map((day) => day.length));

  useEffect(() => {
    function handleResize() {
      if (typeof window !== "undefined") {
        setIsScreenSmall(window.innerWidth < 500);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    let day = new Date().getDay();
    setSelectedDay(day >= 6 || day == 0 ? 0 : day - 1);
  }, [setSelectedDay]);
  return (
    <>
      <div className="w-full sticky top-0 z-20">
        <ul className="w-full text-sm font-medium text-center text-gray-500 divide-x dark:divide-none divide-gray-200 shadow flex dark:text-gray-400">
          {days.map((item, index) => (
            <li
              className={`w-full`}
              key={index}
              onClick={() => {
                setSelectedDay(item.index);
              }}
            >
              <p
                className={`${
                  item.index == selectedDay
                    ? "!bg-[#321c21] dark:!bg-[#202020] !text-white"
                    : "hover:bg-gray-100 dark:hover:bg-[#181818]"
                } transition-all inline-block cursor-pointer w-full p-4 dark:border-[#2b2b2b] text-gray-900 bg-white focus:ring-transparent focus:outline-none dark:bg-[#282828] dark:text-white`}
              >
                {isScreenSmall ? item.short : item.long}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div id="timetable" className="min-w-full mb-[4.25rem] dark:bg-[#202020]">
        {Object.entries(hours).length > 1 ? (
          Object.entries(
            isShortHours ? shortHours.slice(0, maxLessons) : hours
          )?.map(([key, hour]: [string, hourType], hourIndex) => {
            const { number, timeFrom, timeTo } = hour;

            return (
              <div
                key={`hour-${number}`}
                className={`text-gray-600 ${
                  number % 2 === 0
                    ? "bg-white dark:bg-[#282828]"
                    : "bg-zinc-50 dark:bg-[#242424]"
                } dark:text-gray-300 border-b flex dark:border-[#282828] border-zinc-100`}
              >
                <div
                  className={`w-24 rounded-l py-1 my-2 flex-shrink-0 flex flex-col justify-center `}
                >
                  <span className="block text-center font-bold mb-1">
                    {number}
                  </span>
                  <span className="block text-center text-sm">
                    {timeFrom} - {timeTo}
                    {selectedDay == new Date().getDay() - 1 && (
                      <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                    )}
                  </span>
                </div>

                <div className="w-full px-5 py-2 min-h-[4rem] flex flex-col justify-center">
                  {lessons[selectedDay][number - 1]?.map((lesson, index) => {
                    let substitution = getSubstitution(
                        selectedDay,
                        hourIndex,
                        substitutions
                      ),
                      possibleSubstitution = substitution,
                      sure = true;
                    if (
                      substitution &&
                      lessons[selectedDay][number - 1]?.length > 1
                    ) {
                      substitution = getSubstitutionForGroup(
                        lesson.groupName,
                        substitutions,
                        hourIndex,
                        selectedDay
                      );
                      if (!substitution) {
                        sure = false;
                        lessons[selectedDay][number - 1]?.map(
                          (lessonCheck, checkIndex) => {
                            if (
                              getSubstitutionForGroup(
                                lessonCheck.groupName,
                                substitutions,
                                hourIndex,
                                selectedDay
                              ) &&
                              checkIndex !== index
                            ) {
                              substitution = undefined;
                              sure = true;
                            }
                          }
                        );
                      }
                    }

                    return (
                      <div key={`lesson-${index}`} className="p-2">
                        <div className="flex">
                          <p
                            className={`font-semibold ${
                              substitution && sure && "line-through opacity-60"
                            }`}
                          >
                            {lesson?.subject}
                          </p>
                          <p
                            className={`ml-2 ${
                              substitution && sure && "line-through opacity-60"
                            }`}
                          >
                            {lesson?.groupName}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {lesson?.className && (
                            <>
                              <AcademicCapIcon className="h-4 w-4 mr-1" />
                              <Link
                                prefetch={false}
                                href={`/class/${lesson?.classId}`}
                                className={`flex ${
                                  substitution &&
                                  sure &&
                                  "line-through opacity-60"
                                } items-center text-sm mr-3`}
                              >
                                {lesson?.className}
                              </Link>
                            </>
                          )}

                          {lesson?.teacher && (
                            <>
                              <UsersIcon className="h-4 w-4 mr-1" />
                              <Link
                                prefetch={false}
                                href={`/teacher/${lesson?.teacherId}`}
                                className={`flex ${
                                  substitution &&
                                  sure &&
                                  "line-through opacity-60"
                                } items-center text-sm mr-3`}
                              >
                                {lesson?.teacher}
                              </Link>
                            </>
                          )}
                          {lesson?.room && (
                            <>
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <Link
                                prefetch={false}
                                href={`/room/${lesson?.roomId}`}
                                className={`flex ${
                                  substitution &&
                                  sure &&
                                  "line-through opacity-60"
                                } items-center mr-1 text-sm`}
                              >
                                {substitution &&
                                sure &&
                                substitution?.class != lesson?.room
                                  ? substitution?.class
                                  : lesson?.room}
                              </Link>
                            </>
                          )}

                          {possibleSubstitution && !sure && (
                            <Link
                              prefetch={false}
                              href={`https://zastepstwa.awfulworld.space`}
                            >
                              <ExclamationCircleIcon
                                className="w-5 h-5 text-red-600 dark:text-red-400"
                                data-tooltip-id="content_tooltips"
                                data-tooltip-html={`${possibleSubstitution?.case}? <br /> (Sprawdź zastępstwa)`}
                              />
                            </Link>
                          )}
                        </div>
                        {substitution && sure && (
                          <>
                            {cases.includes(substitution?.case) === false && (
                              <p className="text-orange-400 font-semibold">
                                {substitution?.subject}
                              </p>
                            )}
                            <p
                              className={`${
                                substitution?.case == cases[1]
                                  ? "text-yellow-400"
                                  : "text-red-500 dark:text-red-400"
                              } font-semibold`}
                            >
                              {substitution?.case == cases[1] &&
                              substitution?.message
                                ? substitution?.message
                                : substitution?.case}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-[#202020] first-letter:transition-all">
            <p className="px-6 py-4 font-semibold text-center text-gray-900 whitespace-nowrap dark:text-gray-300 transition-all">
              Nie znaleziono żadnych lekcji
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default RenderTimetable;
