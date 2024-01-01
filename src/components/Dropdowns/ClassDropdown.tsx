import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { handleSelect } from "./functions";

function DropdownClass({ classes }: { classes: nameValueType[] }) {
  const [searchClass, setSearchClass] = useState("");
  const [lastSelect, setLastSelect] = useState("");
  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    setLastSelect(currentUrl);
  }, [currentUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchClass(event.target.value);
  };

  const filteredClasses = classes?.filter((classPrefix: dropdownSearchType) => {
    const className = classPrefix.name.toLowerCase();
    const searchQuery = searchClass.toLowerCase();
    return className.includes(searchQuery);
  });

  return (
    <div
      id="dropdownClass"
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
            id="input-group-search-class"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
            placeholder="Wyszukaj oddział"
            value={searchClass}
            onChange={handleSearch}
            onKeyDown={({ key }) => {
              if (
                key === "Enter" &&
                filteredClasses?.length === 1 &&
                typeof filteredClasses[0]?.value !== "undefined"
              ) {
                handleSelect(
                  "class",
                  "dropdownSearchClass",
                  filteredClasses[0],
                  setLastSelect,
                );
                router.push(`/class/${filteredClasses[0].value}`);
              }
            }}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdownSearchClass"
      >
        {filteredClasses?.length ? (
          filteredClasses.map((classPrefix: dropdownSearchType) => (
            <li key={classPrefix.value}>
              <Link
                prefetch={false}
                href={`/class/${classPrefix.value}`}
                className={`flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ${
                  lastSelect === `/class/${classPrefix.value}`
                    ? "bg-gray-100 dark:bg-[#202020]"
                    : ""
                }`}
                onClick={() =>
                  handleSelect(
                    "class",
                    "dropdownSearchClass",
                    classPrefix,
                    setLastSelect,
                  )
                }
              >
                <p className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                  {classPrefix.name}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-2 py-1 text-center text-gray-500 dark:text-gray-400">
            Nie znaleziono takiego oddziału
          </li>
        )}
      </ul>
    </div>
  );
}

export default DropdownClass;
