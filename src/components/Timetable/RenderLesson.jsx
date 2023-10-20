import Link from "next/link";

function RenderLesson({number, index, lessonIndex, day, lessons, substitutions,}) {
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
        let substitution = getSubstitution(), possibleSubstitution = substitution, sure = true;
        if (day[number - 1]?.length > 1) {
          substitution = getSubstitutionForGroup(lesson.groupName)
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
                <div className={"bg-[#ffdd00] w-4 h-4 flex justify-center items-center rounded-full"}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 64 512">
                    <path
                      d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>
                  </svg>
                </div>
              )}
            </div>

            {substitution && sure && (
              <>
                {cases.includes(substitution.case) === false && (
                  <p className="text-orange-400 font-semibold">
                    {substitution.subject}
                  </p>
                )}
                <p className="dark:text-red-400 text-red-500 font-semibold">
                  {substitution.case}
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
