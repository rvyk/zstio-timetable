import { Sidebar } from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
