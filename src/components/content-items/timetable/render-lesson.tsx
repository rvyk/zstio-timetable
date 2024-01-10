import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cases } from "@/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { TableLesson } from "@wulkanowy/timetable-parser";
import Link from "next/link";

interface RenderLessonProps {
  lessonIndex: number;
  day: TableLesson[][] | TableLesson;
  substitution: Substitution | undefined;
  sure: boolean;
  possibleSubstitution: Substitution | undefined;
  lesson: TableLesson;
}

const RenderLesson: React.FC<RenderLessonProps> = ({
  lessonIndex,
  day,
  substitution,
  sure,
  possibleSubstitution,
  lesson,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div
          className={`font-semibold mr-1 flex flex-col ${
            substitution && sure && "line-through opacity-60"
          }`}
        >
          {lesson?.subject}
        </div>

        {lesson?.groupName && (
          <p
            className={`flex items-center mr-1 ${
              substitution && sure && "line-through opacity-60"
            }`}
          >
            {`(${lesson?.groupName})`}
          </p>
        )}

        {lesson?.className && lesson?.classId && (
          <Link
            prefetch={false}
            href={`/class/${lesson?.classId}`}
            className={`flex items-center mr-1 ${
              substitution && sure && "line-through opacity-60"
            }`}
          >
            {lesson?.className}
          </Link>
        )}

        {lesson?.teacher && lesson?.teacherId && (
          <Link
            prefetch={false}
            href={`/teacher/${lesson?.teacherId}`}
            className={`flex items-center mr-1 ${
              substitution && sure && "line-through opacity-60"
            }`}
          >
            {lesson?.teacher}
          </Link>
        )}
        {lesson?.roomId && lesson?.room && (
          <Link
            prefetch={false}
            href={`/room/${lesson?.roomId}`}
            className={`flex items-center mr-1 ${
              substitution && sure && "line-through opacity-60"
            }`}
          >
            {substitution && sure && substitution?.class != lesson?.room
              ? substitution?.class
              : lesson?.room}
          </Link>
        )}

        {possibleSubstitution && !sure && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                prefetch={false}
                href={`/zastepstwa?teachers=${possibleSubstitution?.teacher.replaceAll(
                  " ",
                  "+",
                )}&branches=${possibleSubstitution?.branch}`}
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-center">
              <p>{possibleSubstitution?.case}?</p>
              <p>(Sprawdź zastępstwa)</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {substitution && sure && (
        <a
          href={`/zastepstwa?teachers=${substitution?.teacher.replaceAll(
            " ",
            "+",
          )}&branches=${substitution?.branch}`}
        >
          {cases.includes(substitution?.case) === false && (
            <p className="text-orange-400 font-semibold">
              {substitution?.subject}
            </p>
          )}
          <p
            className={`${
              substitution?.case == cases[1]
                ? "text-yellow-400"
                : "text-red-500 dark:text-red-400"
            } font-semibold`}
          >
            {substitution?.case == cases[1] && substitution?.message
              ? substitution?.message
              : substitution?.case}
          </p>
        </a>
      )}
    </div>
  );
};

export default RenderLesson;
