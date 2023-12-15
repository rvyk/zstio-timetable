import React from "react";
import Navbar from "../Navbar";
import ShortHours from "../Table/ShortHours";

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

      <Navbar
        inTimetable={true}
        searchDialog={searchDialog}
        setSearchDialog={setSearchDialog}
        isSnowing={false}
        setIsSnowing={() => {}}
      />
    </div>
  );
}

export default RenderNavbar;
