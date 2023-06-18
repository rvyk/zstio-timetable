import React from "react";

function Jumbotron({ title, text }) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 className="mb-4 transition-all text-4xl font-extrabold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-white">
        Plan lekcji ZSTIO
      </h1>
      {title && text.length > 0 ? (
        <div className="flex justify-center mb-4 flex-wrap items-center ">
          <p className="transition-all text-lg font-normal mr-1 hidden sm:flex text-gray-500 lg:text-xl dark:text-gray-400">
            {text} /
          </p>
          <p className="transition-all text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-400">
            {title}
          </p>
        </div>
      ) : (
        <div
          role="status"
          className="mb-4 transition-all lg:text-xl w-full flex justify-center"
        >
          <svg
            aria-hidden="true"
            className="w-7 h-7 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#2B161B] dark:fill-blue-800"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {title && (
        <>
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
        </>
      )}
    </div>
  );
}

export default Jumbotron;
