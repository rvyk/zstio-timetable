import Link from "next/link";
import { useState } from "react";
function RenderLesson({
  number,
  index,
  lessonIndex,
  day,
  lessons,
  substitutions,
}) {
  const cases = [
    "Uczniowie przychodzą później",
    "Przeniesiona",
    "Okienko dla uczniów",
    "Uczniowie zwolnieni do domu",
  ];

  const getSubstitution = () => {
    if (lessonIndex == substitutions.dayIndex)
      return substitutions?.zastepstwa?.filter((zas) => {
        return zas.lesson.split(",")[0] - 1 == index;
      })[0];
  };

  const getSubstitutionForGroup = (groupName) => {
    if (lessonIndex == substitutions.dayIndex)
      return substitutions?.zastepstwa?.filter((zas) => {
        if (
          zas.lesson.split(",")[0] - 1 == index &&
          zas?.branch?.includes(groupName)
        ) {
          return zas;
        }
      })[0];
  };

  return (
    <>
      <>
        {day[number - 1]?.map((lesson, subIndex) => {
          const zastepstwo = lesson.hasOwnProperty("groupName")
            ? getSubstitutionForGroup(lesson.groupName)
            : getSubstitution();

          return (
            <div
              key={`${day}-${lessonIndex}-${subIndex}`}
              className="flex flex-col"
            >
              <div className="flex flex-row">
                <div
                  className={`font-semibold mr-1 flex flex-col ${
                    zastepstwo && "line-through opacity-60"
                  }`}
                >
                  {lesson?.subject}
                </div>

                {lesson?.groupName ? (
                  <p
                    className={`flex items-center mr-1 ${
                      zastepstwo && "line-through opacity-60"
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
                      zastepstwo && "line-through opacity-60"
                    }`}
                  >
                    {lesson?.className}
                  </Link>
                )}

                {lesson?.teacher && lesson?.teacherId && (
                  <Link
                    href={`/teacher/${lesson?.teacherId}`}
                    className={`flex items-center mr-1 ${
                      zastepstwo && "line-through opacity-60"
                    }`}
                  >
                    {lesson?.teacher}
                  </Link>
                )}
                {lesson?.roomId && lesson?.room && (
                  <Link
                    href={`/room/${lesson?.roomId}`}
                    className={`flex items-center ${
                      zastepstwo && "line-through opacity-60"
                    }`}
                  >
                    {zastepstwo && zastepstwo?.class != lesson?.room
                      ? zastepstwo?.class
                      : lesson?.room}
                  </Link>
                )}
              </div>

              {zastepstwo && (
                <>
                  {cases.includes(zastepstwo.case) === false && (
                    <p className="text-orange-400 font-semibold">
                      {zastepstwo.subject}
                    </p>
                  )}
                  <p className="dark:text-red-400 text-red-500 font-semibold">
                    {zastepstwo.case}
                  </p>
                </>
              )}

              {zastepstwo && day[number - 1]?.length > 1 && (
                <div className="w-full my-1"></div>
              )}
            </div>
          );
        })}
      </>
    </>
  );
}

export default RenderLesson;
