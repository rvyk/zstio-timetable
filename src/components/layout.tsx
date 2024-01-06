import Footer from "@/components/footer";
import Messages from "@/components/messages";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";

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
        status={status}
      />
      <Footer />
    </>
  );
}

export default Layout;
