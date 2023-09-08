import Layout from "@/components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home(props) {
  const router = useRouter();

  useEffect(() => {
    const lastSelectValue = localStorage.getItem("LastSelect");
    const redirectTo = lastSelectValue || "/class/1";
    router.push(redirectTo);
  }, [router]);

  return (
    <>
      <Head>
        <title>ZSTiO - Plan lekcji | Wczytywanie planu...</title>
        <meta property="og:title" content="Plan lekcji ZSTiO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout {...props} />
    </>
  );
}

export async function getStaticProps() {
  const timeTable = {
    lessons: [[], [], [], [], []],
    title: "Ładowanie",
  };

  return {
    props: {
      timeTable,
    },
  };
}
