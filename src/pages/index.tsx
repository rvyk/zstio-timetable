import Event from "@/components/Event";
import JumbotronLarge from "@/components/JumbotronLarge";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const lastSelect = localStorage.getItem("LastSelect");

    lastSelect ? router.replace(lastSelect) : router.replace("/class/1");
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      setHelp(true);
    }, 10000);
  }, []);

  return (
    <>
      <Head>
        <title>ZSTiO - Plan lekcji</title>
        <meta name="og:title" content="ZSTiO - Plan lekcji" />
      </Head>
      <div className="min-h-screen w-screen overflow-hidden flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-[#171717] transition-all">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 first-line:block md:hidden"
        >
          <Event />
          <Image
            src={"/icon-192x192.png"}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
        <JumbotronLarge />
        <div
          className={`transition-all text-gray-500 dark:text-gray-300 flex duration-700 justify-center items-center flex-col ${
            help ? "translate-y-0" : "translate-y-[100vh]"
          }`}
        >
          <p className="text-xl">Utknąłeś?</p>

          <Link
            prefetch={false}
            href="/class/1"
            className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
            type="button"
          >
            Spróbuj przejść dalej
          </Link>

          <button
            className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#202020] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
            type="button"
            onClick={() => {
              window?.location?.reload();
            }}
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    </>
  );
}
