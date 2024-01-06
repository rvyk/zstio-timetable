import Loading from "@/components/jumbotron-items/loading";
import SubstitutionsDropdowns from "@/components/jumbotron-items/substitutions-dropdowns";
import TimetableDropdowns from "@/components/jumbotron-items/timetable-dropdowns";
import { Table } from "@/types/timetable";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Jumbotron: React.FC<Table> = ({
  substitutions,
  timeTableList,
  timeTable,
}) => {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";
  const isIndex = pathname === "/";

  const renderContent = () => {
    if (isIndex) return null;

    const substitutionsText =
      isSubstitution && substitutions.status
        ? substitutions?.timeRange
        : "Wystąpił błąd podczas pobierania zastępstw";

    const timeTableText =
      !isSubstitution && timeTable.status
        ? `${timeTable.data.text} /`
        : `Nie znaleziono pasującego planu lekcji`;

    return (
      <div className="flex justify-center mb-5 flex-wrap items-center ">
        <p className="transition-all text-xl font-normal mr-1 hidden sm:flex text-gray-500 lg:text-2xl dark:text-gray-400">
          {!isSubstitution ? timeTableText : substitutionsText}
        </p>
        {!isSubstitution && timeTable.status && (
          <p className="transition-all text-xl font-bold text-gray-500 lg:text-2xl dark:text-gray-400">
            {timeTable.data.title}
          </p>
        )}
      </div>
    );
  };

  const renderDropdowns = () => {
    if (isIndex) return <Loading />;
    if (isSubstitution && substitutions.status) {
      return <SubstitutionsDropdowns substitutions={substitutions} />;
    }
    return <TimetableDropdowns timeTableList={timeTableList} />;
  };

  return (
    <div className="py-8 relative px-4 mx-auto max-w-screen-xl text-center">
      <div className="flex justify-center items-center flex-col sm:flex-row mb-4 sm:mb-0 -ml-0 sm:-ml-16">
        <Link
          prefetch={false}
          href="https://zstiojar.edu.pl"
          className="relative w-20 h-20 mr-4 block z-30"
        >
          <Image
            alt="logo"
            src="/icon-192x192.png"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
        <h1 className="transition-all text-5xl font-bold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-gray-100">
          {isSubstitution ? "Zastępstwa " : "Plan lekcji "}
          <span className="font-extrabold">ZSTiO</span>
        </h1>
      </div>
      {renderContent()}
      {renderDropdowns()}
    </div>
  );
};

export default Jumbotron;
