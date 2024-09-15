import { OptivumTimetable } from "@/types/optivum";
import { TableHeader, TableHourCell, TableLessonCell } from "./ui/table";

export const Timetable: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable }) => {
  //   const maxLessons =
  //     Math.max(
  //       Object.entries(timetable?.hours || {}).length,
  //       ...(timetable?.lessons ?? []).map((day) => day.length),
  //     ) || 0;

  return (
    <div className="h-fit w-full overflow-hidden rounded-md border border-lines bg-foreground">
      <div className="h-full w-full overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-lines border-b border-lines">
              {/* TODO: ADD SUPPORT FOR SWITCHER / CREATE A SWITCHER COMPONENT */}
              <th className="min-w-32">SWITCHER</th>
              {timetable?.dayNames.map((dayName) => (
                <TableHeader key={dayName} dayName={dayName} />
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(timetable?.hours || {})
              .map(([, value]) => value)
              .map((hour, lessonIndex) => (
                <tr
                  key={lessonIndex}
                  className="divide-x divide-lines border-b border-lines last:border-none"
                >
                  <TableHourCell hour={hour} />
                  {timetable?.lessons.map((day, dayIndex) => (
                    <TableLessonCell
                      key={dayIndex}
                      day={day}
                      lessonIndex={lessonIndex}
                    />
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
