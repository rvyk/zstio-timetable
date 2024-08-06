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
import { Metadata, NextPage } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const revalidate = 10800;
const MainRoute: NextPage<{ params: { all: string[] } }> = async ({
  params,
}) => {
  if (
    ![
      "class",
      "teacher",
      "room",
      "zastepstwa",
      "",
      "proxy/cms/messages",
    ].includes(params.all[0])
  )
    return notFound();

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

export async function generateMetadata({
  params,
}: {
  params: { all: string[] };
}): Promise<Metadata> {
  const timeTable = await fetchOptivumTimetable(params.all[0], params.all[1]);
  const titleTimeTable = `${
    timeTable?.title ? `${timeTable?.title} | ` : ""
  }ZSTiO - Plan lekcji`;

  return {
    title: titleTimeTable,
    description:
      "W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal.",
  };
}

export default MainRoute;
