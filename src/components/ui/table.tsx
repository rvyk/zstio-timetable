import { getDayNumberForNextWeek } from "@/lib/utils";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import Link from "next/link";

export const TableHourCell: React.FC<{
  hour: TableHour;
}> = ({ hour }) => {
  const { number, timeFrom, timeTo } = hour;

  return (
    <td className="flex min-h-16 w-full flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-primary/90">{number}</h2>
      <p className="text-sm font-medium text-primary/70">
        {timeFrom}-{timeTo}
      </p>
    </td>
  );
};

export const TableLessonCell: React.FC<{
  day: TableLesson[][];
  lessonIndex: number;
}> = ({ day, lessonIndex }) => (
  <td className="px-4 py-3 last:border-0">
    {day[lessonIndex]?.map((lesson, index) => (
      <LessonItem key={index} lesson={lesson} />
    ))}
  </td>
);

export const TableHeader: React.FC<{ dayName: string }> = ({ dayName }) => {
  const dayNumber = getDayNumberForNextWeek(dayName);

  return (
    <th className="min-w-72 text-left">
      <div className="inline-flex items-center gap-x-3 px-4 py-3">
        <h2 className="text-3xl font-semibold text-primary/90">{dayNumber}</h2>
        <p className="text-xl font-semibold text-primary/90">{dayName}</p>
      </div>
    </th>
  );
};

const LessonItem: React.FC<{ lesson: TableLesson }> = ({ lesson }) => {
  return (
    <div
      className={
        lesson.groupName ? "flex w-full items-center justify-between" : "grid"
      }
    >
      <h2 className="text-base font-semibold text-primary/90">
        {lesson.subject}
        {lesson.groupName && (
          <span className="text-sm font-medium text-primary/70">
            {" "}
            ({lesson.groupName})
          </span>
        )}
      </h2>
      <div className="text-sm font-medium text-primary/70">
        <LessonLink id={lesson.classId} name={lesson.className} type="class" />
        <LessonLink
          id={lesson.teacherId}
          name={lesson.teacher}
          type="teacher"
        />
        <LessonLink id={lesson.roomId} name={lesson.room} type="room" />
      </div>
    </div>
  );
};

const LessonLink: React.FC<{ id?: string; name?: string; type: string }> = ({
  id,
  name,
  type,
}) => {
  return id && name ? (
    <Link className="hover:underline" href={`/${type}/${id}`}>
      {name}{" "}
    </Link>
  ) : null;
};
