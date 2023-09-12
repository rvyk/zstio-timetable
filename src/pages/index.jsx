import Head from "next/head";

export default function Home(props) {
  return (
    <Head>
      <title>ZSTiO - Plan lekcji | Wczytywanie planu...</title>
      <meta property="og:title" content="Plan lekcji ZSTiO" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="refresh" content="0; url=/class/1" />
    </Head>
  );
}
