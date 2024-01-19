import {
  MobileTimeTableSubstitutions,
  TimeTableSubstitutions,
} from "@/components/content-items/timetable/helpers";
import RenderLesson from "@/components/content-items/timetable/render-lesson";
import ShortHoursButton from "@/components/content-items/timetable/short-hours-button";
import ShortHoursCalculator from "@/components/content-items/timetable/short-hours-calculator";
import {
  SettingsContext,
  SettingsContextType,
} from "@/components/setting-context";
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
import { Table as TableType } from "@/types/timetable";
import Link from "next/link";
import { useContext } from "react";
import CurrentLesson from "./current-lesson";

interface TimeTableProps {
  timeTable: TableType["timeTable"];
  substitutions: TableType["substitutions"];
  maxLessons: number;
}

interface TimeTableMobileProps extends TimeTableProps {
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
}

const RenderTimeTable: React.FC<TimeTableProps> = ({
  timeTable,
  maxLessons,
  substitutions,
}) => {
  const [hoursTime] = (useContext(SettingsContext) as SettingsContextType)
    .hoursTime;

  return (
    <Table className="hidden justify-center md:flex">
      <TableCaption status={timeTable.status}>
        <div className="hidden md:block ">
          <ShortHoursCalculator className="dark:!bg-[#171717] dark:hover:!bg-[#202020]" />
        </div>
        <div className="mr-2 inline-flex rounded-md shadow-sm" role="group">
          <ShortHoursButton />
        </div>
        <p className="mr-1 text-lg font-normal text-gray-500 transition-all dark:text-gray-300 lg:text-xl">
          {timeTable?.data?.text} /
        </p>
        <p className="text-lg font-bold text-gray-500 transition-all dark:text-gray-300 lg:text-xl">
          {timeTable?.data?.title}
        </p>
      </TableCaption>
      <TableHeader />
      {Object.entries(hoursTime).length > 1 ? (
        Object.entries(hoursTime)
          .map(([_, value]) => value)
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

                  {timeTable.data?.lessons?.map((day, dayIndex) => {
                    return (
                      <TableCell key={dayIndex}>
                        {day[lessonIndex]?.map((lesson, iterationIndex) => {
                          const { substitution, possibleSubstitution, sure } =
                            TimeTableSubstitutions(
                              dayIndex,
                              lessonIndex,
                              timeTable.data.title,
                              substitutions.tables[0],
                              lesson,
                              iterationIndex,
                              day,
                              timeTable.data.text,
                            );

                          return (
                            <RenderLesson
                              key={`t-${day}-${lessonIndex}-${iterationIndex}`}
                              lessonIndex={lessonIndex}
                              day={day}
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
          reverseColor={Object.entries(timeTable.data.hours).length % 2 == 0}
        >
          {timeTable.status && (
            <TableCell
              colSpan={5}
              scope="row"
              className="!border-none font-semibold"
            >
              {timeTable.data.generatedDate &&
                `Wygenerowano: ${timeTable.data.generatedDate}`}{" "}
              {timeTable.data.validDate &&
                `Obowiązuje od: ${timeTable.data.validDate}`}
            </TableCell>
          )}
          <TableCell
            colSpan={!timeTable.status ? 7 : 2}
            scope="row"
            className="text-right font-semibold"
          >
            <Link
              prefetch={false}
              href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${timeTable.data.id}.html`}
              target="_blank"
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
  maxLessons,
  substitutions,
  timeTable,
  selectedDay,
  setSelectedDay,
}) => {
  const [hoursTime] = (useContext(SettingsContext) as SettingsContextType)
    .hoursTime;
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

      <div className="min-w-full">
        {timeTable.status && Object.entries(hoursTime).length > 1 ? (
          Object.entries(hoursTime)
            .map(([_, value]) => value)
            .splice(0, maxLessons)
            .map((hour: hourType, lessonIndex: number) => {
              const { number: lessonNumber, timeFrom, timeTo } = hour;

              return (
                <ListRow key={lessonIndex} reverseColor={lessonIndex % 2 == 0}>
                  <ListSmallItem>
                    <span className="mb-1 block text-center font-bold">
                      {lessonNumber}
                    </span>
                    {getCurrentLesson(timeFrom, timeTo).isWithinTimeRange ? (
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
                    {timeTable.data?.lessons[selectedDay][
                      lessonNumber - 1
                    ]?.map((day, iterationIndex) => {
                      const { substitution, possibleSubstitution, sure } =
                        MobileTimeTableSubstitutions(
                          selectedDay,
                          lessonIndex,
                          timeTable.data.title,
                          substitutions.tables[0],
                          day,
                          iterationIndex,
                          lessonNumber,
                          timeTable.data.lessons,
                          timeTable.data.text,
                        );

                      return (
                        <RenderLesson
                          key={`mt-${day}-${lessonIndex}-${iterationIndex}`}
                          lessonIndex={lessonIndex}
                          day={day}
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
