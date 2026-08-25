import { SCHOOL_WEBSITE } from "@/constants/school";
import { REVALIDATE_TIME } from "@/constants/settings";
import { env } from "@/env";
import { FC } from "react";
import { SchoolNewsCard, type SchoolNewsPost } from "./SchoolNewsCard";

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  bdquo: "„",
  rdquo: "”",
  ndash: "–",
  mdash: "—",
};

const decodeEntities = (html: string) =>
  html.replace(/&(#x?[0-9a-f]+|\w+);/gi, (match, code: string) => {
    if (code[0] !== "#") return ENTITIES[code.toLowerCase()] ?? match;
    const point = Number(
      code[1]?.toLowerCase() === "x" ? `0x${code.slice(2)}` : code.slice(1),
    );
    return Number.isFinite(point) ? String.fromCodePoint(point) : match;
  });

interface WordPressPost {
  id?: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
}

const getLatestPost = async (): Promise<SchoolNewsPost | null> => {
  const endpoint =
    env.NEXT_PUBLIC_SCHOOL_NEWS_URL ?? `${SCHOOL_WEBSITE}/wp-json/wp/v2/posts`;

  try {
    const response = await fetch(
      `${endpoint}?per_page=1&_fields=id,date,link,title`,
      { next: { revalidate: REVALIDATE_TIME } },
    );
    if (!response.ok) return null;

    const post = ((await response.json()) as WordPressPost[]).at(0);
    if (!post?.id || !post.link || !post.title?.rendered) return null;

    return {
      id: post.id,
      date: post.date ?? "",
      link: post.link,
      title: decodeEntities(post.title.rendered),
    };
  } catch (error) {
    console.error("Failed to fetch school news:", error);
    return null;
  }
};

export const SchoolNews: FC = async () => {
  const post = await getLatestPost();

  return post ? <SchoolNewsCard {...post} /> : null;
};
