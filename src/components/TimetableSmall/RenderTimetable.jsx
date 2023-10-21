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
  return (
    <>
      <div className="w-full ">
        <ul className="w-full border-b-2 border-[#321c21] dark:border-gray-900 text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 shadow flex dark:divide-gray-600 dark:text-gray-400">
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
                    ? "!bg-[#321c21] dark:!bg-gray-900 !text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-all inline-block cursor-pointer w-full p-4 text-gray-900 bg-white focus:ring-transparent focus:outline-none dark:bg-gray-700 dark:text-white`}
              >
                {isScreenSmall ? item.short : item.long}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-full min-h-full dark:bg-gray-900 ">
        {Object.entries(hours).length > 1 ? (
          Object.entries(
            isShortHours ? shortHours.slice(0, maxLessons) : hours
          )?.map(([key, hour], hourIndex) => {
            return (
              <div
                key={`hour-${hour.number}`}
                className={`text-gray-600 dark:text-gray-300 border-b flex ${
                  hourIndex % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } dark:border-gray-600`}
              >
                <div
                  className={`w-24 rounded-l py-1 flex-shrink-0 flex flex-col justify-center `}
                >
                  <span className="block text-center font-bold mb-1">
                    {hour.number}
                  </span>
                  <span className="block text-center text-sm">
                    {hour.timeFrom} - {hour.timeTo}
                  </span>
                </div>

                <div className="w-full px-4 py-1">
                  {lessons[selectedDay][hour.number - 1]?.map(
                    (lesson, index) => {
                      return (
                        <div key={`lesson-${index}`} className="p-2">
                          <div className="flex">
                            <p className="font-semibold">{lesson?.subject}</p>
                            <p className="ml-2">{lesson?.groupName}</p>
                          </div>
                          <div className="flex">
                            <UsersIcon className="h-4 w-4" />
                            <Link
                              href={`/teacher/${lesson?.teacherId}`}
                              className={`flex items-center mr-1 text-sm`}
                            >
                              {lesson?.teacher}
                            </Link>
                            <MapPinIcon className="ml-3 h-4 w-4" />
                            <Link
                              href={`/room/${lesson?.roomId}`}
                              className={`flex items-center mr-1 text-sm`}
                            >
                              {lesson?.room}
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
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
