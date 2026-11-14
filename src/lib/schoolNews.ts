import { SCHOOL_WEBSITE } from "@/constants/school";
import { REVALIDATE_TIME } from "@/constants/settings";
import { env } from "@/env";

export interface SchoolNewsPost {
  id: number;
  date: string;
  link: string;
  title: string;
}

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

export const getSchoolNews = async (
  limit: number,
): Promise<SchoolNewsPost[] | null> => {
  const endpoint =
    env.NEXT_PUBLIC_SCHOOL_NEWS_URL ?? `${SCHOOL_WEBSITE}/wp-json/wp/v2/posts`;

  try {
    const response = await fetch(
      `${endpoint}?per_page=${limit}&_fields=id,date,link,title`,
      { next: { revalidate: REVALIDATE_TIME } },
    );
    if (!response.ok) return null;

    const posts = (await response.json()) as WordPressPost[];

    return posts.flatMap((post) =>
      post.id && post.link && post.title?.rendered
        ? [
            {
              id: post.id,
              date: post.date ?? "",
              link: post.link,
              title: decodeEntities(post.title.rendered),
            },
          ]
        : [],
    );
  } catch (error) {
    console.error("Failed to fetch school news:", error);
    return null;
  }
};
