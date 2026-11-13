import { getOptivumList } from "@/actions/getOptivumList";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const list = await getOptivumList();

  return (
    <>
      <Sidebar list={list} />
      {children}
    </>
  );
}
