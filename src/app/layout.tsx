import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import { SCHOOL_NAME_ACCUSATIVE, SCHOOL_SHORT } from "@/constants/school";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { SerwistProvider } from "./serwist";

export const fetchCache = "default-cache";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SCHOOL_SHORT} - Plan lekcji`,
    default: `${SCHOOL_SHORT} - Plan lekcji`,
  },
  description: `W prosty sposób sprawdź plan zajęć dla różnych klas, nauczycieli oraz sal w ${SCHOOL_NAME_ACCUSATIVE}.`,
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),

  alternates: {
    canonical: "./",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "bg-foreground md:bg-background flex h-dvh font-sans antialiased",
        )}
      >
        <SerwistProvider swUrl="/serwist/sw.js">
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <Toaster />
            <a
              href="#plan"
              className="bg-accent-table sr-only rounded-md px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
            >
              Przejdź do planu
            </a>
            {children}
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
