import { getOptivumList } from "@/actions/getOptivumList";
import { env } from "@/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { classes, rooms, teachers } = await getOptivumList();

  const baseUrl = new URL(env.NEXT_PUBLIC_APP_URL).origin;
  const lastModified = new Date();

  // plan bywa korygowany w trakcie roku — "yearly" zniechęcało Google do powrotu
  const entry = (path: string, priority: number) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
  });

  return [
    entry("", 1),
    entry("/free-rooms", 0.8),
    ...classes.map((c) => entry(`/class/${c.value}`, 0.9)),
    ...(teachers ?? []).map((t) => entry(`/teacher/${t.value}`, 0.7)),
    ...(rooms ?? []).map((r) => entry(`/room/${r.value}`, 0.6)),
  ];
}
