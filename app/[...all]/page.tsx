import { MainLayout } from "@/components/main-layout";
import fetchOptivumList from "@/lib/fetchers/fetch-optivum-list";

export default function Home({ params }: { params: { all: string[] } }) {
  const [type, value] = params.all;
  // TODO: do something now xD
  if (!["class", "room", "teacher"].includes(type)) return null;
  if (!value) return null;
  return <MainLayout type={type} value={value} />;
}

export async function generateStaticParams() {
  const { classes, rooms, teachers } = await fetchOptivumList();
  const paths = [
    ...classes.map((c) => ({ all: ["class", c.value] })),
    ...(rooms ?? []).map((r) => ({ all: ["room", r.value] })),
    ...(teachers ?? []).map((t) => ({ all: ["teacher", t.value] })),
  ];
  return paths;
}

export const dynamic = "error",
  dynamicParams = false,
  revalidate = 10800;
