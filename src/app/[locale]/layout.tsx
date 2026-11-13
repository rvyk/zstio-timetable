import { LocaleProvider } from "@/components/common/LocaleProvider";
import { ServiceWorker } from "@/components/common/ServiceWorker";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import {
  SCHOOL_CITY,
  SCHOOL_NAME,
  SCHOOL_SHORT,
  SCHOOL_WEBSITE,
} from "@/constants/school";
import { env } from "@/env";
import { LOCALES, t } from "@/lib/i18n";
import { getLocale, type LocaleParams } from "@/lib/locale.server";
import { SITE_DESCRIPTION, siteSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";

export const fetchCache = "default-cache";

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  ...siteSeo(),
  title: {
    template: `%s | ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
    default: `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`,
  },
  description: SITE_DESCRIPTION,
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
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

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
      description: SITE_DESCRIPTION,
      inLanguage: "pl-PL",
      publisher: { "@id": `${SCHOOL_WEBSITE}/#school` },
    },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: LocaleParams;
}>) {
  const locale = await getLocale(params);

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "bg-foreground md:bg-background flex h-dvh font-sans antialiased",
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","");try{var a=JSON.parse(localStorage.getItem("timetable-settings")).state.a11y;for(var k in a)if(a[k])document.documentElement.setAttribute("data-a11y-"+k,"")}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {env.NEXT_PUBLIC_DISABLE_ANALYTICS !== "true" && <Analytics />}
        <ServiceWorker />
        <ThemeProvider attribute="class">
          <LocaleProvider locale={locale}>
            <Toaster />
            <a
              href="#plan"
              className="bg-accent-table sr-only rounded-md px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
            >
              {t(locale, "skipToPlan")}
            </a>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
