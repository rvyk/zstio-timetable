import { fetchOptivumList } from "@/lib/fetchers/optivum-list";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { classes, rooms, teachers } = await fetchOptivumList();

  const baseUrl = new URL(process.env.NEXT_PUBLIC_APP_URL as string).origin;

  const classUrls = classes.map((c) => ({
    url: `${baseUrl}/class/${c.value}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.9,
  }));

  const teacherUrls = (teachers ?? []).map((t) => ({
    url: `${baseUrl}/teacher/${t.value}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const roomUrls = (rooms ?? []).map((r) => ({
    url: `${baseUrl}/room/${r.value}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...classUrls,
    ...teacherUrls,
    ...roomUrls,
  ];
}
