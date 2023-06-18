import React, { useEffect, useState } from "react";
import Link from "next/link";

function DropdownRoom({ rooms }) {
  const [searchRoom, setSearchRoom] = useState("");
  const [lastSelect, setLastSelect] = useState("");

  useEffect(() => {
    const lastSelectValue = localStorage.getItem("LastSelect");
    if (lastSelectValue) {
      setLastSelect(lastSelectValue);
    }
  }, []);

  const handleSearch = (event) => {
    setSearchRoom(event.target.value);
  };

  const handleSelectRoom = (room) => {
    const roomLink = `/room/${room.value}`;
    setLastSelect(roomLink);
    localStorage.setItem("LastSelect", roomLink);
  };

  const filteredRooms = rooms.filter((room) => {
    const roomName = room.name.toLowerCase();
    const searchQuery = searchRoom.toLowerCase();
    return roomName.startsWith(searchQuery);
  });

  return (
    <div
      id="dropdownRoom"
      className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700"
    >
      <div className="p-3">
        <label htmlFor="input-group-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
            id="input-group-search"
            autoComplete="off"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Wyszukaj salę"
            value={searchRoom}
            onChange={handleSearch}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownSearchRoom"
      >
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <li key={room.value}>
              <Link
                href={`/room/${room.value}`}
                className={`flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  lastSelect === `/room/${room.value}`
                    ? "bg-gray-100 dark:bg-gray-600"
                    : ""
                }`}
                onClick={() => handleSelectRoom(room)}
              >
                <p className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                  {room.name}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-2 py-1 text-center text-gray-500 dark:text-gray-400">
            Nie znaleziono takiej sali
          </li>
        )}
      </ul>
    </div>
  );
}

export default DropdownRoom;
