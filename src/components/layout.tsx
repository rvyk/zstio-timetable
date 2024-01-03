import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";

function Layout({
  props: { timeTable, timeTableList, status, substitutions },
  children,
}: {
  props: Table;
  children?: React.ReactNode;
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
      <Jumbotron
        timeTableList={timeTableList}
        substitutions={substitutions}
        timeTable={timeTable}
      />
      <div>{children}</div>
    </>
  );
}

export default Layout;
