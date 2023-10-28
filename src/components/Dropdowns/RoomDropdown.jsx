import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLastSelect } from "@/utils/helpers";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function DropdownRoom({ rooms }) {
  const [searchRoom, setSearchRoom] = useState("");
  const [lastSelect, setLastSelect] = useState("");
  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    const lastSelect = getLastSelect(currentUrl);
    setLastSelect(lastSelect);
  }, [currentUrl]);

  const handleSearch = (event) => {
    setSearchRoom(event.target.value);
  };

  const handleSelectRoom = (room) => {
    document.getElementById("dropdownSearchRoom").click();
    const roomLink = `/room/${room.value}`;
    setLastSelect(roomLink);
    localStorage.setItem("LastSelect", roomLink);
  };

  const filteredRooms = rooms?.filter((room) => {
    const roomName = room.name.toLowerCase();
    const searchQuery = searchRoom.toLowerCase();
    return roomName.startsWith(searchQuery);
  });

  return (
    <div
      id="dropdownRoom"
      className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-[#161616]"
    >
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </div>
          <input
            type="text"
            id="input-group-search"
            autoComplete="off"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
            placeholder="Wyszukaj salę"
            value={searchRoom}
            onChange={handleSearch}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdownSearchRoom"
      >
        {filteredRooms?.length > 0 ? (
          filteredRooms.map((room) => (
            <li key={room.value}>
              <Link
                href={`/room/${room.value}`}
                className={`flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] ${
                  lastSelect === `/room/${room.value}`
                    ? "bg-gray-100 dark:bg-[#202020]"
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
