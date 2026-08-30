"use client";

import { LinkWithCookie } from "@/components/common/Link";
import { useT } from "@/components/common/LocaleProvider";
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
      <h3 className="text-primary text-[15px] leading-snug font-medium tracking-[-0.01em]">
        {lesson.subject}
      </h3>
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

const GroupName: FC<{ groupName?: string; inline?: boolean }> = ({
  groupName,
  inline,
}) =>
  groupName ? (
    <span
      className={cn(
        "text-primary/55 font-mono text-[11px] font-normal",
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
          ? "text-primary/55 gap-x-2 text-[13px]"
          : "text-primary/65 items-center gap-x-1.5 text-xs",
      )}
    >
      {parts.map((part, index) => (
        <span key={part.type} className="inline-flex items-center gap-x-1.5">
          {!inline && index > 0 && <span className="text-primary/40">·</span>}
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

const LessonLink: FC<LessonLinkProps> = ({ id, name, type }) => {
  const translate = useT();

  return id && name ? (
    <LinkWithCookie
      aria-label={translate("timetable.goTo", { target: `/${type}/${id}` })}
      className="hover:text-primary decoration-primary/40 transition-colors hover:underline hover:underline-offset-2"
      href={`/${type}/${id}`}
    >
      {name}
    </LinkWithCookie>
  ) : (
    <span>{name}</span>
  );
};
