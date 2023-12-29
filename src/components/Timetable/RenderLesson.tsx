import { getSubstitution, getSubstitutionForGroup } from "@/utils/getter";
import { cases } from "@/utils/helpers";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function RenderLesson({ lessonIndex, dayIndex, day, substitutions }) {
  return (
    <>
      {day[lessonIndex]?.map((lesson, subIndex) => {
        let substitution = getSubstitution(
            dayIndex,
            lessonIndex,
            substitutions
          ),
          possibleSubstitution = substitution,
          sure = true;
        console.log(substitutions);
        if (substitution && day[lessonIndex]?.length > 1) {
          substitution = getSubstitutionForGroup(
            lesson.groupName,
            substitutions,
            lessonIndex,
            dayIndex
          );
          if (!substitution) {
            sure = false;
            day[lessonIndex]?.map((lessonCheck, checkIndex) => {
              if (
                getSubstitutionForGroup(
                  lessonCheck?.groupName,
                  substitutions,
                  lessonIndex,
                  dayIndex
                ) &&
                checkIndex !== subIndex
              ) {
                substitution = undefined;
                sure = true;
              }
            });
          }
        }

        return (
          <div
            key={`${day}-${lessonIndex}-${subIndex}`}
            className="flex flex-col"
            id={substitution ? "substitutionAvailableTest" : undefined}
          >
            <p>{dayIndex + " " + lessonIndex}</p>
            <div className="flex flex-row">
              <div
                className={`font-semibold mr-1 flex flex-col ${
                  substitution && sure && "line-through opacity-60"
                }`}
              >
                {lesson?.subject}
              </div>

              {lesson?.groupName ? (
                <p
                  className={`flex items-center mr-1 ${
                    substitution && sure && "line-through opacity-60"
                  }`}
                >
                  {`(${lesson?.groupName})`}
                </p>
              ) : (
                day[lessonIndex].length > 1 && (
                  <p className="flex items-center mr-1 ">
                    {`(${subIndex + 1}/${day[lessonIndex].length})`}
                  </p>
                )
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
                  target="_blank"
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
                <Link
                  prefetch={false}
                  href={`/zastepstwa?teachers=${possibleSubstitution?.teacher.replaceAll(
                    " ",
                    "+"
                  )}&branches=${possibleSubstitution?.branch}`}
                >
                  <ExclamationCircleIcon
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    data-tooltip-id="content_tooltips"
                    data-tooltip-html={`${possibleSubstitution?.case}? <br /> (Sprawdź zastępstwa)`}
                  />
                </Link>
              )}
            </div>

            {substitution && sure && (
              <a
                href={`/zastepstwa?teachers=${substitution?.teacher.replaceAll(
                  " ",
                  "+"
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

            {substitution && sure && day[lessonIndex]?.length > 1 && (
              <div className="w-full my-1"></div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default RenderLesson;
