import { ThemeProvider } from "@/components/common/ThemeProvider";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/Toaster";
import { SCHOOL_NAME_ACCUSATIVE, SCHOOL_SHORT } from "@/constants/school";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

export const fetchCache = "default-cache";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SCHOOL_SHORT} - Plan lekcji`,
    default: `${SCHOOL_SHORT} - Plan lekcji`,
  },
  description: `W prosty sposób sprawdź plan zajęć dla różnych klas, nauczycieli oraz sal w ${SCHOOL_NAME_ACCUSATIVE}.`,
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL as string),

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
    <html lang="pl" suppressHydrationWarning>
      <body
        className={cn(
          poppins.className,
          "bg-foreground md:bg-background flex h-screen antialiased",
        )}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Toaster />
          <Sidebar />
          {children}
          <SettingsPanel />
          {/* <AnnouncementModal /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
