import Loading from "@/components/jumbotron-items/loading";
import SubstitutionsDropdowns from "@/components/jumbotron-items/substitutions-dropdowns";
import TimetableDropdowns from "@/components/jumbotron-items/timetable-dropdowns";
import { TimeTableData } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Jumbotron({
  substitutions,
  timeTableList,
  timeTable,
}: {
  substitutions: Substitutions;
  timeTableList: List;
  timeTable: TimeTableData;
}) {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";
  const isIndex = pathname === "/";

  return (
    <div className="py-8 relative px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <div className="flex justify-center items-center flex-col sm:flex-row mb-4 sm:mb-0 -ml-0 sm:-ml-16">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 mr-4 block z-30"
        >
          <Image
            alt="logo"
            src={"/icon-192x192.png"}
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
      {!isIndex && (
        <div className="flex justify-center mb-5 flex-wrap items-center ">
          <p className="transition-all text-xl font-normal mr-1 hidden sm:flex text-gray-500 lg:text-2xl dark:text-gray-400">
            {isSubstitution ? substitutions?.timeRange : `${timeTable?.text} /`}
          </p>
          {!isSubstitution && (
            <p className="transition-all text-xl font-bold text-gray-500 lg:text-2xl dark:text-gray-400">
              {timeTable?.title}
            </p>
          )}
        </div>
      )}
      {isIndex && <Loading />}
      {isSubstitution ? (
        <SubstitutionsDropdowns substitutions={substitutions} />
      ) : (
        !isIndex && <TimetableDropdowns timeTableList={timeTableList} />
      )}
    </div>
  );
}

export default Jumbotron;
