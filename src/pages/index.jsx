import JumbotronLarge from "@/components/JumbotronLarge";
import Navbar from "@/components/Navbar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const lastSelect = localStorage.getItem("LastSelect");

    lastSelect
      ? router.push(lastSelect, undefined, { shallow: true })
      : router.push("/class/1", undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      setHelp(true);
    }, 10000);
  }, []);
  return (
    <>
      <Head>
        <title>ZSTiO - Plan lekcji | Wczytywanie planu...</title>
        <meta property="og:title" content="Plan lekcji ZSTiO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen w-screen overflow-hidden flex flex-col justify-center items-center lg:bg-[#F7F3F5] bg-[#fff] dark:bg-[#202020] lg:dark:bg-[#171717] transition-all">
        <Link href={"https://zstiojar.edu.pl"} className="block md:hidden">
          <img alt="logo" className="w-20 h-20" src={"/icon-192x192.png"} />
        </Link>
        <JumbotronLarge />
        <div
          className={`transition-all text-gray-500 dark:text-gray-300 flex duration-700 justify-center items-center flex-col ${
            help ? "translate-y-0" : "translate-y-[100vh]"
          }`}
        >
          <p className="text-xl">Utknąłeś?</p>
          <Link
            href="/class/1"
            className="border-b dark:border-red-400 border-gray-300 px-4"
          >
            Kliknij tutaj, aby przejść dalej
          </Link>
        </div>
      </div>
    </>
  );
}
