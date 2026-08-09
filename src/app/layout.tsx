import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import {
  SCHOOL_CITY,
  SCHOOL_NAME,
  SCHOOL_NAME_ACCUSATIVE,
  SCHOOL_SHORT,
  SCHOOL_WEBSITE,
} from "@/constants/school";
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

const DESCRIPTION = `Aktualny plan lekcji ${SCHOOL_NAME_ACCUSATIVE}. Sprawdź rozkład zajęć klas, nauczycieli i sal oraz wolne sale w całym tygodniu.`;

export const metadata: Metadata = {
  title: {
    template: `%s | ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
    default: `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
  },
  description: DESCRIPTION,
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  applicationName: `Plan lekcji ${SCHOOL_SHORT}`,
  keywords: [
    `plan lekcji ${SCHOOL_SHORT}`,
    `${SCHOOL_SHORT} ${SCHOOL_CITY}`,
    "plan lekcji Jarosław",
    "rozkład zajęć",
    "zastępstwa",
    "wolne sale",
    "plan nauczycieli",
  ],
  authors: [{ name: "rvyk", url: "https://github.com/rvyk" }],
  creator: "rvyk",
  publisher: SCHOOL_NAME,

  alternates: {
    canonical: "./",
  },

  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: `Plan lekcji ${SCHOOL_SHORT}`,
    title: `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
    description: DESCRIPTION,
    url: "./",
  },

  twitter: {
    card: "summary_large_image",
    title: `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
    description: DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  appleWebApp: {
    capable: true,
    title: `Plan lekcji ${SCHOOL_SHORT}`,
    statusBarStyle: "black-translucent",
  },

  formatDetection: { telephone: false, date: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // bez tego env(safe-area-inset-*) jest zerowe i dolny pasek wchodzi pod pasek gestów
  viewportFit: "cover",
  // bez maximumScale — blokada zoomu to bariera dostępności i sygnał „mobile unfriendly”
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** Google potrzebuje jawnej informacji, czyj to plan i kto go publikuje. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SCHOOL_WEBSITE}/#school`,
      name: SCHOOL_NAME,
      alternateName: SCHOOL_SHORT,
      url: SCHOOL_WEBSITE,
      address: {
        "@type": "PostalAddress",
        addressLocality: SCHOOL_CITY,
        addressCountry: "PL",
      },
    },
    {
      "@type": "WebSite",
      url: env.NEXT_PUBLIC_APP_URL,
      name: `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
      description: DESCRIPTION,
      inLanguage: "pl-PL",
      publisher: { "@id": `${SCHOOL_WEBSITE}/#school` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "bg-foreground md:bg-background flex h-dvh font-sans antialiased",
        )}
      >
        <SerwistProvider swUrl="/serwist/sw.js">
          {/* bez disableTransitionOnChange: next-themes wstrzykiwał na czas
              podmiany `* { transition: none !important }`, co zabijało jedyny
              ruch dziejący się dokładnie wtedy — przejazd pigułki motywu.
              Kolory i tak zmieniają się przez własne transition-colors */}
          <ThemeProvider attribute="class">
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
