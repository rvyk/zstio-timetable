import { useTheme } from "next-themes";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
function Footer({ small }) {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {resolvedTheme !== undefined && !small && (
        <div className="-mb-2">
          <Link
            href="https://skillhost.pl/?pk_source=plan-lekcji"
            target="_blank"
          >
            <img
              src={
                resolvedTheme == "dark" ? "/skill-dark.png" : "/skill-light.png"
              }
              className="h-24"
              alt="skill-host-logo"
            />
          </Link>
        </div>
      )}
      <footer
        className={`rounded-lg shadow m-4 ${
          small && "flex justify-center items-center"
        } w-[90%] sm:w-auto dark:bg-[#202020] transition-all bg-[#2B161B]`}
      >
        {small && (
          <a
            href="https://skillhost.pl/?pk_source=plan-lekcji"
            target="_blank"
            className="relative h-20 w-28 ml-2 -mr-4"
          >
            <Image
              layout="fill"
              objectPosition="center"
              objectFit="contain"
              src="/transparent_skillhost.png"
              alt="skill-host-logo"
            />
          </a>
        )}
        <div className="max-w-screen mx-auto p-4 transition-all">
          <span className="text-sm text-[#ffffff] block text-center dark:text-gray-400">
            © {new Date().getFullYear()}
            <span className="ml-1 tracking-wide">
              Made with ❤️ for ZSTiO by Szymański Paweł & Majcher Kacper
              <br />
              <Link
                target="_blank"
                href={"https://github.com/rvyk/zstio-timetable/"}
              >
                GitHub (GPLv3)
              </Link>
            </span>
          </span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
