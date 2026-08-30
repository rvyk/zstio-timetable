import { env } from "@/env";

export const revalidate = 3600;

export const GET = async () => {
  const url = env.NEXT_PUBLIC_ALT_TIMETABLE_URL;
  if (!url) return Response.json({ ok: false });

  const ok = await fetch(url, { method: "HEAD", redirect: "follow" })
    .then((response) => response.ok)
    .catch(() => false);

  return Response.json({ ok });
};
