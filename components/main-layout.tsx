import { Aside } from "@/components/aside";
import { Header } from "@/components/header";
import { MainDrawer } from "@/components/main-drawer";
import { MainTable } from "@/components/main-table";
import fetchOptivumTimetable from "@/lib/fetchers/fetch-optivum-timetable";
import TimetableProvider from "./providers/timetable-provider";

export async function MainLayout({ type, value }: { type: string; value: string }) {
  const table = await fetchOptivumTimetable(type, value);
  return (
    <TimetableProvider value={table}>
      <div className="h-screen">
        <Aside />
        <main className="flex h-full flex-col overflow-y-auto max-sm:pb-16">
          <Header />
          <MainTable />
        </main>
        <MainDrawer />
      </div>
    </TimetableProvider>
  );
}
