import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { TimeTableData } from "@/types/timetable";
import Head from "next/head";

function Layout({
  timeTable,
  children,
}: {
  timeTable?: TimeTableData;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
        {/* <title>
          {timeTable?.title && `${timeTable?.title} | `}ZSTiO - Plan lekcji
        </title> */}
        <meta
          property="og:title"
          content={
            timeTable?.title
              ? `${timeTable?.title} | `
              : "" + "ZSTiO - Plan lekcji"
          }
        />
      </Head>
      <Navbar />
      <Jumbotron />
      {children}
    </>
  );
}

export default Layout;
