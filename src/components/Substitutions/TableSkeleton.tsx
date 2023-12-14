import React from "react";

function TableSkeleton() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[90%] transition-all">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 transition-all will-change-transform ">
        <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
          </div>
        </caption>
        <thead className="text-xs transition-all text-[#ffffff] bg-[#2B161B] uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Lekcja
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="cursor-pointer flex items-center">
                Nauczyciel
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 ml-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                </svg>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Oddział
            </th>
            <th scope="col" className="px-6 py-3">
              Przedmiot
            </th>
            <th scope="col" className="px-6 py-3">
              Sala
            </th>
            <th scope="col" className="px-6 py-3">
              Zastępca
            </th>
            <th scope="col" className="px-6 py-3">
              Uwagi
            </th>
          </tr>
        </thead>
        <tbody className="transition-all">
          {[...Array(5)].map((_, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition-all"
              key={index}
            >
              {[...Array(7)].map((_, index) => (
                <td
                  key={index}
                  className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-[#171717]"
                >
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-[#292929] mb-2.5"></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;
