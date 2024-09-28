import { fetchSubstitutions } from "@/actions/fetchers/substitutions";
import { Substitutions } from "@/components/substitutions";
import { Topbar } from "@/components/topbar/topbar";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const substitutions = await fetchSubstitutions();

  return {
    title: substitutions.heading,
    description: `Sprawdź zastępstwa w ZSTiO na (${substitutions.timeRange})`,
  };
};

const SubstitutionPage = async () => {
  if (!process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL) {
    redirect("/");
  }

  const substitutions = await fetchSubstitutions();

  return (
    <div className="flex h-full w-full flex-col gap-y-6 overflow-hidden p-8">
      <Topbar substitutions={substitutions} />
      <Substitutions substitutions={substitutions} />
    </div>
  );
};

export default SubstitutionPage;
