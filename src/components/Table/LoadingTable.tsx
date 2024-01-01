import { ArrowPathIcon } from "@heroicons/react/24/outline";
import RenderTableHeader from "../Timetable/RenderTableHeader";

function LoadingTable({ small }: { small: boolean }) {
  if (small) {
    return (
      <div className="h-screen w-full flex justify-center items-center flex-col">
        <ArrowPathIcon className="w-7 h-7 lg:w-10 lg:h-10 mr-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto shadow-md md:rounded-xl w-[90%] transition-all duration-100">
      <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-300 ">
        <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-gray-300 dark:bg-[#202020]">
          <ArrowPathIcon className="w-7 h-7 mr-2 animate-spin" />
        </caption>
        <RenderTableHeader />
        <tbody className="transition-all">
          {[...Array(8)].map((_, index) => (
            <tr
              className={`text-gray-600 dark:text-gray-300 border-b ${
                index % 2 === 0
                  ? "bg-white dark:bg-[#191919]"
                  : "bg-gray-50 dark:bg-[#202020]"
              } dark:border-[#181818] `}
              key={index}
            >
              {[...Array(7)].map((_, index) => (
                <td
                  key={index}
                  className="px-6 py-4 break-words w-16 border-r last:border-none font-semibold dark:border-[#171717]"
                >
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-[#292929] mb-2.5"></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoadingTable;
