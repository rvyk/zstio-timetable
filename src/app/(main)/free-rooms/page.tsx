import { getFreeRoomsWeek } from "@/actions/getFreeRooms";
import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { FreeRoomsBoard } from "@/components/timetable/FreeRoomsBoard";
import { Topbar } from "@/components/topbar/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wolne sale" };

const FreeRoomsPage = async () => {
  const { rooms } = await getOptivumList();

  // dni i godziny bierzemy z dowolnego planu sali — siatka ma być ta sama co w planie
  const sample = rooms?.[0]
    ? await getOptivumTimetable("room", rooms[0].value)
    : null;

  const dayNames = sample?.dayNames ?? [];
  const hours = Object.values(sample?.hours ?? {});
  const freeRooms = await getFreeRoomsWeek(dayNames.length, hours.length);

  return (
    /* ta sama rama co plan — inaczej na telefonie treść dotyka krawędzi,
       a bez Topbara i BottomBara nie ma stąd żadnego wyjścia */
    <main className="flex h-full w-full min-w-0 flex-1 flex-col gap-y-3 max-md:overflow-y-auto md:overflow-hidden md:p-3">
      <Topbar showLessonSwitcher={false} />
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
