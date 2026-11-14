import {
  SCHOOL_CITY,
  SCHOOL_NAME_ACCUSATIVE,
  SCHOOL_SHORT,
} from "@/constants/school";
import type { Metadata } from "next";

export const SITE_DESCRIPTION = `Aktualny plan lekcji ${SCHOOL_NAME_ACCUSATIVE}. Sprawdź rozkład zajęć klas, nauczycieli i sal oraz wolne sale w całym tygodniu.`;

const SITE_TITLE = `Plan lekcji ${SCHOOL_SHORT} ${SCHOOL_CITY}`;

const SITE_IMAGE = {
  url: "/opengraph-image.png",
  type: "image/png",
  width: 1920,
  height: 1080,
  alt: `${SITE_TITLE} — rozkład zajęć klas, nauczycieli i sal`,
};

export const siteSeo = (path?: string): Metadata => ({
  alternates: path ? { canonical: path } : undefined,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: `Plan lekcji ${SCHOOL_SHORT}`,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: path,
    images: SITE_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: SITE_IMAGE,
  },
});

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
