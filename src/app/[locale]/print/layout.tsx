import { siteSeo } from "@/lib/seo";
import { ReactNode } from "react";

export const metadata = siteSeo("/print");

export default function PrintLayout({ children }: { children: ReactNode }) {
  return children;
}
