import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ZSTiO - Plan lekcji",
    default: "ZSTiO - Plan lekcji",
  },
  description:
    "W prosty sposób sprawdź plan zajęć i zastępstwa dla różnych klas, nauczycieli oraz sal w Zespole Szkół Technicznych i Ogólnokształcących im. Stefana Banacha w Jarosławiu.",
  metadataBase: new URL(process.env.APP_URL as string),

  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={cn(poppins.className, "flex bg-background antialiased")}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
