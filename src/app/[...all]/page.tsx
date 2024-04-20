import TimeTable from "@/components/content-items/timetable/timetable";
import Footer from "@/components/footer";
import Messages from "@/components/messages";
import SettingsProvider from "@/components/setting-provider";
import TimetableProvider from "@/components/timetable-provider";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import fetchOptivumList from "@/lib/fetchers/fetchOptivumList";
import fetchOptivumTimetable from "@/lib/fetchers/fetchOptivumTimetable";
import { Metadata, NextPage } from "next";

export const revalidate = 10800,
  dynamic = "force-static";

const MainRoute: NextPage<{ params: { all: string[] } }> = async ({
  params,
}) => {
  if (!["class", "teacher", "room", "zastepstwa"].includes(params.all[0]))
    return null;

  try {
    const timeTable = await fetchOptivumTimetable(params.all[0], params.all[1]);

    return (
      <TimetableProvider value={timeTable}>
        <SettingsProvider>
          <Navbar />
          {process.env.NEXT_PUBLIC_CMS && <Messages />}
          <Jumbotron />
          <TimeTable />
          <Footer renderInMobile={false} />
        </SettingsProvider>
      </TimetableProvider>
    );
  } catch (error) {
    // return <Error statusCode={500} />;
  }
  return <>nie mo</>;
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
  searchParams: {};
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
