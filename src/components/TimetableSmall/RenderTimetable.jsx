"use client";

import { getCurrentLesson } from "@/utils/currentLesson";
import shortHours from "@/utils/shortHours";
import { MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function RenderTimetable({ hours, lessons, isShortHours }) {
  const [isScreenSmall, setIsScreenSmall] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const maxLessons =
    typeof hours == "object" &&
    Math.max(Object.entries(hours).length, ...lessons.map((day) => day.length));

  const days = [
    { long: "Poniedziałek", short: "Pon.", index: 0 },
    { long: "Wtorek", short: "Wt.", index: 1 },
    { long: "Środa", short: "Śr.", index: 2 },
    { long: "Czwartek", short: "Czw.", index: 3 },
    { long: "Piątek", short: "Pt.", index: 4 },
  ];

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
    setSelectedDay(new Date().getDay() > 4 ? 0 : new Date().getDay() - 1);
  }, []);
  return (
    <>
      <div className="w-full">
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
                    ? "!bg-[#321c21] dark:!bg-[#2b2b2b] !text-white"
                    : "hover:bg-gray-100 dark:hover:bg-[#202020]"
                } transition-all inline-block cursor-pointer w-full p-4 dark:border-[#2b2b2b] text-gray-900 bg-white focus:ring-transparent focus:outline-none dark:bg-[#3b3b3b] dark:text-white`}
              >
                {isScreenSmall ? item.short : item.long}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-full min-h-full dark:bg-[#202020]">
        {Object.entries(hours).length > 1 ? (
          Object.entries(
            isShortHours ? shortHours.slice(0, maxLessons) : hours
          )?.map(([key, hour], hourIndex) => {
            const { number, timeFrom, timeTo } = hour;
            let { isWithinTimeRange, minutesRemaining } = getCurrentLesson(
              timeFrom,
              timeTo
            );

            if (lessons[selectedDay][number - 1].length > 0) {
              return (
                <div
                  key={`hour-${number}`}
                  className={`text-gray-600 dark:text-gray-300 border-b flex dark:bg-[#2b2b2b] dark:border-[#242424]`}
                >
                  <div
                    className={`w-24 rounded-l py-1 my-2 flex-shrink-0 flex flex-col justify-center `}
                  >
                    <span className="block text-center font-bold mb-1">
                      {number}
                    </span>
                    <span className="block text-center text-sm">
                      {timeFrom} - {timeTo}
                      {isWithinTimeRange && minutesRemaining > 0 && (
                        <div className="bg-blue-100 mt-1 mx-2 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-100 dark:text-red-800 border border-blue-400 dark:border-red-400">
                          <p>{minutesRemaining == 1 ? "ZOSTAŁA" : "ZOSTAŁO"}</p>
                          <p>{`${minutesRemaining} MIN`}</p>
                        </div>
                      )}
                    </span>
                  </div>

                  <div className="w-full px-5 py-2 min-h-[4rem] flex flex-col justify-center">
                    {lessons[selectedDay][number - 1]?.map((lesson, index) => {
                      return (
                        <div key={`lesson-${index}`} className="p-2">
                          <div className="flex">
                            <p className="font-semibold">{lesson?.subject}</p>
                            <p className="ml-2">{lesson?.groupName}</p>
                          </div>
                          <div className="flex items-center">
                            {lesson?.teacher && (
                              <>
                                <UsersIcon className="h-4 w-4 mr-1" />
                                <Link
                                  href={`/teacher/${lesson?.teacherId}`}
                                  className={`flex items-center text-sm mr-3`}
                                >
                                  {lesson?.teacher}
                                </Link>
                              </>
                            )}
                            {lesson?.room && (
                              <>
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <Link
                                  href={`/room/${lesson?.roomId}`}
                                  className={`flex items-center mr-1 text-sm`}
                                >
                                  {lesson?.room}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition-all">
            <p className="px-6 py-4 font-semibold text-center text-gray-900 whitespace-nowrap dark:text-white transition-all">
              Nie znaleziono żadnych lekcji
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default RenderTimetable;
