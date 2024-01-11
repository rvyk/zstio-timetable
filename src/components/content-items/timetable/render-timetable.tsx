import {
  MobileTimeTableSubstitutions,
  TimeTableSubstitutions,
} from "@/components/content-items/timetable/helpers";
import RenderLesson from "@/components/content-items/timetable/render-lesson";
import ShortHoursButton from "@/components/content-items/timetable/short-hours-button";
import { ListLargeItem, ListRow, ListSmallItem } from "@/components/ui/list";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { days, shortHours } from "@/lib/utils";
import { Table as TableType } from "@/types/timetable";
import Link from "next/link";

interface TimeTableProps {
  timeTable: TableType["timeTable"];
  substitutions: TableType["substitutions"];
  isShortHours: boolean;
  setIsShortHours: React.Dispatch<React.SetStateAction<boolean>>;
  maxLessons: number;
}

interface TimeTableMobileProps extends TimeTableProps {
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
}

const RenderTimeTable: React.FC<TimeTableProps> = ({
  timeTable,
  isShortHours,
  setIsShortHours,
  maxLessons,
  substitutions,
}) => {
  return (
    <Table className="hidden md:flex justify-center">
      <TableCaption status={timeTable.status}>
        <div className="inline-flex rounded-md shadow-sm mr-2" role="group">
          <ShortHoursButton {...{ isShortHours, setIsShortHours }} />
        </div>
        <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-300">
          {timeTable?.data?.text} /
        </p>
        <p className="transition-all text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-300">
          {timeTable?.data?.title}
        </p>
      </TableCaption>
      <TableHeader />
      {Object.entries(timeTable.data?.hours).length > 1 ? (
        Object.entries(
          isShortHours
            ? shortHours.slice(0, maxLessons)
            : timeTable.data?.hours,
        )?.map(([key, hour]: [string, hourType], lessonIndex) => {
          const { number: lessonNumber, timeFrom, timeTo } = hour;

          return (
            <tbody key={lessonIndex}>
              <TableRow key={lessonIndex} reverseColor={lessonIndex % 2 === 0}>
                <TableCell variant="number">
                  <div className="flex justify-center items-center flex-col">
                    {lessonNumber}
                    {/* {new Date().getDay() < 6 && new Date().getDay() != 0 && (
                      <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                    )} */}
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
              className="font-semibold !border-none"
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
            className="font-semibold text-right"
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
  isShortHours,
  maxLessons,
  setIsShortHours,
  substitutions,
  timeTable,
  selectedDay,
  setSelectedDay,
}) => {
  return (
    <div className="min-h-screen">
      <div className="w-full py-2.5">
        <ul className="w-full px-0.5 text-sm dark:bg-[#171717] bg-[#F7F3F5] font-medium text-center text-gray-500 flex justify-around items-center dark:text-gray-400">
          {days.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedDay(item.index);
              }}
              className={`${
                item.index == selectedDay
                  ? "!bg-[#321c21] dark:!bg-[#303030] !text-white"
                  : "hover:bg-gray-100 dark:hover:bg-[#242424]"
              } transition-all w-full mx-1 inline-block cursor-pointer shadow-sm py-4 rounded-lg text-gray-900 bg-white focus:ring-transparent focus:outline-none dark:bg-[#242424] dark:text-white`}
            >
              <p className="hidden sm:block min-w-full">{item.long}</p>
              <p className="block sm:hidden min-w-full">{item.short}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-full">
        {timeTable.status &&
        Object.entries(timeTable.data?.hours).length > 1 ? (
          Object.entries(
            isShortHours
              ? shortHours.slice(0, maxLessons)
              : timeTable.data?.hours,
          )?.map(([key, hour]: [string, hourType], lessonIndex) => {
            const { number: lessonNumber, timeFrom, timeTo } = hour;

            return (
              <ListRow key={lessonIndex} reverseColor={lessonIndex % 2 == 0}>
                <ListSmallItem>
                  <span className="block text-center font-bold mb-1">
                    {lessonNumber}
                  </span>
                  <span className="block text-center text-sm">
                    {timeFrom} - {timeTo}
                    {/* {selectedDay == new Date().getDay() - 1 && (
                      <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                    )} */}
                  </span>
                </ListSmallItem>

                <ListLargeItem>
                  {timeTable.data?.lessons[selectedDay][lessonNumber - 1]?.map(
                    (day, iterationIndex) => {
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
                    },
                  )}
                </ListLargeItem>
              </ListRow>
            );
          })
        ) : (
          <ListRow>
            <ListLargeItem>
              <p className="font-semibold text-lg text-center">
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
