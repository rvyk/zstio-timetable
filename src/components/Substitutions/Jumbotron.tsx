import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";
import Event from "@/components/Event";

function Jumbotron({ props }) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
      <div className="flex justify-center items-center mb-4 md:mb-0 -ml-0 md:-ml-16">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 mr-4 hidden md:block"
        >
          <Event />
          <Image
            alt="logo"
            src={"/icon-192x192.png"}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
        <h1 className="transition-all text-5xl font-bold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-gray-100">
          Zastępstwa <span className="font-extrabold">ZSTiO</span>
        </h1>
      </div>
      <p className="md:my-4 mb-2 transition-all text-xl font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        {props?.message ? props?.message : props?.form?.time}
      </p>
      {props?.form?.tables?.length > 0 && (
        <>
          <button
            id="dropdownSearchBranch"
            data-dropdown-toggle="dropdownBranch"
            data-dropdown-placement="bottom"
            className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              ></path>
            </svg>
            Filtruj wg. oddziałów{" "}
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
            className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              ></path>
            </svg>
            Filtruj wg. nauczycieli{" "}
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
