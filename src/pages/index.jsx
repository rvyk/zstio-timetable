import Layout from "@/components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastSelectValue = localStorage.getItem("LastSelect");
    if (lastSelectValue) {
      router.push(lastSelectValue);
    } else {
      router.push("/class/1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>Plan lekcji | Wczytywanie planu...</title>
        <meta property="og:title" content="Plan lekcji ZSTiO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout />
    </>
  );
}
