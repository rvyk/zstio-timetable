"use client";

import { LinkWithCookie } from "@/components/common/Link";
import { findSubstitution } from "@/lib/findSubstitution";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { useSubstitutionsStore } from "@/stores/substitutions";
import { useTimetableStore } from "@/stores/timetable";
import { LessonChange, TimetableDiffMatrix } from "@/types/optivum";
import { LessonSubstitute } from "@majusss/substitutions-parser";
import { TableLesson } from "@majusss/timetable-parser";
import { FC } from "react";

interface TableLessonCellProps {
  day: TableLesson[][];
  dayIndex: number;
  lessonIndex: number;
  selectedDayIndex: number;
  diffs?: TimetableDiffMatrix;
}

export const TableLessonCell: FC<TableLessonCellProps> = ({
  day,
  dayIndex,
  lessonIndex,
  selectedDayIndex,
  diffs,
}) => {
  return (
    <td
      className={cn(
        dayIndex != selectedDayIndex && "max-md:hidden",
        "py-3 last:border-0 max-md:px-2 md:px-4",
      )}
    >
      {day[lessonIndex].map((lessonItem, index) => (
        <LessonItem
          key={index}
          lesson={lessonItem}
          dayIndex={dayIndex}
          lessonIndex={lessonIndex}
          diff={diffs?.[dayIndex]?.[lessonIndex]?.[index]}
        />
      ))}
    </td>
  );
};

interface LessonItemProps {
  lesson: TableLesson;
  dayIndex: number;
  lessonIndex: number;
  diff?: Partial<LessonChange>;
}

export const LessonItem: FC<LessonItemProps> = ({
  lesson,
  dayIndex,
  lessonIndex,
  diff,
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
        diff={diff}
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
  diff?: Partial<LessonChange>;
}

const LessonHeader: FC<LessonHeaderProps> = ({
  lesson,
  isStrikethrough,
  diff,
}) => (
  <div
    className={cn(
      isStrikethrough && "line-through opacity-50",
      "flex w-full items-center gap-x-1.5 md:justify-between md:gap-x-4",
    )}
  >
    <h2 className="whitespace-nowrap text-sm font-semibold text-primary/90 sm:text-base">
      {diff?.subject ? (
        <>
          <span className="line-through opacity-50">
            {diff.subject.oldValue}
          </span>{" "}
          {lesson.subject}
        </>
      ) : (
        lesson.subject
      )}
      <GroupName
        groupName={lesson.groupName}
        oldGroupName={diff?.groupName?.oldValue}
      />
    </h2>
    <LessonLinks
      classId={lesson.classId}
      className={lesson.className}
      teacherId={lesson.teacherId}
      teacherName={lesson.teacher}
      oldTeacherName={diff?.teacher?.oldValue}
      roomId={lesson.roomId}
      roomName={lesson.room}
      oldRoomName={diff?.room?.oldValue}
    />
  </div>
);

const GroupName: FC<{ groupName?: string; oldGroupName?: string }> = ({
  groupName,
  oldGroupName,
}) => {
  if (!groupName && !oldGroupName) return null;

  return (
    <span className="text-sm font-medium text-primary/70">
      {oldGroupName && (
        <span className="line-through opacity-50"> ({oldGroupName})</span>
      )}{" "}
      {groupName && `(${groupName})`}
    </span>
  );
};

interface LessonLinksProps {
  classId?: string;
  className?: string;
  teacherId?: string;
  teacherName?: string;
  oldTeacherName?: string;
  roomId?: string;
  roomName?: string;
  oldRoomName?: string;
}

const LessonLinks: FC<LessonLinksProps> = ({
  classId,
  className,
  teacherId,
  teacherName,
  oldTeacherName,
  roomId,
  roomName,
  oldRoomName,
}) => (
  <div className="inline-flex gap-x-1.5 text-sm font-medium text-primary/70">
    <LessonLink id={classId} name={className} type="class" />
    <LessonLink
      id={teacherId}
      name={teacherName}
      oldName={oldTeacherName}
      type="teacher"
    />
    <LessonLink id={roomId} name={roomName} oldName={oldRoomName} type="room" />
  </div>
);

interface LessonLinkProps {
  id?: string;
  name?: string;
  oldName?: string;
  type: string;
}

const LessonLink: FC<LessonLinkProps> = ({ id, name, oldName, type }) => {
  const link = `/${type}/${id}`;

  if (!id || (!name && !oldName)) return null;

  return (
    <span>
      {oldName && <span className="line-through opacity-50">{oldName}</span>}{" "}
      <LinkWithCookie
        aria-label={`Przejdź do ${link}`}
        className="hover:underline"
        href={link}
      >
        {name}
      </LinkWithCookie>
    </span>
  );
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
  <div className="flex max-md:gap-x-1.5 md:justify-between">
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
