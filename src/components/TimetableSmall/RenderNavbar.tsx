import React from "react";
import Navbar from "../Navbar";
import Link from "next/link";
import ShortHours from "../Table/ShortHours";
import Image from "next/legacy/image";

function RenderNavbar({
  isShortHours,
  setIsShortHours,
  searchDialog,
  setSearchDialog,
}) {
  return (
    <div className="flex items-center w-full bg-zinc-50 dark:bg-[#2b2b2b]">
      <div className="inline-flex rounded-md shadow-sm ml-4" role="group">
        <ShortHours
          setIsShortHours={setIsShortHours}
          isShortHours={isShortHours}
        />
      </div>

      <Navbar searchDialog={searchDialog} setSearchDialog={setSearchDialog} />
    </div>
  );
}

export default RenderNavbar;
