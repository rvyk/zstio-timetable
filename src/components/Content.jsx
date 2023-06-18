import React from "react";
import Link from "next/link";
import TableLoading from "./TableLoading";

function Content({ lessons, hours, generatedDate }) {
  const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  // TODO:
  const shortHours = [
    {
      number: 1,
      timeFrom: "8:00",
      timeTo: "8:30",
    },
    {
      number: 2,
      timeFrom: "8:35",
      timeTo: "9:05",
    },
    {
      number: 3,
      timeFrom: "9:10",
      timeTo: "9:40",
    },
    {
      number: 4,
      timeFrom: "9:45",
      timeTo: "10:15",
    },
    {
      number: 5,
      timeFrom: "10:30",
      timeTo: "11:00",
    },
    {
      number: 6,
      timeFrom: "11:05",
      timeTo: "11:35",
    },
    {
      number: 7,
      timeFrom: "11:40",
      timeTo: "12:10",
    },
    {
      number: 8,
      timeFrom: "12:15",
      timeTo: "12:45",
    },
    {
      number: 9,
      timeFrom: "12:50",
      timeTo: "13:20",
    },
    {
      number: 10,
      timeFrom: "13:25",
      timeTo: "13:55",
    },
    {
      number: 11,
      timeFrom: "14:00",
      timeTo: "14:30",
    },
    {
      number: 12,
      timeFrom: "14:35",
      timeTo: "15:05",
    },
    {
      number: 13,
      timeFrom: "15:10",
      timeTo: "15:40",
    },
    {
      number: 14,
      timeFrom: "15:45",
      timeTo: "16:15",
    },
  ];

  return (
    <>
      {typeof hours == "object" ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[90%] transition-all duration-100">
          <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-400">
            <thead className="text-xs transition-all duration-200 text-[#ffffff] bg-[#2B161B] uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center justify-center">Nr</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center justify-center">Godz</div>
                </th>
                {daysOfWeek.map((day) => (
                  <th scope="col" className="px-6 py-3" key={day}>
                    <div className="flex items-center justify-center">
                      {day}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.entries(hours)?.map(([key, item], index) => (
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
                  <td className="text-center px-4 border-r last:border-none dark:border-gray-700">
                    {item.timeFrom} - {item.timeTo}
                  </td>

                  {lessons?.map((day, lessonIndex) => (
                    <td
                      className="px-6 py-4 whitespace-nowrap border-r last:border-none dark:border-gray-700 text-gray-500 dark:text-gray-400"
                      key={`${day}-${lessonIndex}`}
                    >
                      {day[key - 1]?.map((lesson, subIndex) => (
                        <div
                          key={`${day}-${lessonIndex}-${subIndex}`}
                          className="flex"
                        >
                          {lesson?.groupName && (
                            <p className="flex items-center mr-1">
                              {lesson?.groupName}
                            </p>
                          )}
                          <div className="font-semibold mr-1">
                            {lesson?.subject}
                          </div>
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
              ))}
            </tbody>
            <tfoot
              className={`bg-[#2B161B] ${
                Object.entries(hours)?.length % 2 == 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <tr className="font-semibold text-gray-900 dark:text-white">
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
                  <Link
                    href={"http://www.zstio-elektronika.pl/plan/index.html"}
                  >
                    Źródło danych
                  </Link>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <TableLoading />
      )}
    </>
  );
}

export default Content;
