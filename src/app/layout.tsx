import { fetchSubstitutions } from "@/actions/fetchers/substitutions";
import { SettingsPanel } from "@/components/settings-panel/settings-panel";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SubstitutionsController } from "@/components/substitutions-controller";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ReactNode } from "react";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),

  alternates: {
    canonical: "./",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const substitutions = await fetchSubstitutions();

  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={cn(
          poppins.className,
          "flex h-screen bg-background antialiased",
        )}
      >
        <SubstitutionsController substitutions={substitutions} />
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Sidebar />
          {children}
          <SettingsPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
