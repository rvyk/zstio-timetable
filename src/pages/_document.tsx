import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html lang="pl" suppressHydrationWarning={true}>
      <Head>
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
          name="og:description"
          content="W prosty sposób sprawdź plan zajęć oraz zastępstwa różnych klas, nauczycieli i sal."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta
          name="keywords"
          content="plan zajęć, plan lekcji, plan, zstio, zstiojar, plan zajęć zstiojar, plan lekcji zstiojar"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
