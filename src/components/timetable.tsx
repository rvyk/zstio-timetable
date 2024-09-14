import { OptivumTimetable } from "@/types/optivum";
import {
  ShortLessonSwitcherCell,
  TableHeader,
  TableHourCell,
  TableLessonCell,
} from "./ui/timetable-cells";

export const Timetable: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable }) => {
  if (timetable.lessons.some((innerArray) => innerArray.length === 0)) {
    return null;
  }

  return (
    <div className="h-fit w-full overflow-hidden rounded-md border border-lines bg-foreground">
      <div className="h-full w-full overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-lines border-b border-lines">
              <ShortLessonSwitcherCell />
              {timetable?.dayNames.map((dayName) => (
                <TableHeader key={dayName} dayName={dayName} />
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(timetable?.hours)
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
