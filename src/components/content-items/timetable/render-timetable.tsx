import {
  MobileTimeTableSubstitutions,
  TimeTableSubstitutions,
} from "@/components/content-items/timetable/helpers";
import RenderLesson from "@/components/content-items/timetable/render-lesson";
import ShortHoursCalculator from "@/components/content-items/timetable/short-hours-calculator";
import {
  SettingsContext,
  SettingsContextType,
} from "@/components/setting-provider";
import { TimetableContext } from "@/components/timetable-provider";
import { ListLargeItem, ListRow, ListSmallItem } from "@/components/ui/list";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { days, getCurrentLesson } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext } from "react";
import CurrentLesson from "./current-lesson";
const ShortHoursButton = dynamic(
  () => import("@/components/content-items/timetable/short-hours-button"),
  {
    ssr: false,
  },
);

interface TimeTableProps {
  maxLessons: number;
}

interface TimeTableMobileProps {
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
}

const RenderTimeTable: React.FC<TimeTableProps> = ({ maxLessons }) => {
  const optivumTimetable = useContext(TimetableContext);
  const [hoursTime] = (useContext(SettingsContext) as SettingsContextType)
    .hoursTime;

  return (
    <Table className="hidden w-screen justify-center md:flex">
      <TableCaption className="gap-2">
        <div className="hidden md:block">
          <ShortHoursCalculator className="dark:!bg-[#171717] dark:hover:!bg-[#202020]" />
        </div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <ShortHoursButton />
        </div>
        <div className="inline-flex gap-1">
          <p className="text-lg font-normal text-gray-500 transition-all dark:text-gray-300 lg:text-xl">
            {optivumTimetable?.type}
          </p>
          {optivumTimetable?.title && (
            <>
              <p>/</p>
              <p className="text-lg font-bold text-gray-500 transition-all dark:text-gray-300 lg:text-xl">
                {optivumTimetable.title}
              </p>
            </>
          )}
        </div>
      </TableCaption>
      <TableHeader />
      {Object.entries(hoursTime).length > 1 ? (
        Object.entries(hoursTime)
          .map(([, value]) => value)
          .splice(0, maxLessons)
          .map((hour: hourType, lessonIndex: number) => {
            const { number: lessonNumber, timeFrom, timeTo } = hour;

            return (
              <tbody key={lessonIndex}>
                <TableRow
                  key={lessonIndex}
                  reverseColor={lessonIndex % 2 === 0}
                >
                  <TableCell variant="number">
                    <div className="flex flex-col items-center justify-center">
                      {lessonNumber}
                      {new Date().getDay() < 6 && new Date().getDay() != 0 && (
                        <CurrentLesson
                          className="mt-1"
                          timeFrom={timeFrom}
                          timeTo={timeTo}
                        />
                      )}
                    </div>
                  </TableCell>

                  <TableCell variant="number">
                    {timeFrom} - {timeTo}
                  </TableCell>

                  {optivumTimetable?.lessons?.map((day, dayIndex) => {
                    return (
                      <TableCell key={dayIndex}>
                        {day[lessonIndex]?.map((lesson, iterationIndex) => {
                          const { substitution, possibleSubstitution, sure } =
                            TimeTableSubstitutions(
                              dayIndex,
                              lessonIndex,
                              optivumTimetable.title,
                              optivumTimetable.substitutions.tables[0],
                              lesson,
                              iterationIndex,
                              day,
                              optivumTimetable.type,
                            );

                          return (
                            <RenderLesson
                              key={`t-${day}-${lessonIndex}-${iterationIndex}`}
                              substitution={substitution}
                              sure={sure}
                              possibleSubstitution={possibleSubstitution}
                              lesson={lesson}
                            />
                          );
                        })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </tbody>
            );
          })
      ) : (
        <tbody>
          <TableRow>
            <TableCell
              colSpan={7}
              scope="row"
              className="text-center font-semibold"
            >
              <p>Nie znaleziono żadnych lekcji</p>
            </TableCell>
          </TableRow>
        </tbody>
      )}
      <TableFooter>
        <TableRow
          reverseColor={
            Object.entries(optivumTimetable?.hours ?? 0).length % 2 == 0
          }
        >
          <TableCell
            colSpan={5}
            scope="row"
            className="!border-none font-semibold"
          >
            {optivumTimetable?.generatedDate &&
              `Wygenerowano: ${optivumTimetable?.generatedDate}`}{" "}
            {optivumTimetable?.validDate &&
              `Obowiązuje od: ${optivumTimetable?.validDate}`}
          </TableCell>
          <TableCell
            colSpan={2}
            scope="row"
            className="text-right font-semibold"
          >
            <Link
              prefetch={false}
              href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${optivumTimetable?.id}.html`}
              target="_blank"
              className="hover:underline"
            >
              Źródło danych
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

const RenderTimeTableMobile: React.FC<TimeTableMobileProps> = ({
  selectedDay,
  setSelectedDay,
}) => {
  const optivumTimetable = useContext(TimetableContext);
  const [hoursTime] = (useContext(SettingsContext) as SettingsContextType)
    .hoursTime;

  if (!Array.isArray(optivumTimetable?.lessons[selectedDay])) return null;

  let lastValidIndex = optivumTimetable.lessons[selectedDay].length - 1;
  while (
    lastValidIndex >= 0 &&
    optivumTimetable.lessons[selectedDay][lastValidIndex].length === 0
  ) {
    lastValidIndex--;
  }

  const newArrayLength = lastValidIndex + 1;

  return (
    <div className="mb-20" vaul-drawer-wrapper="">
      <div className="w-full py-2.5">
        <ul className="flex w-full items-center justify-around bg-[#F7F3F5] px-0.5 text-center text-sm font-medium text-gray-500 dark:bg-[#171717] dark:text-gray-400">
          {days.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedDay(item.index);
              }}
              className={`${
                item.index == selectedDay
                  ? "!bg-[#321c21] !text-white dark:!bg-[#303030]"
                  : "hover:bg-stone-200 dark:hover:bg-[#242424]"
              } mx-1 inline-block w-full cursor-pointer rounded-lg bg-white py-4 text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-transparent dark:bg-[#242424] dark:text-white`}
            >
              <p className="hidden min-w-full sm:block">{item.long}</p>
              <p className="block min-w-full sm:hidden">{item.short}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-screen min-h-[calc(100vh-196px)]">
        {Object.entries(hoursTime).length > 0 && newArrayLength > 0 ? (
          Object.entries(hoursTime)
            .map(([, value]) => value)
            .slice(0, newArrayLength)
            .map((hour: hourType, lessonIndex: number) => {
              const { number: lessonNumber, timeFrom, timeTo } = hour;

              return (
                <ListRow key={lessonIndex} reverseColor={lessonIndex % 2 == 0}>
                  <ListSmallItem className="gap-1">
                    <span className="block text-center font-bold">
                      {lessonNumber}
                    </span>
                    {getCurrentLesson(timeFrom, timeTo).isWithinTimeRange &&
                    new Date().getDay() < 6 &&
                    new Date().getDay() != 0 ? (
                      <div className="flex items-center justify-center">
                        <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                      </div>
                    ) : (
                      <span className="block text-center text-sm">
                        {timeFrom} - {timeTo}
                      </span>
                    )}
                  </ListSmallItem>

                  <ListLargeItem>
                    {optivumTimetable?.lessons[selectedDay][
                      lessonNumber - 1
                    ]?.map((day, iterationIndex) => {
                      const { substitution, possibleSubstitution, sure } =
                        MobileTimeTableSubstitutions(
                          selectedDay,
                          lessonIndex,
                          optivumTimetable.title,
                          optivumTimetable.substitutions.tables[0],
                          day,
                          iterationIndex,
                          lessonNumber,
                          optivumTimetable.lessons,
                          optivumTimetable.type,
                        );

                      return (
                        <RenderLesson
                          key={`mt-${day}-${lessonIndex}-${iterationIndex}`}
                          substitution={substitution}
                          sure={sure}
                          possibleSubstitution={possibleSubstitution}
                          lesson={day}
                        />
                      );
                    })}
                  </ListLargeItem>
                </ListRow>
              );
            })
        ) : (
          <ListRow>
            <ListLargeItem>
              <p className="text-center text-lg font-semibold">
                Nie znaleziono żadnych lekcji
              </p>
            </ListLargeItem>
          </ListRow>
        )}
      </div>
    </div>
  );
};

export { RenderTimeTable, RenderTimeTableMobile };
