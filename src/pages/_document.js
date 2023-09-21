import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="pl">
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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.4/flowbite.min.js"
          async
        ></script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
