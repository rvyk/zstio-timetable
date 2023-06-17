import React from "react";

function Jumbotron() {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 className="mb-4 transition-all text-4xl font-extrabold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-white">
        Plan lekcji ZSTIO
      </h1>
      <p className="mb-8 transition-all text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        Tutaj jaka klasa
      </p>

      <button
        id="dropdownSearchClass"
        data-dropdown-toggle="dropdownClass"
        data-dropdown-placement="bottom"
        className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-transparent dark:text-blue-600 hover:dark:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        type="button"
      >
        Oddział{" "}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <button
        id="dropdownSearchTeacher"
        data-dropdown-toggle="dropdownTeacher"
        data-dropdown-placement="bottom"
        className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-transparent dark:text-blue-600 hover:dark:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        type="button"
      >
        Nauczyciel{" "}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <button
        id="dropdownSearchRoom"
        data-dropdown-toggle="dropdownRoom"
        data-dropdown-placement="bottom"
        className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-transparent dark:text-blue-600 hover:dark:text-white dark:border-blue-600 dark:hover:bg-blue-700"
        type="button"
      >
        Sala{" "}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export default Jumbotron;
