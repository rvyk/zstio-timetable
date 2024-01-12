import Content from "@/components/content";
import Footer from "@/components/footer";
import Messages from "@/components/messages";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";
import { usePathname } from "next/navigation";
import React from "react";

interface LayoutProps {
  props: Table;
  errorMsg?: string;
}

const Layout: React.FC<LayoutProps> = ({
  props: { timeTable, timeTableList, substitutions },
  errorMsg,
}) => {
  const pathname = usePathname();
  const isIndex = pathname == "/";
  const isSubstitutions = pathname == "/zastepstwa";

  const titleTimeTable = `${
    timeTable?.data?.title ? `${timeTable?.data?.title} | ` : ""
  }ZSTiO - Plan lekcji`;
  const titleSubstitutions = `ZSTiO - Zastępstwa`;

  return (
    <>
      <Head>
        <link rel="canonical" href="https://plan.zstiojar.edu.pl" />
        <title>{isSubstitutions ? titleSubstitutions : titleTimeTable}</title>
        <meta
          property="og:title"
          content={isSubstitutions ? titleSubstitutions : titleTimeTable}
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
        <Content timeTable={timeTable} substitutions={substitutions} />
      )}
      <div className={`${!isIndex && !errorMsg && "hidden md:block"}`}>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
