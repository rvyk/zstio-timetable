import Content from "@/components/content";
import Footer from "@/components/footer";
import Messages from "@/components/messages";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";

function Layout({
  props: { timeTable, timeTableList, substitutions },
  errorMsg,
}: {
  props: Table;
  errorMsg?: string;
}) {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
        <title>
          {[timeTable?.data?.title, "ZSTiO - Plan lekcji"]
            .filter(Boolean)
            .join(" | ")}
        </title>
        <meta
          property="og:title"
          content={`${
            timeTable?.data?.title ? `${timeTable?.data?.title} | ` : ""
          }ZSTiO - Plan lekcji`}
        />
      </Head>
      <Navbar />
      {process.env.NEXT_PUBLIC_CMS && <Messages />}
      <Jumbotron
        timeTableList={timeTableList}
        substitutions={substitutions}
        timeTable={timeTable}
        errorMsg={errorMsg}
      />
      {!errorMsg && (
        <Content
          timeTable={timeTable}
          substitutions={substitutions}
          timeTableList={timeTableList}
        />
      )}
      <Footer />
    </>
  );
}

export default Layout;
