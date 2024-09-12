import { OptivumTimetable } from "@/types/optivum";
import { TableHour, TableLesson } from "@majusss/timetable-parser";

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
                <th className="min-w-72 text-left" key={dayName}>
                  <div className="inline-flex items-center gap-x-3 px-4 py-3">
                    <h2 className="text-3xl font-semibold text-primary/90">
                      {/* TODO: CREATE A FUNCTION THAT WILL RETURN THE DAY NUMBER */}
                      03
                    </h2>
                    <p className="text-xl font-semibold text-primary/90">
                      {dayName}
                    </p>
                  </div>
                </th>
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
                  <LessonNumberCell hour={hour} />
                  {timetable?.lessons.map((day, dayIndex) => (
                    <LessonCell
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

const LessonNumberCell: React.FC<{
  hour: TableHour;
}> = ({ hour }) => {
  const { number, timeFrom, timeTo } = hour;

  return (
    <td className="flex min-h-16 w-full flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-primary/90">{number}</h2>
      <p className="text-base font-medium text-primary/70">
        {timeFrom}-{timeTo}
      </p>
    </td>
  );
};

const LessonCell: React.FC<{
  day: TableLesson[][];
  lessonIndex: number;
}> = ({ day, lessonIndex }) => {
  return (
    <td className="px-4 py-3 last:border-0">
      {day[lessonIndex]?.map((lesson, index) => {
        if (lesson.groupName) {
          return (
            <div key={lesson.groupName} className="flex w-full justify-between">
              <h2 className="text-base font-semibold text-primary/90">
                {lesson.subject}
                <span className="text-sm font-medium text-primary/70">
                  ({lesson.groupName})
                </span>
              </h2>
              <p className="text-base font-medium text-primary/70">
                {/* TODO: ADD SUPPORT FOR TEACHERS AND ROOMS AND CREATE LINK FROM THIS / MAKE IT AS COMPONENT OR SMTH */}
                {lesson.teacher} {lesson.room}
              </p>
            </div>
          );
        }

        return (
          <div key={index} className="grid">
            <h2 className="text-base font-semibold text-primary/90">
              {lesson.subject}
            </h2>
            <p className="text-base font-medium text-primary/70">
              {/* TODO: ADD SUPPORT FOR TEACHERS AND ROOMS AND CREATE LINK FROM THIS / MAKE IT AS COMPONENT OR SMTH */}
              {lesson.teacher} {lesson.room}
            </p>
          </div>
        );
      })}
    </td>
  );
};
