import React from "react";
import Navbar from "../Navbar";
import Link from "next/link";
import ShortHours from "../Table/ShortHours";
import Image from "next/legacy/image";

function RenderNavbar({ isShortHours, setIsShortHours }) {
  return (
    <div className="flex items-center w-full bg-zinc-50 dark:bg-[#2b2b2b]">
      <div className="ml-2 flex justify-center items-center mx-4">
        <Link href={"https://zstiojar.edu.pl"}>
          <div className="relative w-12 h-12 mr-2 object-contain">
            <Image
              alt="logo"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              src={"/icon-152x152.png"}
            />
          </div>
        </Link>
      </div>
      <div className="inline-flex rounded-md shadow-sm mr-2" role="group">
        <ShortHours
          setIsShortHours={setIsShortHours}
          isShortHours={isShortHours}
        />
      </div>

      <Navbar />
    </div>
  );
}

export default RenderNavbar;
