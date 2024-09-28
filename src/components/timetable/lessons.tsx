"use client";

import { findSubstitution } from "@/lib/substitution-finder";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { LessonSubstitute } from "@majusss/substitutions-parser";
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
  const lessons = day[lessonIndex];

  return (
    <td className="px-4 py-3 last:border-0">
      {lessons.map((lessonItem, index) => (
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

interface LessonItemProps {
  lesson: TableLesson;
  dayIndex: number;
  lessonIndex: number;
}

export const LessonItem: FC<LessonItemProps> = ({
  lesson,
  dayIndex,
  lessonIndex,
}) => {
  const isSubstitutionShown = useSettingsStore(
    (state) => state.isSubstitutionShown,
  );
  const substitutions = useSubstitutionsStore((state) => state.substitutions);
  const timetable = useTimetableStore((state) => state.timetable);

  const substitution = findSubstitution(
    substitutions?.tables ?? [],
    dayIndex,
    timetable?.title ?? "",
    lessonIndex,
    lesson.groupName,
  );

  const hasSubstitutionCase = substitution?.case;

  return (
    <div className="grid w-full">
      <LessonHeader
        lesson={lesson}
        isStrikethrough={Boolean(hasSubstitutionCase && isSubstitutionShown)}
      />
      {isSubstitutionShown && substitution && (
        <SubstitutionDetails substitution={substitution} />
      )}
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
      "flex w-full items-center justify-between gap-x-4",
    )}
  >
    <h2 className="whitespace-nowrap text-base font-semibold text-primary/90">
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
  ) : null;
};

interface SubstitutionType {
  case?: string;
  lessonSubstitute?: LessonSubstitute[];
}

interface SubstitutionDetailsProps {
  substitution: SubstitutionType;
}

const SubstitutionDetails: FC<SubstitutionDetailsProps> = ({
  substitution,
}) => (
  <div className="mb-1 grid">
    <p className="text-sm font-semibold text-accent-table dark:font-medium">
      {substitution.case}
    </p>
    <div className="grid">
      {substitution.lessonSubstitute?.map((substitute, index) => (
        <SubstitutionItem key={index} substitute={substitute} />
      ))}
    </div>
  </div>
);

interface SubstitutionItemProps {
  substitute: LessonSubstitute;
}

const SubstitutionItem: FC<SubstitutionItemProps> = ({ substitute }) => (
  <div className="flex justify-between">
    <h2 className="whitespace-nowrap text-sm font-semibold text-primary/90">
      *{substitute.subject}
      <GroupName groupName={substitute.groupName} />
    </h2>
    <div className="inline-flex gap-x-1.5 text-sm font-medium text-primary/70">
      {substitute.teacherId ? (
        <LessonLink
          type="teacher"
          id={substitute.teacherId}
          name={substitute.teacher}
        />
      ) : (
        <p>{substitute.teacher}</p>
      )}

      {substitute.roomId ? (
        <LessonLink type="room" id={substitute.roomId} name={substitute.room} />
      ) : (
        <p>{substitute.room}</p>
      )}
    </div>
  </div>
);
