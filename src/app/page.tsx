"use client";

import Footer from "@/components/footer";
import Messages from "@/components/messages";
import SettingsProvider from "@/components/setting-provider";
import TimetableProvider from "@/components/timetable-provider";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { OptivumTimetable } from "@/types/timetable";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const lastSelect = localStorage.getItem("lastSelect");
    const route = lastSelect || "/class/1";
    router.replace(route);
  }, [router]);

  return (
    <TimetableProvider value={{} as OptivumTimetable}>
      <SettingsProvider>
        <Navbar />
        {process.env.NEXT_PUBLIC_CMS && <Messages />}
        <Jumbotron />
        <Footer />
      </SettingsProvider>
    </TimetableProvider>
  );
};

export default Home;
