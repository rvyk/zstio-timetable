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
  const lessons = day[lessonIndex] ?? [];

  return (
    <td
      className={cn(
        dayIndex != selectedDayIndex && "max-md:hidden",
        "align-top p-1",
      )}
    >
      {lessons.length > 0 && (
        <div className="grid gap-1">
          {lessons.map((lessonItem, index) => (
            <LessonItem key={index} lesson={lessonItem} />
          ))}
        </div>
      )}
    </td>
  );
};

interface LessonItemProps {
  lesson: TableLesson;
}

/** Sama treść lekcji — bez obramowania, żeby kafelek mógł ją opakować po swojemu. */
export const LessonEntry: FC<LessonItemProps> = ({ lesson }) => (
  <div className="grid gap-0.5">
    <h3 className="text-primary text-[15px] leading-tight font-medium tracking-[-0.01em]">
      {lesson.subject}
      <GroupName groupName={lesson.groupName} />
    </h3>
    <LessonMeta
      classId={lesson.classId}
      className={lesson.className}
      teacherId={lesson.teacherId}
      teacherName={lesson.teacher}
      roomId={lesson.roomId}
      roomName={lesson.room}
    />
  </div>
);

export const LessonItem: FC<LessonItemProps> = ({ lesson }) => (
  <div className="border-lines/70 bg-accent/40 hover:border-lines hover:bg-accent rounded-md border px-2.5 py-1.5 transition-colors">
    <LessonEntry lesson={lesson} />
  </div>
);

const GroupName: FC<{ groupName?: string }> = ({ groupName }) =>
  groupName ? (
    <span className="text-primary/45 ml-1.5 font-mono text-[11px] font-normal">
      {groupName}
    </span>
  ) : null;

interface LessonMetaProps {
  classId?: string;
  className?: string;
  teacherId?: string;
  teacherName?: string;
  roomId?: string;
  roomName?: string;
}

const LessonMeta: FC<LessonMetaProps> = ({
  classId,
  className,
  teacherId,
  teacherName,
  roomId,
  roomName,
}) => {
  const parts = [
    { id: classId, name: className, type: "class" },
    { id: teacherId, name: teacherName, type: "teacher" },
    { id: roomId, name: roomName, type: "room" },
  ].filter((part) => part.name);

  if (parts.length === 0) return null;

  return (
    <div className="text-primary/50 flex flex-wrap items-center gap-x-1.5 text-xs">
      {parts.map((part, index) => (
        <span key={part.type} className="inline-flex items-center gap-x-1.5">
          {index > 0 && <span className="text-primary/25">·</span>}
          <LessonLink id={part.id} name={part.name} type={part.type} />
        </span>
      ))}
    </div>
  );
};

interface LessonLinkProps {
  id?: string;
  name?: string;
  type: string;
}

const LessonLink: FC<LessonLinkProps> = ({ id, name, type }) =>
  id && name ? (
    <LinkWithCookie
      aria-label={`Przejdź do /${type}/${id}`}
      className="hover:text-primary decoration-primary/40 transition-colors hover:underline hover:underline-offset-2"
      href={`/${type}/${id}`}
    >
      {name}
    </LinkWithCookie>
  ) : (
    <span>{name}</span>
  );
