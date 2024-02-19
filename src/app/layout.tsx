import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pl">
      <head>
        <meta
          name="msapplication-TileImage"
          content="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-270x270.png"
        ></meta>
        <link
          rel="apple-touch-icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-180x180.png"
        ></link>
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-192x192.png"
          sizes="192x192"
        ></link>
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-32x32.png"
          sizes="32x32"
        ></link>
        <meta
          name="description"
          content="W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal."
        />
        <meta
          name="keywords"
          content="plan zajęć, plan lekcji, plan, zstio, zstiojar, plan zajęć zstiojar, plan lekcji zstiojar"
        />
        {/* ----- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://plan.zstiojar.edu.pl/" />
        <meta property="og:title" content="ZSTiO - Plan lekcji" />
        <meta
          property="og:description"
          content="W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal."
        />
        <meta property="og:image" content="/og-image.png" />
        {/* ----- */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://plan.zstiojar.edu.pl/" />
        <meta property="twitter:title" content="ZSTiO - Plan lekcji" />
        <meta
          property="twitter:description"
          content="W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal."
        />
        <meta property="twitter:image" content="/og-image.png" />
        {/* ----- */}
        <link rel="manifest" href="/manifest.json" />
      </head>
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
