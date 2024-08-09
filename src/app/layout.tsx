import Notifications from "@/components/notifications";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import fetchOptivumTimetable from "@/lib/fetchers/fetchOptivumTimetable";
import ogimage from "@/media/og-image.png";
import "@/styles/globals.css";
import { Metadata } from "next";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pl">
      <body className="flex min-h-screen w-full flex-col justify-center !bg-[#F7F3F5] dark:!bg-[#171717]">
        <noscript>
          <div className="flex h-screen w-screen flex-col items-center justify-center bg-white text-center text-black">
            <h1 className="text-4xl font-bold">Włącz JavaScript!</h1>
            <p className="text-xl">
              Ta strona nie działa bez włączonego JavaScriptu.
            </p>
            <a href={process.env.NEXT_PUBLIC_TIMETABLE_URL}>
              Przejdź do źródła
            </a>
          </div>
          <meta
            httpEquiv="refresh"
            content={`5;url=${process.env.NEXT_PUBLIC_TIMETABLE_URL}`}
          />
        </noscript>
        <ThemeProvider attribute="class">
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Notifications />
      </body>
    </html>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { all: string[] };
}): Promise<Metadata> {
  const timeTable =
    params.all?.length > 1
      ? await fetchOptivumTimetable(params.all[0], params.all[1]).catch()
      : null;
  const titleTimeTable = `${
    timeTable?.title ? `${timeTable?.title} | ` : ""
  }ZSTiO - Plan lekcji`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_HOST as string),
    title: titleTimeTable,
    description:
      "W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal.",
    openGraph: {
      images: [`${ogimage.src}?text=${timeTable?.title}`],
    },
  };
}

export default RootLayout;
