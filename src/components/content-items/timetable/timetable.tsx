import RenderLesson from "@/components/content-items/timetable/render-lesson";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortHours } from "@/lib/utils";
import { Table as TableType } from "@/types/timetable";
import Link from "next/link";

interface TimetableProps {
  timeTable: TableType["timeTable"];
  substitutions: TableType["substitutions"];
  isShortHours: boolean;
}

function Timetable({ timeTable, substitutions, isShortHours }: TimetableProps) {
  return (
    <Table>
      <TableCaption status={timeTable.status}>
        <div className="inline-flex rounded-md shadow-sm mr-2" role="group">
          {/* <ShortHours
                        setIsShortHours={setIsShortHours}
                        isShortHours={isShortHours}
                    /> */}
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
        Object.entries(isShortHours ? shortHours : timeTable.data?.hours)?.map(
          ([key, hour]: [string, hourType], lessonIndex) => {
            const { number, timeFrom, timeTo } = hour;

            return (
              <tbody key={lessonIndex}>
                <TableRow index={lessonIndex}>
                  <TableCell variant="number">
                    <div className="flex justify-center items-center flex-col">
                      {number}
                      {/* {new Date().getDay() < 6 && new Date().getDay() != 0 && (
                      <CurrentLesson timeFrom={timeFrom} timeTo={timeTo} />
                    )} */}
                    </div>
                  </TableCell>

                  <TableCell variant="number">
                    {timeFrom} - {timeTo}
                  </TableCell>

                  {timeTable.data?.lessons.map((day, index) => {
                    return (
                      <TableCell key={index}>
                        <RenderLesson
                          className={timeTable.data?.title}
                          day={day}
                          dayIndex={index}
                          lessonIndex={lessonIndex}
                          substitutions={substitutions.tables[0]}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              </tbody>
            );
          },
        )
      ) : (
        <TableRow>
          <TableCell>
            <p> Nie znaleziono żadnych lekcji</p>
          </TableCell>
        </TableRow>
      )}
      <TableFooter hours={timeTable.data.hours}>
        <TableRow>
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
            className="font-semibold text-right "
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
}

export default Timetable;
