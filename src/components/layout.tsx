"use client";

import Content from "@/components/content";
import Footer from "@/components/footer";
import Messages from "@/components/messages";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/types/timetable";
import Head from "next/head";
import { usePathname } from "next/navigation";
import React from "react";
import SettingsProvider from "./setting-context";
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
        <title>{isSubstitutions ? titleSubstitutions : titleTimeTable}</title>
        <meta
          property="og:title"
          content={isSubstitutions ? titleSubstitutions : titleTimeTable}
        />
      </Head>
      <SettingsProvider>
        <Navbar />
        {process.env.NEXT_PUBLIC_CMS && <Messages />}
        <Jumbotron {...{ substitutions, timeTable, timeTableList }} />
        {!errorMsg && (
          <Content {...{ substitutions, timeTable, timeTableList }} />
        )}
        <div className={`${!isIndex && !errorMsg && "hidden md:block"}`}>
          <Footer />
        </div>
      </SettingsProvider>
    </>
  );
};

export default Layout;
