import { TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";
import { LinkWithCookie } from "../link";

interface TableLessonCellProps {
  day: TableLesson[][];
  lessonIndex: number;
}

export const TableLessonCell: FC<TableLessonCellProps> = ({
  day,
  lessonIndex,
}) => {
  const lesson = day[lessonIndex];

  return (
    <td className="px-4 py-3 last:border-0">
      {lesson.map((lessonItem, index) => (
        <LessonItem key={index} lesson={lessonItem} />
      ))}
    </td>
  );
};

const LessonItem: FC<{ lesson: TableLesson }> = ({ lesson }) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-4">
      <h2 className="whitespace-nowrap text-base font-semibold text-primary/90">
        {lesson.subject}
        {lesson.groupName && (
          <span className="text-sm font-medium text-primary/70">
            {" "}
            ({lesson.groupName})
          </span>
        )}
      </h2>
      <div className="inline-flex gap-x-1.5 text-sm font-medium text-primary/70">
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

interface LessonLinkProps {
  id?: string;
  name?: string;
  type: string;
}

const LessonLink: FC<LessonLinkProps> = ({ id, name, type }) => {
  const link = `/${type}/${id}`;

  return id && name ? (
    <LinkWithCookie
      aria-label={`Przejdź do ${link}`}
      className="hover:underline"
      href={link}
    >
      {name}
    </LinkWithCookie>
  ) : null;
};
