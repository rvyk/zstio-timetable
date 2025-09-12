"use client";

import { LinkWithCookie } from "@/components/common/Link";
import { cn } from "@/lib/utils";
import { TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";

interface TableLessonCellProps {
  day: TableLesson[][];
  dayIndex: number;
  lessonIndex: number;
  selectedDayIndex: number;
}

export const TableLessonCell: FC<TableLessonCellProps> = ({
  day,
  dayIndex,
  lessonIndex,
  selectedDayIndex,
}) => {
  return (
    <td
      className={cn(
        dayIndex != selectedDayIndex && "max-md:hidden",
        "py-3 last:border-0 max-md:px-2 md:px-4",
      )}
    >
      {day[lessonIndex].map((lessonItem, index) => (
        <LessonItem key={index} lesson={lessonItem} />
      ))}
    </td>
  );
};

interface LessonItemProps {
  lesson: TableLesson;
}

export const LessonItem: FC<LessonItemProps> = ({ lesson }) => {
  return (
    <div className="grid w-full">
      <LessonHeader lesson={lesson} isStrikethrough={false} />
    </div>
  );
};

interface LessonHeaderProps {
  lesson: TableLesson;
  isStrikethrough: boolean;
}

const LessonHeader: FC<LessonHeaderProps> = ({ lesson, isStrikethrough }) => (
  <div
    className={cn(
      isStrikethrough && "line-through opacity-50",
      "flex w-full items-center gap-x-1.5 md:justify-between md:gap-x-4",
    )}
  >
    <h2 className="whitespace-nowrap text-sm font-semibold text-primary/90 sm:text-base">
      {lesson.subject}
      <GroupName groupName={lesson.groupName} />
    </h2>
    <LessonLinks
      classId={lesson.classId}
      className={lesson.className}
      teacherId={lesson.teacherId}
      teacherName={lesson.teacher}
      roomId={lesson.roomId}
      roomName={lesson.room}
    />
  </div>
);

const GroupName: FC<{ groupName?: string }> = ({ groupName }) =>
  groupName ? (
    <span className="text-sm font-medium text-primary/70"> ({groupName})</span>
  ) : null;

interface LessonLinksProps {
  classId?: string;
  className?: string;
  teacherId?: string;
  teacherName?: string;
  roomId?: string;
  roomName?: string;
}

const LessonLinks: FC<LessonLinksProps> = ({
  classId,
  className,
  teacherId,
  teacherName,
  roomId,
  roomName,
}) => (
  <div className="inline-flex gap-x-1.5 text-sm font-medium text-primary/70">
    <LessonLink id={classId} name={className} type="class" />
    <LessonLink id={teacherId} name={teacherName} type="teacher" />
    <LessonLink id={roomId} name={roomName} type="room" />
  </div>
);

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
  ) : !id && name ? (
    <p>
      {name}
    </p>
  ) : null;
};

