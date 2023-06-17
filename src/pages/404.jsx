import React, { useEffect, useState } from "react";
import ThemeChanger from "./components/ThemeChanger";
import Link from "next/link";
function NotFound() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  return (
    <>
      <ThemeChanger />
      <section className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 transition-all">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl text-[#2B161B] tracking-tight font-extrabold lg:text-9xl dark:text-white">
              404
            </h1>
            <p class="mb-4 text-5xl tracking-tight font-bold md:text-4xl dark:text-white text-[#2B161B]">
              Strona, której szukasz nie istnieje, przepraszamy.
            </p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400 transition-all">
              Strona{" "}
              <span class="bg-gray-200 text-gray-800 transition-all text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                {currentPath}
              </span>{" "}
              nie istnieje, czy na pewno wpisałeś dobry adres?
            </p>
            <Link
              href={"/"}
              className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-transparent dark:text-blue-600 hover:dark:text-white dark:border-blue-600 dark:hover:bg-blue-700"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 mr-2 -ml-1"
                fill="currentColor"
                viewBox="0 0 448 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
              Wróć na stronę główną
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
