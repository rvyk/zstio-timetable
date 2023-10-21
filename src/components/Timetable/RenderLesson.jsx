import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function RenderLesson({ number, index, lessonIndex, day, substitutions }) {
  const cases = [
    "Uczniowie przychodzą później",
    "Przeniesiona",
    "Okienko dla uczniów",
    "Uczniowie zwolnieni do domu",
  ];

  const getSubstitution = () => {
    if (lessonIndex === substitutions.dayIndex)
      return substitutions?.zastepstwa?.filter((subs) => {
        return subs.lesson.split(",")[0] - 1 === index;
      })[0];
  };

  const getSubstitutionForGroup = (groupName) => {
    if (lessonIndex === substitutions.dayIndex)
      return substitutions?.zastepstwa?.filter((subs) => {
        if (
          subs.lesson.split(",")[0] - 1 === index &&
          subs.branch.includes(groupName)
        ) {
          return subs;
        }
      })[0];
  };

  return (
    <>
      {day[number - 1]?.map((lesson, subIndex) => {
        let substitution = getSubstitution(),
          possibleSubstitution = substitution,
          sure = true;
        if (day[number - 1]?.length > 1) {
          substitution = getSubstitutionForGroup(lesson.groupName);
          if (!substitution) {
            sure = false;
          }
        }

        return (
          <div
            key={`${day}-${lessonIndex}-${subIndex}`}
            className="flex flex-col"
          >
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
                day[number - 1].length > 1 && (
                  <p className="flex items-center mr-1 ">
                    {`(${subIndex + 1}/${day[number - 1].length})`}
                  </p>
                )
              )}

              {lesson?.className && lesson?.classId && (
                <Link
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
                <ExclamationCircleIcon
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  data-tooltip-id="content_tooltips"
                  data-tooltip-html={`${possibleSubstitution?.case}? <br /> (Sprawdź zastępstwa)`}
                />
              )}
            </div>

            {substitution && sure && (
              <>
                {cases.includes(substitution?.case) === false && (
                  <p className="text-orange-400 font-semibold">
                    {substitution?.subject}
                  </p>
                )}
                <p
                  className="dark:text-red-400 text-red-500 font-semibold"
                  data-tooltip-id="content_tooltips"
                  data-tooltip-html={`${substitution?.message}`}
                >
                  {substitution?.case}
                </p>
              </>
            )}

            {substitution && sure && day[number - 1]?.length > 1 && (
              <div className="w-full my-1"></div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default RenderLesson;
