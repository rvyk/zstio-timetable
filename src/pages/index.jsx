import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastSelect = localStorage.getItem("LastSelect");

    lastSelect
      ? router.push(lastSelect, undefined, { shallow: true })
      : router.push("/class/1", undefined, { shallow: true });
  }, [router]);

  return (
    <Head>
      <title>ZSTiO - Plan lekcji | Wczytywanie planu...</title>
      <meta property="og:title" content="Plan lekcji ZSTiO" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
