"use client";

import { shortHours } from "@/constants/hours";
import { cn, getDayNumberForNextWeek } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";
import { Button } from "./button";

export const TableHourCell: React.FC<{
  hour: TableHour;
}> = ({ hour }) => {
  const isShortLessons = useSettingsStore((state) => state.isShortLessons);
  const shortHour = shortHours.find((sh) => sh.number === hour.number);

  const timeFrom =
    isShortLessons && shortHour ? shortHour.timeFrom : hour.timeFrom;
  const timeTo = isShortLessons && shortHour ? shortHour.timeTo : hour.timeTo;

  return (
    <td className="flex min-h-16 w-full flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-primary/90">{hour.number}</h2>
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

export const ShortLessonSwitcherCell: React.FC = () => {
  const isClient = useIsClient();
  const { isShortLessons, toggleShortLessons } = useSettingsStore();

  if (!isClient) return null;

  return (
    <th className="flex h-16 min-w-32 items-center justify-center">
      <div className="relative h-10">
        <div className="flex h-10">
          {["45'", "30'"].map((value, index) => (
            <Button
              variant="icon"
              key={value}
              onClick={toggleShortLessons}
              className={cn(
                index === 0 ? "!rounded-l-sm" : "!rounded-r-sm",
                "rounded-none bg-accent font-semibold text-primary/90 hover:bg-primary/5 hover:text-primary",
              )}
            >
              {value}
            </Button>
          ))}
        </div>
        <div
          className={cn(
            isShortLessons
              ? "translate-x-[100%] transform rounded-r-sm"
              : "rounded-l-sm",
            "absolute top-0 z-40 flex h-10 w-[50%] cursor-default items-center justify-center bg-primary px-4 py-2 text-sm font-semibold text-accent/90 transition-all dark:bg-accent-table dark:text-primary/90",
          )}
        >
          {isShortLessons ? "30'" : "45'"}
        </div>
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
