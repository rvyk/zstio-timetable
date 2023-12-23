import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getQueryItems } from "@/utils/getQueryItems";
import { handleCheckboxChange } from "@/utils/handleCheckboxChange";
import { XMarkIcon } from "@heroicons/react/24/outline";

function DropdownTeachers({ props, onCheckboxChange }) {
  const [searchTeachers, setSearchTeachers] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeachers(event.target.value);
  };

  useEffect(() => {
    getQueryItems("teachers", router, setCheckedItems);
  }, [router.query, router]);

  const filterTeachers = (teacher: string) => {
    return teacher.toLowerCase().includes(searchTeachers.toLowerCase());
  };

  useEffect(() => {
    onCheckboxChange(checkedItems);
  }, [checkedItems, onCheckboxChange]);

  return (
    <div
      id="dropdownTeacher"
      className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-[#161616]"
      suppressHydrationWarning={true}
    >
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </div>
          <input
            type="text"
            autoComplete="false"
            id="input-group-search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
            placeholder="Wyszukaj nauczyciela"
            value={searchTeachers}
            onChange={handleSearch}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdownSearchTeacher"
      >
        {props?.form?.tables.map((table: tables) => {
          const uniqueTeachers: Array<string> = [];
          table.zastepstwa.forEach((item: substitutions) => {
            const isTeacherExist = uniqueTeachers.some(
              (teacher) => teacher === item.teacher
            );
            if (!isTeacherExist) {
              uniqueTeachers.push(item.teacher);
            }
          });
          return (
            <div key={table.time}>
              {uniqueTeachers.filter(filterTeachers).map((teacher, index) => (
                <li key={uniqueTeachers[index]}>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ">
                    <input
                      id={`${teacher.replace(" ", "-")}`}
                      type="checkbox"
                      name={teacher}
                      checked={checkedItems[teacher] || false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          "teachers",
                          router,
                          setCheckedItems
                        )
                      }
                      className="w-4 h-4 text-blue-600 dark:text-[#282828] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#171717] dark:ring-offset-[#171717] dark:focus:ring-offset-[#171717] focus:ring-2 dark:bg-[#282828] dark:border-[#202020]"
                    />
                    <label
                      htmlFor={`${teacher.replace(" ", "-")}`}
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {teacher}
                    </label>
                  </div>
                </li>
              ))}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default DropdownTeachers;
