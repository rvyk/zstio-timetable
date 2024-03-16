import defaults from "@/app.config";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata, Viewport } from "next";
import { Poppins as FontSans } from "next/font/google";
import React from "react";
import "./globals.css";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
    themeColor: defaults.themeColor,
};

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
        languages: {
            "en-US": "/en-US",
            "pl-PL": "/pl-PL",
        },
    },
    title: defaults.title,
    description: defaults.description,
    openGraph: {
        title: defaults.title,
        description: defaults.description,
        siteName: defaults.title,
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: defaults.title,
        card: "summary",
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.variable} relative font-sans antialiased`}>
                <noscript>
                    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
                        <h1 className="text-4xl font-bold">Włącz JavaScript!</h1>
                        <p className="text-xl">Ta strona nie działa bez włączonego JavaScriptu.</p>
                    </div>
                </noscript>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
