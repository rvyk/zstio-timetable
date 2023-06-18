import Layout from "@/components/Layout";
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
  return <Layout />;
}
