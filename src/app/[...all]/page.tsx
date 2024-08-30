import Footer from "@/components/footer";
import Content from "@/components/main-content";
import Messages from "@/components/messages";
import SettingsProvider from "@/components/setting-provider";
import TimetableProvider from "@/components/timetable-provider";
import Jumbotron from "@/components/ui/jumbotron";
const Navbar = dynamic(() => import("@/components/ui/navbar"), {
  ssr: false,
});

import fetchOptivumList from "@/lib/fetchers/fetchOptivumList";
import fetchOptivumTimetable from "@/lib/fetchers/fetchOptivumTimetable";
import { NextPage } from "next";
import dynamic from "next/dynamic";

export const revalidate = 3600;

const MainRoute: NextPage<{ params: { all: string[] } }> = async ({
  params,
}) => {
  if (params.all[0] == "favicon.ico") return null;
  const timeTable = await fetchOptivumTimetable(params.all[0], params.all[1]);
  return (
    <TimetableProvider value={timeTable}>
      <SettingsProvider>
        <Navbar />
        {process.env.NEXT_PUBLIC_CMS && <Messages />}
        <div className="grid gap-8 md:py-8">
          <Jumbotron />
          <Content />
          <Footer renderInMobile={false} />
        </div>
      </SettingsProvider>
    </TimetableProvider>
  );
};

export async function generateStaticParams() {
  const { classes, rooms, teachers } = await fetchOptivumList();
  return [
    ...classes.map((c) => ({ all: ["class", c.value] })),
    ...(rooms ?? []).map((r) => ({ all: ["room", r.value] })),
    ...(teachers ?? []).map((t) => ({ all: ["teacher", t.value] })),
  ];
}

export default MainRoute;
