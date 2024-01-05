import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";
import Footer from "./footer";
import Messages from "./messages";

function Layout({
  props: { timeTable, timeTableList, status, substitutions },
}: {
  props: Table;
}) {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
        <title>
          {[timeTable?.title, "ZSTiO - Plan lekcji"]
            .filter(Boolean)
            .join(" | ")}
        </title>
        <meta
          property="og:title"
          content={`${
            timeTable?.title ? `${timeTable?.title} | ` : ""
          }ZSTiO - Plan lekcji`}
        />
      </Head>
      <Navbar />
      {process.env.NEXT_PUBLIC_CMS && <Messages />}
      <Jumbotron
        timeTableList={timeTableList}
        substitutions={substitutions}
        timeTable={timeTable}
      />
      <Footer />
    </>
  );
}

export default Layout;
