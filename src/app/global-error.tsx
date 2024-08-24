"use client";

import Footer from "@/components/footer";
import Messages from "@/components/messages";
import SettingsProvider from "@/components/setting-provider";
import TimetableProvider from "@/components/timetable-provider";
import Jumbotron from "@/components/ui/jumbotron";
import Navbar from "@/components/ui/navbar";
import { OptivumTimetable } from "@/types/timetable";
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <TimetableProvider value={{} as OptivumTimetable}>
      <SettingsProvider>
        <Navbar />
        {process.env.NEXT_PUBLIC_CMS && <Messages />}
        <Jumbotron />

        <div className="mb-5 flex flex-col flex-wrap items-center justify-center">
          <p className="mr-1 text-xl font-semibold text-gray-600 dark:text-gray-300 lg:text-2xl">
            Wystąpił problem...
          </p>
          <p className="text-gray-600 dark:text-gray-300 lg:text-lg">
            Spróbuj odświeżyć stronę lub zrób zrzut ekranu konsoli (klawisz F12)
            i zgłoś ten błąd na platformie Github.
          </p>
        </div>
        <Footer />
      </SettingsProvider>
    </TimetableProvider>
  );
}
