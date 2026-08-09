import { SCHOOL_SHORT } from "@/constants/school";
import type { Metadata } from "next";

/**
 * Next scala metadane płytko: własny `openGraph` na stronie kasuje ten z layoutu
 * razem z og:image i og:type. Dlatego każda podstrona dostaje pełny komplet.
 */
export const pageSeo = (
  title: string,
  description: string,
  path: string,
): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: `Plan lekcji ${SCHOOL_SHORT}`,
    title,
    description,
    url: path,
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: "/opengraph-image.png",
  },
});
