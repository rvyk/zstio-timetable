"use client";

import { findSubstitution } from "@/lib/substitution-finder";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";
import { LinkWithCookie } from "../link";

interface TableLessonCellProps {
  day: TableLesson[][];
  dayIndex: number;
  lessonIndex: number;
}

export const TableLessonCell: FC<TableLessonCellProps> = ({
  day,
  dayIndex,
  lessonIndex,
}) => {
  const lesson = day[lessonIndex];

  return (
    <td className="px-4 py-3 last:border-0">
      {lesson.map((lessonItem, index) => (
        <LessonItem
          key={index}
          lesson={lessonItem}
          dayIndex={dayIndex}
          lessonIndex={lessonIndex}
        />
      ))}
    </td>
  );
};

const LessonItem: FC<{
  lesson: TableLesson;
  dayIndex: number;
  lessonIndex: number;
}> = ({ lesson, dayIndex, lessonIndex }) => {
  const substitutions = useSubstitutionsStore((state) => state.substitutions);
  const timetable = useTimetableStore((state) => state.timetable);

  const substitution = findSubstitution(
    substitutions?.tables ?? [],
    dayIndex,
    timetable?.title ?? "",
    lessonIndex,
    lesson.groupName,
  );

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
      <p className="text-red-600">{substitution?.case}</p>
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
