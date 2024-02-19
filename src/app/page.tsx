"use client";

import Layout from "@/components/layout";
import { Table } from "@/types/timetable";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const lastSelect = localStorage.getItem("lastSelect");
    const route = lastSelect || "/class/1";
    router.replace(route);
  }, [router]);

  return <Layout props={{} as Table} />;
};

export default Home;
