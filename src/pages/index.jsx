import Layout from "@/components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastSelectValue = localStorage.getItem("LastSelect");
    lastSelectValue
      ? router.replace(lastSelectValue)
      : router.replace("/class/1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>Wczytywanie planu...</title>
        <meta
          name="description"
          content="Plan lekcji ZSTiO w odświeżonym stylu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout />
    </>
  );
}
