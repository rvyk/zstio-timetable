import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pl">
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
      </Head>
      <body className="bg-[#fff] dark:bg-[#202020]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
