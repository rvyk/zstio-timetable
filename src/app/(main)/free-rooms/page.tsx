import { getFreeRoomsWeek } from "@/actions/getFreeRooms";
import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { FreeRoomsBoard } from "@/components/timetable/FreeRoomsBoard";
import { Topbar } from "@/components/topbar/Topbar";
import { SCHOOL_NAME_ACCUSATIVE } from "@/constants/school";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo(
  "Wolne sale",
  `Sprawdź, które sale w ${SCHOOL_NAME_ACCUSATIVE} są wolne — cały tydzień naraz, z podziałem na dni i numery lekcji.`,
  "/free-rooms",
);

const FreeRoomsPage = async () => {
  const { rooms } = await getOptivumList();

  const sample = rooms?.[0]
    ? await getOptivumTimetable("room", rooms[0].value)
    : null;

  const dayNames = sample?.dayNames ?? [];
  const hours = Object.values(sample?.hours ?? {});
  const freeRooms = await getFreeRoomsWeek(dayNames.length, hours.length);

  return (
    <main className="flex h-full w-full min-w-0 flex-1 flex-col gap-y-3 max-md:overflow-y-auto max-md:pb-[env(safe-area-inset-bottom)] md:overflow-hidden md:p-3">
      <Topbar
        showLessonSwitcher={false}
        page={{
          title: "Wolne sale",
          backHref: "/",
          backLabel: "Wróć do planu",
        }}
      />
      <FreeRoomsBoard
        dayNames={dayNames}
        hours={hours}
        freeRooms={freeRooms}
        rooms={rooms ?? []}
      />
    </main>
  );
};

export default FreeRoomsPage;
