"use client";

import Loading from "@/components/jumbotron-items/loading";
import useBetterMediaQuery from "@/lib/useMediaQueryClient";
import zstioLogo192 from "@/media/icon-192x192.png";
import { OptivumTimetable } from "@/types/timetable";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import SubstitutionsDropdowns from "../jumbotron-items/substitutions-dropdowns";
import TimetableDropdowns from "../jumbotron-items/timetable-dropdowns";
import { TimetableContext } from "../timetable-provider";

const Jumbotron = () => {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";
  const isIndex = pathname === "/";
  const isMobile = useBetterMediaQuery("(max-width: 767.5px)");

  const optivumTimetable = useContext(TimetableContext);

  if (isMobile) return null;

  return (
    <div className="relative mx-auto max-w-screen-xl px-4 text-center">
      <div className="-ml-0 mb-4 flex flex-col items-center justify-center sm:-ml-16 sm:mb-0 sm:flex-row">
        <Link
          prefetch={false}
          href="https://zstiojar.edu.pl"
          className="relative z-30 mr-4 block h-20 w-20"
        >
          <Image
            alt="logo"
            src={zstioLogo192}
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
      <div className="grid gap-5">
        <JumbotronContent {...{ isIndex, isSubstitution, optivumTimetable }} />
        <JumbotronDropdowns
          {...{ isIndex, isSubstitution, optivumTimetable }}
        />
      </div>
    </div>
  );
};

interface JumbotronContentProps {
  isIndex: boolean;
  isSubstitution: boolean;
  optivumTimetable?: OptivumTimetable | null;
}

const JumbotronContent: React.FC<JumbotronContentProps> = ({
  isIndex,
  isSubstitution,
  optivumTimetable,
}) => {
  if (isIndex) return null;

  const substitutionsText =
    isSubstitution && optivumTimetable?.substitutions.timeRange
      ? optivumTimetable?.substitutions.timeRange
      : "Wystąpił błąd podczas pobierania zastępstw";

  const timeTableText =
    !isSubstitution && optivumTimetable?.title
      ? `${optivumTimetable?.type}`
      : `Nie znaleziono pasującego planu lekcji`;

  return (
    <div className="hidden flex-wrap items-center justify-center gap-1 text-xl text-gray-500 transition-all dark:text-gray-400 md:flex lg:text-2xl">
      <p className="font-normal">
        {!isSubstitution ? timeTableText : substitutionsText}
      </p>
      {!isSubstitution && (
        <>
          <p>/</p>
          <p className="font-bold">{optivumTimetable?.title}</p>
        </>
      )}
    </div>
  );
};

interface JumbotronDropdownsProps {
  isIndex: boolean;
  isSubstitution: boolean;
}

const JumbotronDropdowns: React.FC<JumbotronDropdownsProps> = ({
  isIndex,
  isSubstitution,
}) => {
  if (isIndex) return <Loading />;
  if (isSubstitution) {
    return <SubstitutionsDropdowns />;
  }
  return <TimetableDropdowns />;
};

export default Jumbotron;
