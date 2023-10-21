import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

function TableLoading() {
  const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[90%] transition-all">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 transition-all will-change-transform ">
        <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div
            role="status"
            className="transition-all lg:text-xl w-full flex items-center"
          >
            <ArrowPathIcon className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-[#2B161B] dark:fill-blue-800" />
          </div>
        </caption>
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
        <tbody className="transition-all">
          {[...Array(8)].map((_, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition-all"
              key={index}
            >
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[80px] mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[400px] mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[100px] mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                </div>
              </td>
              <td className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-gray-700">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableLoading;
