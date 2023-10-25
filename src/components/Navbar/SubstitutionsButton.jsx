import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

function SubstitutionsButton() {
  return (
    <Link
      href={"https://zastepstwa.awfulworld.space/"}
      data-tooltip-id="navbar_tooltips"
      data-tooltip-content="Przejdź do zastępstw"
      className="flex transition-all items-center p-3 mr-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-[#2B161B] dark:focus:ring-gray-500 dark:bg-[#202020] focus:outline-none dark:text-gray-200 dark:border-[#202020] dark:hover:border-[#171717] dark:hover:text-white dark:hover:bg-[#171717] lg:dark:hover:bg-[#141414]"
    >
      <ArrowPathRoundedSquareIcon className="h-4 w-4 transition-none" />
    </Link>
  );
}

export default SubstitutionsButton;
