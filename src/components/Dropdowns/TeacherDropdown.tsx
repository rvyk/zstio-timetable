import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { handleSelect } from "./functions";

function DropdownTeacher({ teachers }: { teachers: nameValueType[] }) {
  const [searchTeacher, setSearchTeacher] = useState("");
  const [lastSelect, setLastSelect] = useState("");
  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    setLastSelect(currentUrl);
  }, [currentUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeacher(event.target.value);
  };

  const filteredTeachers = teachers?.filter((teacher: dropdownSearchType) => {
    const teacherName = teacher.name.toLowerCase();
    const searchQuery = searchTeacher.toLowerCase();
    return teacherName.includes(searchQuery);
  });

  return (
    <div
      id="dropdownTeacher"
      className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-[#161616]"
    >
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </div>
          <input
            type="text"
            autoComplete="false"
            id="input-group-search-teacher"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
            placeholder="Wyszukaj nauczyciela"
            value={searchTeacher}
            onChange={handleSearch}
            onKeyDown={({ key }) => {
              if (
                key === "Enter" &&
                filteredTeachers?.length === 1 &&
                typeof filteredTeachers[0]?.value !== "undefined"
              ) {
                handleSelect(
                  "teacher",
                  "dropdownSearchTeacher",
                  filteredTeachers[0],
                  setLastSelect
                );
                router.push(`/teacher/${filteredTeachers[0].value}`);
              }
            }}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdownSearchTeacher"
      >
        {filteredTeachers?.length ? (
          filteredTeachers.map((teacher: dropdownSearchType) => (
            <li key={teacher.value}>
              <Link
                prefetch={false}
                href={`/teacher/${teacher.value}`}
                className={`flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ${
                  lastSelect === `/teacher/${teacher.value}`
                    ? "bg-gray-100 dark:bg-[#202020]"
                    : ""
                }`}
                onClick={() =>
                  handleSelect(
                    "teacher",
                    "dropdownSearchTeacher",
                    teacher,
                    setLastSelect
                  )
                }
              >
                <p className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                  {teacher.name}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-2 py-1 text-center text-gray-500 dark:text-gray-400">
            Nie znaleziono takiego nauczyciela
          </li>
        )}
      </ul>
    </div>
  );
}

export default DropdownTeacher;
