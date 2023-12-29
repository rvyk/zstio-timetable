import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";
import Event from "@/components/Event";
import {
  ChevronDownIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const buttons = [
  {
    id: "dropdownSearchBranch",
    dropdownToggle: "dropdownBranch",
    dropdownPlacement: "bottom",
    text: "Filtruj wg. oddziałów",
    icon: UserGroupIcon,
  },
  {
    id: "dropdownSearchTeacher",
    dropdownToggle: "dropdownTeacher",
    dropdownPlacement: "bottom",
    text: "Filtruj wg. nauczycieli",
    icon: UserCircleIcon,
  },
];

const ButtonComponent = ({
  id,
  dropdownToggle,
  dropdownPlacement,
  text,
  icon: Icon,
}) => (
  <button
    id={id}
    data-dropdown-toggle={dropdownToggle}
    data-dropdown-placement={dropdownPlacement}
    className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
    type="button"
  >
    <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
    {text}
    <ChevronDownIcon className="w-4 h-4 ml-2" aria-hidden="true" />
  </button>
);

function Jumbotron({ props }: { props: props }) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
      <div className="flex justify-center items-center mb-4 md:mb-0 -ml-0 md:-ml-16">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 mr-4 hidden md:block z-30"
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
        {props?.substitutions?.status
          ? props?.substitutions?.timeRange
          : "Wystąpił błąd podczas pobierania danych"}
      </p>
      {props?.substitutions?.tables?.length > 0 && (
        <>
          {buttons.map((button) => (
            <ButtonComponent key={button.id} {...button} />
          ))}
        </>
      )}
    </div>
  );
}

export default Jumbotron;
