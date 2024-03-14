"use client";

import Loading from "@/components/jumbotron-items/loading";
import SubstitutionsDropdowns from "@/components/jumbotron-items/substitutions-dropdowns";
import TimetableDropdowns from "@/components/jumbotron-items/timetable-dropdowns";
import { Table } from "@/types/timetable";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface JumbotronProps {
  substitutions: Table["substitutions"];
  timeTableList: Table["timeTableList"];
  timeTable: Table["timeTable"];
  errorMsg?: string;
}

const Jumbotron: React.FC<JumbotronProps> = ({
  substitutions,
  timeTableList,
  timeTable,
  errorMsg,
}) => {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";
  const isIndex = pathname === "/";

  return (
    <div
      className={`relative mx-auto max-w-screen-xl px-4 py-8 text-center ${
        !isIndex && !errorMsg && "hidden md:block"
      }`}
    >
      <div className="-ml-0 mb-4 flex flex-col items-center justify-center sm:-ml-16 sm:mb-0 sm:flex-row">
        <Link
          prefetch={false}
          href="https://zstiojar.edu.pl"
          className="relative z-30 mr-4 block h-20 w-20"
        >
          <Image
            alt="logo"
            src="/icon-192x192.png"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
        </Link>
        <h1 className="text-5xl font-bold leading-none tracking-tight text-[#2B161B] transition-all dark:text-gray-100 md:text-5xl lg:text-6xl">
          {isSubstitution ? "Zastępstwa " : "Plan lekcji "}
          <span className="font-extrabold">ZSTiO</span>
        </h1>
      </div>
      <JumbotronContent
        {...{ isIndex, isSubstitution, substitutions, timeTable, errorMsg }}
      />
      <JumbotronDropdowns
        {...{ isIndex, isSubstitution, substitutions, timeTableList, errorMsg }}
      />
    </div>
  );
};

interface JumbotronContentProps {
  isIndex: boolean;
  isSubstitution: boolean;
  substitutions: Table["substitutions"];
  timeTable: Table["timeTable"];
  errorMsg?: string;
}

const JumbotronContent: React.FC<JumbotronContentProps> = ({
  isIndex,
  isSubstitution,
  substitutions,
  timeTable,
  errorMsg,
}) => {
  if (isIndex) return null;

  if (errorMsg) {
    return (
      <div className="mb-5 flex flex-col flex-wrap items-center justify-center">
        <p className="mr-1 text-xl font-semibold text-gray-600 dark:text-gray-300 lg:text-2xl">
          {errorMsg}
        </p>
        <p className="text-gray-600 dark:text-gray-300 lg:text-lg">
          Spróbuj odświeżyć stronę lub zrób zrzut ekranu konsoli (klawisz F12) i
          zgłoś ten błąd na platformie Github lub Vulcan.
        </p>
      </div>
    );
  }

  const substitutionsText =
    isSubstitution && substitutions.status
      ? substitutions?.timeRange
      : "Wystąpił błąd podczas pobierania zastępstw";

  const timeTableText =
    !isSubstitution && timeTable?.status
      ? `${timeTable.data.text} /`
      : `Nie znaleziono pasującego planu lekcji`;

  return (
    <div className="mb-5 hidden flex-wrap items-center justify-center md:flex ">
      <p className="mr-1 text-xl font-normal text-gray-500 transition-all dark:text-gray-400 lg:text-2xl">
        {!isSubstitution ? timeTableText : substitutionsText}
      </p>
      {!isSubstitution && timeTable?.status && (
        <p className="text-xl font-bold text-gray-500 transition-all dark:text-gray-400 lg:text-2xl">
          {timeTable.data.title}
        </p>
      )}
    </div>
  );
};

interface JumbotronDropdownsProps {
  isIndex: boolean;
  isSubstitution: boolean;
  substitutions: Table["substitutions"];
  timeTableList: Table["timeTableList"];
  errorMsg?: string;
}

const JumbotronDropdowns: React.FC<JumbotronDropdownsProps> = ({
  isIndex,
  isSubstitution,
  substitutions,
  timeTableList,
  errorMsg,
}) => {
  if (isIndex) return <Loading />;
  if (errorMsg) return null;
  if (isSubstitution && substitutions.status) {
    return <SubstitutionsDropdowns substitutions={substitutions} />;
  }
  return (
    <TimetableDropdowns
      timeTableList={timeTableList || { classes: [], rooms: [], teachers: [] }}
    />
  );
};

export default Jumbotron;
