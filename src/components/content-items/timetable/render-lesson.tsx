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
  substitution: Substitution | undefined;
  sure: boolean;
  possibleSubstitution: Substitution | undefined;
  lesson: TableLesson;
}

const RenderLesson: React.FC<RenderLessonProps> = ({
  substitution,
  sure,
  possibleSubstitution,
  lesson,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-1">
        <div
          className={`flex flex-col font-semibold ${
            substitution && sure && "line-through opacity-60"
          }`}
        >
          {lesson?.subject}
        </div>

        {lesson?.groupName && (
          <p
            className={`flex items-center ${
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
            className={`flex items-center hover:underline ${
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
            className={`flex items-center hover:underline ${
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
            className={`flex items-center hover:underline ${
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
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
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
            <p className="font-semibold text-orange-400">
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
