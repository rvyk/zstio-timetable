import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

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
      </body>
    </html>
  );
};

export default RootLayout;
