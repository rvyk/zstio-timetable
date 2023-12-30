import { Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { Fragment, useState } from "react";

function Search({
  teachers,
  rooms,
  classes,
  setIsMenuExpanded,
  handleSelect,
}: {
  teachers: nameValueType[];
  rooms: nameValueType[];
  classes: nameValueType[];
  setIsMenuExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelect: (name: any, value: any) => void;
}) {
  const [searchResults, setSearchResults]: [
    { name: string; type: string; value: string }[],
    any
  ] = useState([]);
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const toggleList = (value) => {
    setShowList(value);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setQuery(term);
    const classResults = classes
      .filter((cls) => cls.name.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 8)
      .map((cls) => ({ ...cls, type: "class" }));

    const teacherResults = teachers
      .filter((teacher) =>
        teacher.name.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 8)
      .map((teacher) => ({ ...teacher, type: "teacher" }));
    const roomsResults = rooms
      .filter((room) => room.name.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 8)
      .map((room) => ({ ...room, type: "room" }));

    setSearchResults([...classResults, ...teacherResults, ...roomsResults]);
  };
  return (
    <>
      <div className="relative mx-4 my-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </div>
        <input
          className="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 ring-0 outline-none dark:bg-[#202020] dark:border-none dark:placeholder-gray-300 dark:text-gray-300"
          placeholder="Wyszukaj klasę, nauczyciela i salę..."
          value={query}
          onChange={(e) => {
            handleSearch(e);
          }}
          onFocus={() => {
            toggleList(true);
          }}
          onBlur={() => {
            toggleList(false);
          }}
          onKeyDown={({ key }) => {
            if (
              key === "Enter" &&
              searchResults?.length === 1 &&
              typeof searchResults[0]?.value !== "undefined"
            ) {
              setIsMenuExpanded(false);
              handleSelect(searchResults[0].type, searchResults[0].value);
            }
          }}
        />
        {searchResults.length > 0 && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            ({searchResults.length})
          </div>
        )}
      </div>
      <Menu>
        <Transition
          show={showList}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute max-h-[35%] overflow-y-scroll mx-4 right-0 left-0 origin-top-right divide-y divide-gray-100 dark:divide-[#323232] rounded-md bg-gray-50 dark:bg-[#202020] shadow-lg ring-0 focus:outline-none">
            {searchResults?.map((item) => (
              <div className="px-2 py-2" key={item.name}>
                <Menu.Item as={Fragment}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setIsMenuExpanded(false);
                        handleSelect(item.type, item.value);
                      }}
                      className={`${
                        active
                          ? "dark:bg-[#171717] dark:text-gray-300 text-black bg-gray-100 font-semibold"
                          : "text-gray-900 dark:text-gray-300 font-semibold"
                      } group flex w-full items-center rounded-md px-2 py-2 transition-all text-sm duration-300`}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

export default Search;
