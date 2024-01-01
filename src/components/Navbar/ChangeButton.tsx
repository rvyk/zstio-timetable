import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

function ChangeButton({ inTimetable }: { inTimetable: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (inTimetable) {
          router.replace("/zastepstwa");
        } else {
          const lastSelect = localStorage.getItem("LastSelect");
          lastSelect ? router.replace(lastSelect) : router.replace("/class/1");
        }
      }}
      data-tooltip-id="navbar_tooltips"
      data-tooltip-content={
        inTimetable ? "Przejdź do zastępstw" : "Przejdź do planu lekcji"
      }
      className="flex transition-all items-center p-3 mr-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-[#2B161B] dark:focus:ring-gray-500 dark:bg-[#202020] focus:outline-none dark:text-gray-200 dark:border-[#202020] dark:hover:border-[#171717] dark:hover:text-white dark:hover:bg-[#171717] lg:dark:hover:bg-[#141414]"
    >
      {inTimetable ? (
        <ArrowPathRoundedSquareIcon className="h-4 w-4 transition-none" />
      ) : (
        <CalendarDaysIcon className="h-4 w-4 transition-none" />
      )}
    </button>
  );
}

export default ChangeButton;
