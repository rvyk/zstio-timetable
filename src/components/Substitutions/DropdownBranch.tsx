import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getQueryItems } from "@/utils/getQueryItems";
import { handleCheckboxChange } from "@/utils/handleCheckboxChange";

function DropdownBranch({ props, onCheckboxChangeBranch }) {
  const [searchBranch, setSearchBranch] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBranch(event.target.value);
  };

  useEffect(() => {
    getQueryItems("branches", router, setCheckedItems);
  }, [router.query, router]);

  const filterBranches = (branch: string) => {
    return branch.toLowerCase().includes(searchBranch.toLowerCase());
  };

  useEffect(() => {
    onCheckboxChangeBranch(checkedItems);
  }, [checkedItems, onCheckboxChangeBranch]);

  return (
    <div
      id="dropdownBranch"
      className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-[#161616]"
      suppressHydrationWarning={true}
    >
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-300"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            autoComplete="false"
            id="input-group-search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
            placeholder="Wyszukaj oddział"
            value={searchBranch}
            onChange={handleSearch}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdownSearchBranch"
      >
        {props?.form?.tables.map((table: tables) => {
          const uniqueBranches: Array<string> = [];
          table.zastepstwa.forEach((item: substitutions) => {
            const isBranchExist = uniqueBranches.some(
              (branch) => branch === item.branch
            );
            if (!isBranchExist) {
              uniqueBranches.push(item.branch);
            }
          });

          uniqueBranches.sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));

          return (
            <div key={table.time}>
              {uniqueBranches.filter(filterBranches).map((branch, index) => (
                <li key={uniqueBranches[index]}>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ">
                    <input
                      id={`${branch.replace(" ", "-")}`}
                      type="checkbox"
                      name={branch}
                      checked={checkedItems[branch] || false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          "branches",
                          router,
                          setCheckedItems
                        )
                      }
                      className="w-4 h-4 text-blue-600 dark:text-[#282828] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#171717] dark:ring-offset-[#171717] dark:focus:ring-offset-[#171717] focus:ring-2 dark:bg-[#282828] dark:border-[#202020]"
                    />
                    <label
                      htmlFor={`${branch.replace(" ", "-")}`}
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {branch}
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

export default DropdownBranch;
