import Layout from "@/components/layout";
import { Table } from "@/types/timetable";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Home({ ...props }) {
  const router = useRouter();

  useEffect(() => {
    const lastSelect = localStorage.getItem("LastSelect");

    lastSelect ? router.replace(lastSelect) : router.replace("/class/1");
  }, [router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Layout props={props as Table} />
    </div>
  );
}

export default Home;
