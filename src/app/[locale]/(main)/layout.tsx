import { getOptivumList } from "@/actions/getOptivumList";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
  sidebarInfo,
}: {
  children: ReactNode;
  sidebarInfo: ReactNode;
}) {
  const list = await getOptivumList();

  return (
    <>
      <Sidebar list={list} sidebarInfo={sidebarInfo} />
      {children}
    </>
  );
}
