"use client";

import useBetterMediaQuery from "@/lib/useMediaQueryClient";
import Link from "next/link";
import React from "react";

const Footer: React.FC<{ renderInMobile?: boolean }> = ({
  renderInMobile = true,
}) => {
  const isMobile = useBetterMediaQuery("(max-width: 767.5px)");

  if (!renderInMobile && isMobile) return null;
  return (
    <footer className="mt-2 flex w-full items-center justify-center pb-8 md:mt-0">
      <div className="mx-auto w-[90%] rounded-lg bg-[#2B161B] p-4 shadow dark:bg-[#202020] sm:w-auto">
        <span className="block text-center text-sm text-[#ffffff] dark:text-gray-400">
          © {new Date().getFullYear()}
          <span className="ml-1 tracking-wide">
            Made with ❤️ for ZSTiO by Szymański Paweł & Majcher Kacper
            <br />
            <Link
              prefetch={false}
              target="_blank"
              href={"https://github.com/rvyk/zstio-timetable/"}
            >
              GitHub (GPLv3)
            </Link>
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
