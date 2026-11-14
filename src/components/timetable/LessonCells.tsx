"use client";

import { LinkWithCookie } from "@/components/common/Link";
import { cn } from "@/lib/utils";
import { TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";

interface LessonItemProps {
  lesson: TableLesson;
  inline?: boolean;
}

export const LessonEntry: FC<LessonItemProps> = ({ lesson, inline }) =>
  inline ? (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
      <h2 className="text-primary text-[15px] leading-snug font-medium tracking-[-0.01em]">
        {lesson.subject}
      </h2>
      <GroupName groupName={lesson.groupName} inline />
      <LessonMeta
        classId={lesson.classId}
        className={lesson.className}
        teacherId={lesson.teacherId}
        teacherName={lesson.teacher}
        roomId={lesson.roomId}
        roomName={lesson.room}
        inline
      />
    </div>
  ) : (
    <div className="grid gap-0.5">
      <h2 className="text-primary text-[15px] leading-tight font-medium tracking-[-0.01em]">
        {lesson.subject}
        <GroupName groupName={lesson.groupName} />
      </h2>
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

const GroupName: FC<{ groupName?: string; inline?: boolean }> = ({
  groupName,
  inline,
}) =>
  groupName ? (
    <span
      className={cn(
        "text-primary/60 font-mono text-[11px] font-normal",
        !inline && "ml-1.5",
      )}
    >
      ({groupName})
    </span>
  ) : null;

interface LessonMetaProps {
  classId?: string;
  className?: string;
  teacherId?: string;
  teacherName?: string;
  roomId?: string;
  roomName?: string;
  inline?: boolean;
}

const LessonMeta: FC<LessonMetaProps> = ({
  classId,
  className,
  teacherId,
  teacherName,
  roomId,
  roomName,
  inline,
}) => {
  const parts = [
    { id: classId, name: className, type: "class" },
    { id: teacherId, name: teacherName, type: "teacher" },
    { id: roomId, name: roomName, type: "room" },
  ].filter((part) => part.name);

  if (parts.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline",
        inline
          ? "text-primary/60 gap-x-3 text-[13px]"
          : "text-primary/65 items-center gap-x-1.5 text-xs",
      )}
    >
      {parts.map((part, index) => (
        <span key={part.type} className="inline-flex items-center gap-x-1.5">
          {!inline && index > 0 && <span className="text-primary/40">·</span>}
          <LessonLink
            id={part.id}
            name={part.name}
            type={part.type}
            inline={inline}
          />
        </span>
      ))}
    </div>
  );
};

interface LessonLinkProps {
  id?: string;
  name?: string;
  type: string;
  inline?: boolean;
}

const LessonLink: FC<LessonLinkProps> = ({ id, name, type, inline }) =>
  id && name ? (
    <LinkWithCookie
      className={cn(
        "hover:text-primary decoration-primary/40 transition-colors hover:underline hover:underline-offset-2",
        inline && "-mx-1.5 -my-1 px-1.5 py-1",
      )}
      href={`/${type}/${id}`}
    >
      {name}
    </LinkWithCookie>
  ) : (
    <span>{name}</span>
  );
