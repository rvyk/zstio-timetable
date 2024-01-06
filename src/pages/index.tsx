import Layout from "@/components/layout";
import { Table } from "@/types/timetable";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Home({ ...props }) {
  const router = useRouter();

  useEffect(() => {
    const lastSelect = localStorage.getItem("lastSelect");
    const route = lastSelect || "/class/1";
    router.replace(route);
  }, [router]);

  return <Layout props={props as Table} />;
}

export default Home;
