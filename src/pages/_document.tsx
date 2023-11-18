import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html lang="pl" suppressHydrationWarning={true}>
      <Head>
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-32x32.png"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-192x192.png"
          sizes="192x192"
        ></link>
        <link
          rel="apple-touch-icon"
          href="https://zstiojar.edu.pl/wp-content/uploads/2023/03/cropped-cropped-cropped-bez-tla-1-180x180.png"
        ></link>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
