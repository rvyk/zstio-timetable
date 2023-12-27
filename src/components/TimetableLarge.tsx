import React from "react";
import { Tooltip } from "react-tooltip";
import RenderTableHeader from "./Timetable/RenderTableHeader";
import RenderTableFooter from "./Timetable/RenderTableFooter";
import RenderTableRow from "./Timetable/RenderTableRow";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ShortHours from "./Table/ShortHours";
import { useRouter } from "next/router";
import LoadingTable from "./Table/LoadingTable";

function TimetableLarge({ isShortHours, setIsShortHours, ...props }) {
  const { isReady } = useRouter();

  let {
    status = false,
    text = "",
    timeTableID = "",
    timeTable: {
      hours = {},
      generatedDate = "",
      title = "",
      validDate = "",
      lessons = [[], [], [], [], []],
    } = {},
  } = props;

  if (!isReady) {
    return <LoadingTable small={false} />;
  }

  return (
    <>
      {typeof hours == "object" && (
        <div
          id="timetable"
          className="relative overflow-x-auto shadow-md md:rounded-xl w-[90%] transition-all duration-100"
        >
          <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-300">
            <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-gray-300 dark:bg-[#202020]">
              {!status ? (
                <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-400">
                  Nie znaleziono pasującego planu lekcji
                </p>
              ) : (
                <>
                  {title && text.length ? (
                    <div className="flex items-center">
                      <div
                        className="inline-flex rounded-md shadow-sm mr-2"
                        role="group"
                      >
                        <ShortHours
                          setIsShortHours={setIsShortHours}
                          isShortHours={isShortHours}
                        />
                      </div>
                      <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-300">
                        {text} /
                      </p>
                      <p className="transition-all text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-300">
                        {title}
                      </p>
                    </div>
                  ) : (
                    <div
                      role="status"
                      className="transition-all lg:text-xl w-full flex items-center"
                    >
                      <ArrowPathIcon className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-300 fill-[#2B161B] dark:fill-[#171717]" />
                    </div>
                  )}
                </>
              )}
            </caption>

            <RenderTableHeader />
            <RenderTableRow
              hours={hours}
              isShortHours={isShortHours}
              lessons={lessons}
              substitutions={props.substitutions}
            />
            <RenderTableFooter
              status={status}
              hours={hours}
              validDate={validDate}
              generatedDate={generatedDate}
              timeTableID={timeTableID}
            />
          </table>
        </div>
      )}
      <Tooltip
        id="content_tooltips"
        className="!bg-[#2B161B] dark:!text-gray-300 dark:!bg-[#161616] text-center"
      />
    </>
  );
}

export default TimetableLarge;
